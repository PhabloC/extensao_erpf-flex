(function bootstrapErpFlexCollector() {
  function normalizeText(value) {
    return String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeKey(value) {
    return normalizeText(value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function isMeaningfulValue(value) {
    const normalized = normalizeText(value);

    return Boolean(normalized && normalized !== '-' && normalized !== '--');
  }

  function parseBrazilianNumber(rawValue) {
    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
      return rawValue;
    }

    const normalized = normalizeText(rawValue)
      .replace(/[^\d,.-]/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
  }

  function parseDateValue(rawValue) {
    const normalized = normalizeText(rawValue);

    if (!normalized) {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      return normalized;
    }

    const brDateMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (brDateMatch) {
      return `${brDateMatch[3]}-${brDateMatch[2]}-${brDateMatch[1]}`;
    }

    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toISOString().slice(0, 10);
  }

  function getElementText(element) {
    if (!element) {
      return '';
    }

    if ('value' in element && isMeaningfulValue(element.value)) {
      return normalizeText(element.value);
    }

    return normalizeText(element.textContent);
  }

  function queryFirstMeaningfulValue(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const value = getElementText(element);

      if (isMeaningfulValue(value)) {
        return value;
      }
    }

    return '';
  }

  function extractValueNearLabel(labelTerms) {
    const normalizedLabelTerms = labelTerms.map(normalizeKey);
    const candidates = document.querySelectorAll(
      'label, th, dt, strong, b, span, div, td',
    );

    for (const candidate of candidates) {
      const labelText = normalizeKey(candidate.textContent);

      if (!labelText) {
        continue;
      }

      const matches = normalizedLabelTerms.some((term) => labelText.includes(term));

      if (!matches) {
        continue;
      }

      const nextElementValue = getElementText(candidate.nextElementSibling);

      if (isMeaningfulValue(nextElementValue)) {
        return nextElementValue;
      }

      const parent = candidate.parentElement;

      if (parent) {
        const cells = Array.from(parent.children)
          .filter((child) => child !== candidate)
          .map(getElementText)
          .find(isMeaningfulValue);

        if (cells) {
          return cells;
        }
      }
    }

    return '';
  }

  function collectStructuredCandidates() {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/json"], script[type="application/ld+json"]'),
    );
    const candidates = {};
    const aliasMap = {
      externalOrderId: ['externalorderid', 'idordemproducao', 'idop', 'ordemproducaoid'],
      orderNumber: ['ordernumber', 'numeroordem', 'numeroop', 'ordemdeproducao', 'nrordem'],
      productCode: ['productcode', 'codigoproduto', 'codproduto', 'itemcode'],
      productDescription: ['productdescription', 'descricaoproduto', 'produto', 'descricaoitem'],
      quantity: ['quantity', 'quantidade', 'qtd', 'qty'],
      unit: ['unit', 'unidade', 'uom'],
      issueDate: ['issuedate', 'dataemissao', 'emissao'],
      dueDate: ['duedate', 'dataentrega', 'dataprazo', 'prazoproducao'],
      notes: ['notes', 'observacoes', 'obs'],
    };

    function assignCandidate(key, value) {
      if (!isMeaningfulValue(value) && typeof value !== 'number') {
        return;
      }

      if (candidates[key] === undefined || candidates[key] === null || candidates[key] === '') {
        candidates[key] = value;
      }
    }

    function inspectNode(node) {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        node.forEach(inspectNode);
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        const normalizedKeyName = normalizeKey(key).replace(/[^a-z0-9]/g, '');

        for (const [candidateKey, aliases] of Object.entries(aliasMap)) {
          if (aliases.includes(normalizedKeyName)) {
            assignCandidate(candidateKey, value);
          }
        }

        if (value && typeof value === 'object') {
          inspectNode(value);
        }
      }
    }

    for (const scriptElement of scripts) {
      const rawContent = scriptElement.textContent;

      if (!rawContent || rawContent.length > 300000) {
        continue;
      }

      try {
        const parsed = JSON.parse(rawContent);
        inspectNode(parsed);
      } catch {
        continue;
      }
    }

    return candidates;
  }

  function detectSupportedPage(candidates) {
    const normalizedUrl = normalizeKey(window.location.href);
    const headingText = normalizeKey(document.body?.innerText?.slice(0, 1200) ?? '');
    const hasUrlHint =
      normalizedUrl.includes('ordem') ||
      normalizedUrl.includes('op') ||
      normalizedUrl.includes('producao') ||
      normalizedUrl.includes('production');
    const hasPageHint =
      headingText.includes('ordem de producao') ||
      headingText.includes('ordem producao') ||
      headingText.includes('op ') ||
      headingText.includes('ordem de produção');
    const hasFieldHint =
      isMeaningfulValue(candidates.orderNumber) ||
      isMeaningfulValue(candidates.productCode) ||
      isMeaningfulValue(candidates.productDescription);

    return hasUrlHint || hasPageHint || hasFieldHint;
  }

  function collectDomCandidates() {
    return {
      externalOrderId:
        queryFirstMeaningfulValue([
          '[data-external-order-id]',
          '[data-order-id]',
          'input[name*="ordem"][name*="id"]',
          'input[name*="op"][name*="id"]',
        ]) || extractValueNearLabel(['id ordem', 'id op', 'id da ordem']),
      orderNumber:
        queryFirstMeaningfulValue([
          '[data-order-number]',
          '[data-op-number]',
          'input[name="orderNumber"]',
          'input[name*="ordem"]',
          'input[name*="op"]',
        ]) ||
        extractValueNearLabel([
          'ordem de producao',
          'ordem producao',
          'numero da ordem',
          'numero da op',
          'ordem',
          'op',
        ]),
      productCode:
        queryFirstMeaningfulValue([
          '[data-product-code]',
          'input[name="productCode"]',
          'input[name*="produto"][name*="codigo"]',
          'input[name*="codproduto"]',
        ]) || extractValueNearLabel(['codigo do produto', 'cod produto', 'produto codigo']),
      productDescription:
        queryFirstMeaningfulValue([
          '[data-product-description]',
          'textarea[name="productDescription"]',
          'input[name="productDescription"]',
          'input[name*="descricao"]',
        ]) ||
        extractValueNearLabel([
          'descricao do produto',
          'descricao produto',
          'produto',
          'descricao item',
        ]),
      quantity:
        queryFirstMeaningfulValue([
          '[data-quantity]',
          'input[name="quantity"]',
          'input[name*="quantidade"]',
          'input[name*="qtd"]',
        ]) || extractValueNearLabel(['quantidade', 'qtd']),
      unit:
        queryFirstMeaningfulValue([
          '[data-unit]',
          'input[name="unit"]',
          'input[name*="unidade"]',
        ]) || extractValueNearLabel(['unidade', 'u.m.', 'um']),
      issueDate:
        queryFirstMeaningfulValue([
          '[data-issue-date]',
          'input[name="issueDate"]',
          'input[name*="emissao"]',
        ]) || extractValueNearLabel(['data emissao', 'emissao']),
      dueDate:
        queryFirstMeaningfulValue([
          '[data-due-date]',
          'input[name="dueDate"]',
          'input[name*="entrega"]',
          'input[name*="prazo"]',
        ]) || extractValueNearLabel(['data entrega', 'prazo', 'prazo producao']),
      notes:
        queryFirstMeaningfulValue([
          '[data-notes]',
          'textarea[name="notes"]',
          'textarea[name*="observ"]',
        ]) || extractValueNearLabel(['observacoes', 'obs']),
    };
  }

  function buildImportPayload() {
    const structuredCandidates = collectStructuredCandidates();
    const domCandidates = collectDomCandidates();
    const mergedCandidates = {
      ...domCandidates,
      ...Object.fromEntries(
        Object.entries(structuredCandidates).filter(([, value]) => {
          return value !== undefined && value !== null && value !== '';
        }),
      ),
    };
    const payload = {
      externalOrderId: normalizeText(
        mergedCandidates.externalOrderId || mergedCandidates.orderNumber,
      ),
      orderNumber: normalizeText(
        mergedCandidates.orderNumber || mergedCandidates.externalOrderId,
      ),
      item: {
        productCode: normalizeText(mergedCandidates.productCode),
        productDescription: normalizeText(mergedCandidates.productDescription),
        quantity: parseBrazilianNumber(mergedCandidates.quantity),
        unit: normalizeText(mergedCandidates.unit) || undefined,
      },
      issueDate: parseDateValue(mergedCandidates.issueDate) || undefined,
      dueDate: parseDateValue(mergedCandidates.dueDate) || undefined,
      notes: normalizeText(mergedCandidates.notes) || undefined,
      sourcePageUrl: window.location.href,
      rawPayload: {
        extractionStrategy: structuredCandidates.orderNumber ? 'structured+dom' : 'dom',
        collectedAt: new Date().toISOString(),
        candidates: mergedCandidates,
      },
    };
    const missingFields = [];

    if (!payload.externalOrderId) {
      missingFields.push('externalOrderId');
    }

    if (!payload.orderNumber) {
      missingFields.push('orderNumber');
    }

    if (!payload.item.productCode) {
      missingFields.push('item.productCode');
    }

    if (!payload.item.productDescription) {
      missingFields.push('item.productDescription');
    }

    if (typeof payload.item.quantity !== 'number' || payload.item.quantity <= 0) {
      missingFields.push('item.quantity');
    }

    return {
      supportedPage: detectSupportedPage(mergedCandidates),
      payload,
      missingFields,
      extractionMeta: {
        usedStructuredSource: Boolean(structuredCandidates.orderNumber),
        sourcePageUrl: window.location.href,
      },
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'ERP_FLEX_COLLECT_ORDER') {
      return;
    }

    const result = buildImportPayload();

    if (!result.supportedPage) {
      sendResponse({
        ok: false,
        code: 'ERP_FLEX_UNSUPPORTED_PAGE',
        message:
          'A pagina atual nao parece ser uma ordem de producao suportada do ERP Flex.',
        extractionMeta: result.extractionMeta,
      });
      return;
    }

    if (result.missingFields.length > 0) {
      sendResponse({
        ok: false,
        code: 'ERP_FLEX_REQUIRED_FIELDS_MISSING',
        message: 'Nao foi possivel capturar todos os campos obrigatorios da ordem.',
        missingFields: result.missingFields,
        payloadPreview: result.payload,
        extractionMeta: result.extractionMeta,
      });
      return;
    }

    sendResponse({
      ok: true,
      payload: result.payload,
      extractionMeta: result.extractionMeta,
    });
  });
})();
