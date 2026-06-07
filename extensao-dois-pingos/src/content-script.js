(function bootstrapErpFlexCollector() {
  const ERP_LIST_DATA_PATH_PATTERN =
    /\/erp\/lancamentos\/producao\/ordensproducao(?:\/data)?(?:\/)?$/i;

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

  function formatDateForErp(rawValue) {
    const normalized = parseDateValue(rawValue);

    if (!normalized) {
      return '';
    }

    const [year, month, day] = normalized.split('-');
    return `${day}/${month}/${year}`;
  }

  function readEmissionFiltersFromUrl() {
    const currentUrl = new URL(window.location.href);
    const issueDateFrom = parseDateValue(currentUrl.searchParams.get('SC2_Emissao_De'));
    const issueDateTo = parseDateValue(currentUrl.searchParams.get('SC2_Emissao_Ate'));

    return {
      issueDateFrom,
      issueDateTo,
    };
  }

  function isRecordWithinIssueDateRange(record, filters) {
    const recordIssueDate = parseDateValue(record?.SC2_Emissao);

    if (!recordIssueDate) {
      return true;
    }

    if (filters.issueDateFrom && recordIssueDate < filters.issueDateFrom) {
      return false;
    }

    if (filters.issueDateTo && recordIssueDate > filters.issueDateTo) {
      return false;
    }

    return true;
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

  function safeJsonParse(rawValue) {
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return null;
    }
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
      baseProduct: ['baseproduct', 'produtobase', 'produtooriginal', 'produto'],
      variations: ['variations', 'variacao', 'variacoes', 'grade', 'atributos'],
      color: ['color', 'cor'],
      size: ['size', 'tamanho'],
      quantity: ['quantity', 'quantidade', 'qtd', 'qty'],
      unit: ['unit', 'unidade', 'uom'],
      issueDate: ['issuedate', 'dataemissao', 'emissao'],
      dueDate: ['duedate', 'dataentrega', 'dataprazo', 'prazoproducao'],
      customerName: ['customername', 'cliente', 'razaosocial', 'fantasia'],
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

  function collectPageBootstrapCandidates() {
    const globalCandidates = [
      window.__INITIAL_STATE__,
      window.__NEXT_DATA__,
      window.__DATA__,
      window.__BOOTSTRAP__,
      window.erpFlexData,
      window.erpflexData,
    ];
    const candidateMap = {};

    function assignIfMeaningful(key, value) {
      if (!isMeaningfulValue(value) && typeof value !== 'number') {
        return;
      }

      if (!candidateMap[key]) {
        candidateMap[key] = value;
      }
    }

    function walkNode(node) {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        node.forEach(walkNode);
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        const normalizedKeyName = normalizeKey(key).replace(/[^a-z0-9]/g, '');

        if (
          [
            'sc2id',
            'sc2doc',
            'sb1codigo',
            'sb1desc',
            'xxxdescchaveitensvar',
            'sc2quant',
            'sb1um',
            'sc2emissao',
            'sc2previsao',
          ].includes(normalizedKeyName)
        ) {
          assignIfMeaningful(normalizedKeyName, value);
        }

        if (value && typeof value === 'object') {
          walkNode(value);
        }
      }
    }

    globalCandidates.forEach(walkNode);

    document
      .querySelectorAll('script[type="application/json"], script:not([src])')
      .forEach((scriptElement) => {
        const parsed = safeJsonParse(scriptElement.textContent);

        if (parsed) {
          walkNode(parsed);
        }
      });

    return {
      externalOrderId: candidateMap.sc2id,
      orderNumber: candidateMap.sc2doc,
      productCode: candidateMap.sb1codigo,
      productDescription: candidateMap.sb1desc,
      customerName: candidateMap.sa1desc || candidateMap.sa1fantasia,
      variations: candidateMap.xxxdescchaveitensvar,
      quantity: candidateMap.sc2quant,
      unit: candidateMap.sb1um,
      issueDate: candidateMap.sc2emissao,
      dueDate: candidateMap.sc2previsao,
    };
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
      customerName:
        queryFirstMeaningfulValue([
          '[data-customer-name]',
          'input[name="customerName"]',
          'input[name*="cliente"]',
        ]) ||
        extractValueNearLabel(['cliente', 'razao social', 'fantasia']),
      baseProduct:
        queryFirstMeaningfulValue([
          '[data-base-product]',
          'input[name="baseProduct"]',
          'input[name*="produto"][name*="base"]',
        ]) || extractValueNearLabel(['produto base', 'produto original']),
      variations:
        queryFirstMeaningfulValue([
          '[data-variations]',
          'input[name="variations"]',
          'input[name*="variacao"]',
          'input[name*="grade"]',
        ]) || extractValueNearLabel(['variacoes', 'variacao', 'grade']),
      color:
        queryFirstMeaningfulValue([
          '[data-color]',
          'input[name="color"]',
          'input[name*="cor"]',
        ]) || extractValueNearLabel(['cor']),
      size:
        queryFirstMeaningfulValue([
          '[data-size]',
          'input[name="size"]',
          'input[name*="tamanho"]',
        ]) || extractValueNearLabel(['tamanho']),
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

  function getEndpointCandidates(filters = {}) {
    const currentUrl = new URL(window.location.href);
    const candidates = new Set();
    const currentPath = currentUrl.pathname.replace(/\/+$/, '');

    if (Object.prototype.hasOwnProperty.call(filters, 'issueDateFrom')) {
      if (filters.issueDateFrom) {
        currentUrl.searchParams.set(
          'SC2_Emissao_De',
          formatDateForErp(filters.issueDateFrom),
        );
      } else {
        currentUrl.searchParams.delete('SC2_Emissao_De');
      }
    }

    if (Object.prototype.hasOwnProperty.call(filters, 'issueDateTo')) {
      if (filters.issueDateTo) {
        currentUrl.searchParams.set(
          'SC2_Emissao_Ate',
          formatDateForErp(filters.issueDateTo),
        );
      } else {
        currentUrl.searchParams.delete('SC2_Emissao_Ate');
      }
    }

    if (ERP_LIST_DATA_PATH_PATTERN.test(currentPath)) {
      if (currentPath.endsWith('/data')) {
        candidates.add(currentUrl.toString());
      } else {
        const endpointUrl = new URL(`${currentPath}/data`, currentUrl.origin);
        endpointUrl.search = currentUrl.search;
        candidates.add(endpointUrl.toString());
      }
    }

    if (!currentPath.endsWith('/data')) {
      const fallbackDataUrl = new URL(
        `${currentPath}/data`,
        currentUrl.origin,
      );
      fallbackDataUrl.search = currentUrl.search;
      candidates.add(fallbackDataUrl.toString());
    }

    return Array.from(candidates);
  }

  async function fetchStructuredEndpointData(filters = {}) {
    const endpointCandidates = getEndpointCandidates(filters);

    for (const endpointUrl of endpointCandidates) {
      try {
        const response = await fetch(endpointUrl, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          continue;
        }

        const contentType = response.headers.get('content-type') ?? '';

        if (!contentType.includes('application/json')) {
          continue;
        }

        const payload = await response.json();

        if (Array.isArray(payload?.data)) {
          return {
            endpointUrl,
            payload,
          };
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  function normalizeStructuredOrder(record) {
    if (!record || typeof record !== 'object') {
      return null;
    }

    const notes = [];

    for (let index = 1; index <= 30; index += 1) {
      const fieldValue = normalizeText(record[`SC2_Campo${index}`]);

      if (fieldValue) {
        notes.push(fieldValue);
      }
    }

    const item = {
      productCode: normalizeText(record.SB1_Codigo),
      productDescription: normalizeText(record.SB1_Desc),
      quantity: parseBrazilianNumber(record.SC2_Quant),
      unit: normalizeText(record.SB1_UM) || undefined,
    };

    return {
      externalOrderId:
        normalizeText(record.SC2_ID) || normalizeText(record.SC2_Doc),
      orderNumber:
        normalizeText(record.SC2_Doc) || normalizeText(record.SC2_ID),
      item,
      issueDate: parseDateValue(record.SC2_Emissao) || undefined,
      dueDate: parseDateValue(record.SC2_Previsao) || undefined,
      notes: notes.join(' | ') || undefined,
      sourcePageUrl: window.location.href,
      rawPayload: {
        extractionStrategy: 'endpoint+dom',
        collectedAt: new Date().toISOString(),
        selectionKey: [
          normalizeText(record.SC2_ID),
          normalizeText(record.SC2_Doc),
          normalizeText(record.SB1_Codigo),
        ]
          .filter(Boolean)
          .join('|'),
        candidates: {
          externalOrderId: normalizeText(record.SC2_ID),
          orderNumber: normalizeText(record.SC2_Doc),
          productCode: normalizeText(record.SB1_Codigo),
          productDescription: normalizeText(record.SB1_Desc),
          baseProduct: normalizeText(record.SB1_Codigo),
          variations: normalizeText(record.XXX_DescChaveItensVar),
          quantity: normalizeText(record.SC2_Quant),
          unit: normalizeText(record.SB1_UM),
          issueDate: normalizeText(record.SC2_Emissao),
          dueDate: normalizeText(record.SC2_Previsao),
          customerName:
            normalizeText(record.SA1_Desc) ||
            normalizeText(record.SA1_Fantasia),
        },
        erpRecord: record,
      },
    };
  }

  function buildPayloadSelectionKey(payload) {
    return [
      normalizeText(payload?.externalOrderId),
      normalizeText(payload?.orderNumber),
      normalizeText(payload?.item?.productCode),
    ]
      .filter(Boolean)
      .join('|');
  }

  function scoreStructuredRecord(record, hints) {
    const values = [
      normalizeText(record.SC2_ID),
      normalizeText(record.SC2_Doc),
      normalizeText(record.SB1_Codigo),
      normalizeText(record.SB1_Desc),
      normalizeText(record.XXX_DescChaveItensVar),
    ];
    let score = 0;

    if (hints.externalOrderId && values.includes(hints.externalOrderId)) {
      score += 8;
    }

    if (hints.orderNumber && values.includes(hints.orderNumber)) {
      score += 8;
    }

    if (hints.productCode && values.includes(hints.productCode)) {
      score += 4;
    }

    if (
      hints.productDescription &&
      values.some((value) => value.includes(hints.productDescription))
    ) {
      score += 3;
    }

    if (
      hints.variations &&
      values.some((value) => value.includes(hints.variations))
    ) {
      score += 2;
    }

    return score;
  }

  function pickBestStructuredRecord(records, hints) {
    if (!Array.isArray(records) || records.length === 0) {
      return null;
    }

    const ranked = records
      .map((record) => ({
        record,
        score: scoreStructuredRecord(record, hints),
      }))
      .sort((left, right) => right.score - left.score);

    return ranked[0]?.record ?? records[0] ?? null;
  }

  function buildPayloadFromCandidates(mergedCandidates, extractionStrategy) {
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
        extractionStrategy,
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
      payload,
      missingFields,
    };
  }

  async function buildImportPayload(requestedFilters = {}) {
    const structuredCandidates = collectStructuredCandidates();
    const domCandidates = collectDomCandidates();
    const pageBootstrapCandidates = collectPageBootstrapCandidates();
    const urlFilters = readEmissionFiltersFromUrl();
    const hasRequestedFrom = Object.prototype.hasOwnProperty.call(
      requestedFilters,
      'issueDateFrom',
    );
    const hasRequestedTo = Object.prototype.hasOwnProperty.call(
      requestedFilters,
      'issueDateTo',
    );
    const activeFilters = {
      issueDateFrom: hasRequestedFrom
        ? parseDateValue(requestedFilters.issueDateFrom)
        : urlFilters.issueDateFrom,
      issueDateTo: hasRequestedTo
        ? parseDateValue(requestedFilters.issueDateTo)
        : urlFilters.issueDateTo,
    };
    const mergedCandidates = {
      ...domCandidates,
      ...Object.fromEntries(
        Object.entries(structuredCandidates).filter(([, value]) => {
          return value !== undefined && value !== null && value !== '';
        }),
      ),
      ...Object.fromEntries(
        Object.entries(pageBootstrapCandidates).filter(([, value]) => {
          return value !== undefined && value !== null && value !== '';
        }),
      ),
    };
    const endpointMatch = await fetchStructuredEndpointData(activeFilters);

    if (endpointMatch) {
      const filteredRecords = endpointMatch.payload.data.filter((record) => {
        return isRecordWithinIssueDateRange(record, activeFilters);
      });
      const hasActiveDateFilters =
        Boolean(activeFilters.issueDateFrom) || Boolean(activeFilters.issueDateTo);
      const sourceRecords = hasActiveDateFilters
        ? filteredRecords
        : endpointMatch.payload.data;

      if (sourceRecords.length === 0) {
        return {
          supportedPage: detectSupportedPage(mergedCandidates),
          payload: null,
          missingFields: [],
          payloadOptions: [],
          extractionMeta: {
            usedStructuredSource: true,
            sourcePageUrl: window.location.href,
            endpointUrl: endpointMatch.endpointUrl,
            totalStructuredOrders: 0,
            activeFilters,
            noResults: true,
          },
        };
      }

      const structuredPayloads = sourceRecords
        .map(normalizeStructuredOrder)
        .filter(Boolean);
      const bestStructuredRecord = pickBestStructuredRecord(sourceRecords, {
        externalOrderId: normalizeText(mergedCandidates.externalOrderId),
        orderNumber: normalizeText(mergedCandidates.orderNumber),
        productCode: normalizeText(mergedCandidates.productCode),
        productDescription: normalizeText(mergedCandidates.productDescription),
        variations: normalizeText(mergedCandidates.variations),
      });
      const structuredPayload =
        structuredPayloads.find((payload) => {
          return (
            buildPayloadSelectionKey(payload) ===
            buildPayloadSelectionKey(normalizeStructuredOrder(bestStructuredRecord))
          );
        }) ?? structuredPayloads[0] ?? null;

      if (structuredPayload && structuredPayloads.length > 0) {
        return {
          supportedPage: detectSupportedPage(mergedCandidates),
          payload: structuredPayload,
          missingFields: buildPayloadFromCandidates(
            structuredPayload.rawPayload.candidates,
            'endpoint+dom',
          ).missingFields,
          payloadOptions: structuredPayloads.map((payload) => ({
            payload,
            missingFields: buildPayloadFromCandidates(
              payload.rawPayload.candidates,
              'endpoint+dom',
            ).missingFields,
          })),
          extractionMeta: {
            usedStructuredSource: true,
            sourcePageUrl: window.location.href,
            endpointUrl: endpointMatch.endpointUrl,
            totalStructuredOrders: structuredPayloads.length,
            activeFilters,
          },
        };
      }
    }

    const fallbackExtractionStrategy = structuredCandidates.orderNumber
      ? 'structured+dom'
      : pageBootstrapCandidates.orderNumber
        ? 'bootstrap+dom'
        : 'dom';
    const fallback = buildPayloadFromCandidates(
      mergedCandidates,
      fallbackExtractionStrategy,
    );

    return {
      supportedPage: detectSupportedPage(mergedCandidates),
      payload: fallback.payload,
      missingFields: fallback.missingFields,
      payloadOptions: [
        {
          payload: fallback.payload,
          missingFields: fallback.missingFields,
        },
      ],
      extractionMeta: {
        usedStructuredSource: Boolean(
          structuredCandidates.orderNumber || pageBootstrapCandidates.orderNumber,
        ),
        sourcePageUrl: window.location.href,
        activeFilters,
      },
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'ERP_FLEX_COLLECT_ORDER') {
      return;
    }

    buildImportPayload(message?.filters ?? {})
      .then((result) => {
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

        if (!result.payload || result.payloadOptions.length === 0) {
          sendResponse({
            ok: false,
            code: 'ERP_FLEX_NO_RESULTS_FOR_FILTERS',
            message: 'Nenhuma ordem foi encontrada para o periodo informado.',
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
          payloadOptions: result.payloadOptions,
          extractionMeta: result.extractionMeta,
        });
      })
      .catch((error) => {
        sendResponse({
          ok: false,
          code: 'ERP_FLEX_CAPTURE_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Falha inesperada ao capturar a ordem do ERP.',
        });
      });

    return true;
  });
})();
