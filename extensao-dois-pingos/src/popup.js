const statusMessage = document.getElementById('status-message');
const statusDetails = document.getElementById('status-details');
const mappingStatus = document.getElementById('mapping-status');
const importButton = document.getElementById('import-button');
const reviewButton = document.getElementById('review-button');
const loadPreviewButton = document.getElementById('load-preview-button');
const openAdvancedSettingsButton = document.getElementById(
  'open-advanced-settings-button',
);
const issueDateFromInput = document.getElementById('issue-date-from');
const issueDateToInput = document.getElementById('issue-date-to');
const orderSelectorSection = document.getElementById('order-selector-section');
const orderSelectorCount = document.getElementById('order-selector-count');
const orderSelectorTrigger = document.getElementById('order-selector-trigger');
const orderSelectorPanel = document.getElementById('order-selector-panel');
const orderSelectorList = document.getElementById('order-selector-list');
const captureOrderNumber = document.getElementById('capture-order-number');
const captureProductErp = document.getElementById('capture-product-erp');
const captureProductCode = document.getElementById('capture-product-code');
const captureCustomerName = document.getElementById('capture-customer-name');
const captureProductBase = document.getElementById('capture-product-base');
const captureVariations = document.getElementById('capture-variations');
const captureQuantity = document.getElementById('capture-quantity');
const captureDueDate = document.getElementById('capture-due-date');

const state = {
  currentPayload: null,
  currentPayloadOptions: [],
  activeFilters: getCurrentMonthDateRange(),
  isOrderPickerOpen: false,
};

const NO_RECEIVER_ERROR_PATTERN =
  /receiving end does not exist|could not establish connection/i;

const MOCK_PREVIEW_PAYLOAD = {
  externalOrderId: 'OP-12345',
  orderNumber: 'OP-12345',
  item: {
    productCode: 'CAMISETA POLO',
    productDescription: 'CAMISETA POLO AZUL P',
    quantity: 100,
    unit: '',
  },
  dueDate: '2026-06-10',
  sourcePageUrl: 'https://erp-flex.local/ordens/OP-12345',
  rawPayload: {
    extractionStrategy: 'preview-mock',
    candidates: {
      orderNumber: 'OP-12345',
      externalOrderId: 'OP-12345',
      customerName: 'Cliente Exemplo',
      productDescription: 'CAMISETA POLO AZUL P',
      baseProduct: 'CAMISETA POLO',
      color: 'Azul',
      size: 'P',
      quantity: 100,
      dueDate: '10/06/2026',
    },
  },
};

const MOCK_PREVIEW_OPTIONS = [
  structuredClone(MOCK_PREVIEW_PAYLOAD),
  {
    externalOrderId: '6266580',
    orderNumber: '0000000567',
    item: {
      productCode: '10AC7524P',
      productDescription:
        'Ombrelone Redondo 2,40m; armacao/vareta Aluminio, tecido Poliester PVC SLIM-Personalizado',
      quantity: 4,
      unit: 'UN',
    },
    dueDate: '2026-06-19',
    notes: 'SILK MINIKAY | COSTURA DP',
    sourcePageUrl: 'https://app.erpflex.com.br/erp/lancamentos/producao/ordensproducao',
    rawPayload: {
      extractionStrategy: 'preview-mock',
      selectionKey: '6266580|0000000567|10AC7524P',
      candidates: {
        orderNumber: '0000000567',
        externalOrderId: '6266580',
        customerName: 'PRAXI SERVICOS LTDA',
        productCode: '10AC7524P',
        productDescription:
          'Ombrelone Redondo 2,40m; armacao/vareta Aluminio, tecido Poliester PVC SLIM-Personalizado',
        baseProduct: '10AC7524P',
        variations: 'Azul Guanabara C/Abas',
        quantity: 4,
        dueDate: '19/06/2026',
      },
    },
  },
];

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatFallback(value, fallback) {
  return normalizeText(value) || fallback;
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

function normalizeDateInputValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(normalizeText(value)) ? normalizeText(value) : '';
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentMonthDateRange(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    issueDateFrom: formatDateInputValue(firstDay),
    issueDateTo: formatDateInputValue(lastDay),
  };
}

function formatDate(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return 'Nao capturado';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [year, month, day] = normalized.split('-');
    return `${day}/${month}/${year}`;
  }

  return normalized;
}

function formatQuantity(value, unit) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Nao capturada';
  }

  const renderedValue = Number.isInteger(value)
    ? String(value)
    : value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  const renderedUnit = normalizeText(unit);

  return renderedUnit ? `${renderedValue} ${renderedUnit}` : renderedValue;
}

function formatDetailLabel(label, value) {
  return `${label}: ${value}`;
}

function formatPeriodLabel(issueDateFrom, issueDateTo) {
  const fromLabel = formatDate(issueDateFrom);
  const toLabel = formatDate(issueDateTo);

  if (normalizeText(issueDateFrom) || normalizeText(issueDateTo)) {
    return `${fromLabel} ate ${toLabel}`;
  }

  return 'Nao informado';
}

function setFeedbackTone(tone) {
  statusMessage.classList.remove(
    'feedback-message--error',
    'feedback-message--success',
  );

  if (tone === 'error') {
    statusMessage.classList.add('feedback-message--error');
  }

  if (tone === 'success') {
    statusMessage.classList.add('feedback-message--success');
  }
}

function isSupportedTabUrl(url) {
  const normalizedUrl = normalizeText(url);

  return normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://');
}

function isReceiverMissingError(error) {
  return NO_RECEIVER_ERROR_PATTERN.test(
    error instanceof Error ? error.message : String(error ?? ''),
  );
}

function buildReceiverGuidance(activeTab) {
  if (!isSupportedTabUrl(activeTab?.url)) {
    return 'Abra uma pagina http ou https do ERP Flex e tente novamente.';
  }

  return 'Recarregue a pagina do ERP Flex e clique em "Revisar aba ativa" novamente.';
}

async function requestOrderCollection(activeTab) {
  if (!activeTab?.id) {
    throw new Error('Nao foi possivel identificar a aba ativa para coletar a ordem.');
  }

  try {
    return await chrome.tabs.sendMessage(activeTab.id, {
      type: 'ERP_FLEX_COLLECT_ORDER',
      filters: state.activeFilters,
    });
  } catch (error) {
    if (!isReceiverMissingError(error)) {
      throw error;
    }

    if (!isSupportedTabUrl(activeTab.url)) {
      throw new Error(buildReceiverGuidance(activeTab));
    }

    await chrome.scripting.executeScript({
      target: {
        tabId: activeTab.id,
      },
      files: ['src/content-script.js'],
    });

    try {
      return await chrome.tabs.sendMessage(activeTab.id, {
        type: 'ERP_FLEX_COLLECT_ORDER',
        filters: state.activeFilters,
      });
    } catch (reinjectedError) {
      if (isReceiverMissingError(reinjectedError)) {
        throw new Error(buildReceiverGuidance(activeTab));
      }

      throw reinjectedError;
    }
  }
}

function renderFeedback(message, details = [], tone = 'neutral') {
  statusMessage.textContent = message;
  setFeedbackTone(tone);

  if (!details.length) {
    statusDetails.hidden = true;
    statusDetails.replaceChildren();
    return;
  }

  const nodes = details.map((detail) => {
    const row = document.createElement('p');
    row.className = 'feedback-detail';
    row.textContent = detail;
    return row;
  });

  statusDetails.replaceChildren(...nodes);
  statusDetails.hidden = false;
}

function bindClick(element, handler) {
  if (!element) {
    return;
  }

  element.addEventListener('click', handler);
}

function bindChange(element, handler) {
  if (!element) {
    return;
  }

  element.addEventListener('change', handler);
}

function setMappingState(tone, message) {
  mappingStatus.textContent = message;
  mappingStatus.className = `mapping-badge mapping-badge--${tone}`;
}

function renderSession(settings) {
  return settings;
}

function setBusy(isBusy, busyLabel = 'Criando OP no Kanban...') {
  importButton.disabled = isBusy || !state.currentPayload;
  reviewButton.disabled = isBusy;
  loadPreviewButton.disabled = isBusy;
  openAdvancedSettingsButton.disabled = isBusy;
  issueDateFromInput.disabled = isBusy;
  issueDateToInput.disabled = isBusy;
  orderSelectorTrigger.disabled = isBusy || state.currentPayloadOptions.length <= 1;
  importButton.textContent = isBusy ? busyLabel : 'Criar OP no Kanban';
  reviewButton.textContent = isBusy ? 'Aguarde...' : 'Revisar dados';
}

function setOrderPickerOpen(isOpen) {
  const canOpen = state.currentPayloadOptions.length > 1 && !orderSelectorTrigger.disabled;
  const nextState = canOpen ? isOpen : false;

  state.isOrderPickerOpen = nextState;
  orderSelectorPanel.hidden = !nextState;
  orderSelectorTrigger.setAttribute('aria-expanded', String(nextState));
}

function syncDateFilters(filters = {}) {
  const fallbackRange = getCurrentMonthDateRange();
  state.activeFilters.issueDateFrom =
    normalizeDateInputValue(filters.issueDateFrom) || fallbackRange.issueDateFrom;
  state.activeFilters.issueDateTo =
    normalizeDateInputValue(filters.issueDateTo) || fallbackRange.issueDateTo;
  issueDateFromInput.value = state.activeFilters.issueDateFrom;
  issueDateToInput.value = state.activeFilters.issueDateTo;
}

function buildDerivedSnapshot(payload) {
  const candidates = payload?.rawPayload?.candidates ?? {};
  const rawProductDescription = normalizeText(
    candidates.productDescription || payload?.item?.productDescription,
  );
  const baseProduct =
    normalizeText(candidates.baseProduct) ||
    normalizeText(candidates.productBase) ||
    normalizeText(payload?.item?.productCode) ||
    '';
  const color = normalizeText(candidates.color);
  const size = normalizeText(candidates.size);
  const explicitVariations = normalizeText(candidates.variations);
  const variationPieces = [];

  if (color) {
    variationPieces.push(`Cor: ${color}`);
  }

  if (size) {
    variationPieces.push(`Tamanho: ${size}`);
  }

  return {
    orderNumber: normalizeText(payload?.orderNumber || payload?.externalOrderId),
    productErp: rawProductDescription,
    productCode:
      normalizeText(candidates.productCode) ||
      normalizeText(payload?.item?.productCode),
    customerName: normalizeText(candidates.customerName),
    productBase: baseProduct,
    variations:
      explicitVariations || variationPieces.join(' | ') || normalizeText(payload?.notes),
    quantity: payload?.item?.quantity,
    unit: payload?.item?.unit,
    dueDate: payload?.dueDate,
    sourcePageUrl: normalizeText(payload?.sourcePageUrl),
    extractionStrategy: normalizeText(payload?.rawPayload?.extractionStrategy),
    hasVariationMapping: Boolean(explicitVariations || variationPieces.length),
  };
}

function buildOrderOptionLabel(payload) {
  const snapshot = buildDerivedSnapshot(payload);
  const primaryId = snapshot.orderNumber || normalizeText(payload?.externalOrderId) || 'OP';
  const code = snapshot.productCode || 'Codigo nao informado';
  const variations = snapshot.variations || snapshot.productErp;

  return [primaryId, code, variations].filter(Boolean).join(' | ');
}

function renderOrderOptions(payloadOptions, selectedPayload) {
  state.currentPayloadOptions = Array.isArray(payloadOptions) ? payloadOptions : [];
  setOrderPickerOpen(false);

  if (state.currentPayloadOptions.length <= 1) {
    orderSelectorSection.hidden = true;
    orderSelectorList.replaceChildren();
    orderSelectorCount.textContent = '1 OP';
    orderSelectorTrigger.textContent = buildOrderOptionLabel(selectedPayload) || 'Selecionar ordem';
    orderSelectorTrigger.disabled = true;
    return;
  }

  const selectedKey = buildPayloadSelectionKey(selectedPayload);
  const optionNodes = state.currentPayloadOptions.map((payload) => {
    const option = document.createElement('button');
    const optionKey = buildPayloadSelectionKey(payload);
    option.type = 'button';
    option.className = 'order-picker__option';
    option.setAttribute('role', 'option');
    option.dataset.selectionKey = optionKey;
    option.setAttribute('aria-selected', String(optionKey === selectedKey));
    option.textContent = buildOrderOptionLabel(payload);

    if (optionKey === selectedKey) {
      option.classList.add('order-picker__option--selected');
    }

    option.addEventListener('click', () => {
      selectOrderPayloadByKey(optionKey);
    });

    return option;
  });

  orderSelectorList.replaceChildren(...optionNodes);
  orderSelectorTrigger.textContent =
    buildOrderOptionLabel(selectedPayload) || 'Selecionar ordem';
  orderSelectorCount.textContent = `${state.currentPayloadOptions.length} OPs`;
  orderSelectorTrigger.disabled = false;
  orderSelectorSection.hidden = false;
}

function renderCapturedData(payload) {
  const snapshot = buildDerivedSnapshot(payload);

  captureOrderNumber.textContent = formatFallback(snapshot.orderNumber, 'Nao capturada');
  captureProductErp.textContent = formatFallback(snapshot.productErp, 'Nao capturado');
  captureProductCode.textContent = formatFallback(snapshot.productCode, 'Nao capturado');
  captureCustomerName.textContent = formatFallback(snapshot.customerName, 'Nao capturado');
  captureProductBase.textContent = formatFallback(snapshot.productBase, 'Nao identificado');
  captureVariations.textContent = formatFallback(
    snapshot.variations,
    'Nao identificadas',
  );
  captureQuantity.textContent = formatQuantity(snapshot.quantity, snapshot.unit);
  captureDueDate.textContent = formatDate(snapshot.dueDate);

  if (snapshot.hasVariationMapping) {
    setMappingState('success', 'Variacao encontrada');
  } else if (snapshot.productErp) {
    setMappingState('warning', 'Mapeamento parcial');
  } else {
    setMappingState('neutral', 'Aguardando leitura da pagina');
  }
}

function clearCapturedData() {
  state.currentPayloadOptions = [];
  captureOrderNumber.textContent = 'Nao capturada';
  captureProductErp.textContent = 'Nao capturado';
  captureProductCode.textContent = 'Nao capturado';
  captureCustomerName.textContent = 'Nao capturado';
  captureProductBase.textContent = 'Nao identificado';
  captureVariations.textContent = 'Nao identificadas';
  captureQuantity.textContent = 'Nao capturada';
  captureDueDate.textContent = 'Nao capturado';
  orderSelectorSection.hidden = true;
  orderSelectorList.replaceChildren();
  orderSelectorCount.textContent = '0 OPs';
  orderSelectorTrigger.textContent = 'Selecionar ordem';
  orderSelectorTrigger.disabled = true;
  setOrderPickerOpen(false);
  setMappingState('neutral', 'Aguardando leitura da pagina');
}

function loadMockPreview() {
  state.currentPayloadOptions = structuredClone(MOCK_PREVIEW_OPTIONS);
  state.currentPayload = state.currentPayloadOptions[0];
  syncDateFilters({
    issueDateFrom: '2026-06-01',
    issueDateTo: '2026-06-30',
  });
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload);
  renderCapturedData(state.currentPayload);
  importButton.disabled = false;
  renderFeedback(
    'Preview visual carregado com dados mockados para revisar a popup.',
    [
      formatDetailLabel('Modo', 'Preview visual local'),
      formatDetailLabel('Estrategia de captura', 'preview-mock'),
      formatDetailLabel(
        'Periodo',
        formatPeriodLabel(
          state.activeFilters.issueDateFrom,
          state.activeFilters.issueDateTo,
        ),
      ),
      formatDetailLabel('Ordens encontradas', String(state.currentPayloadOptions.length)),
      formatDetailLabel('Pagina', MOCK_PREVIEW_PAYLOAD.sourcePageUrl),
    ],
    'success',
  );
}

async function handleReviewData() {
  if (
    state.activeFilters.issueDateFrom &&
    state.activeFilters.issueDateTo &&
    state.activeFilters.issueDateFrom > state.activeFilters.issueDateTo
  ) {
    renderFeedback(
      'O periodo informado esta invalido.',
      [
        formatDetailLabel(
          'Periodo',
          formatPeriodLabel(
            state.activeFilters.issueDateFrom,
            state.activeFilters.issueDateTo,
          ),
        ),
      ],
      'error',
    );
    return;
  }

  setBusy(true, 'Criar OP no Kanban...');
  renderFeedback('Lendo novamente a pagina do ERP Flex...');

  try {
    await collectOrderPreview();
  } catch (error) {
    state.currentPayload = null;
    clearCapturedData();
    renderFeedback(
      error instanceof Error ? error.message : 'Falha ao revisar os dados.',
      [],
      'error',
    );
  } finally {
    setBusy(false);
  }
}

async function loadSettings() {
  const response = await sendRuntimeMessage({
    type: 'ERP_FLEX_GET_SETTINGS',
  });

  if (!response?.ok) {
    throw new Error(response?.message ?? 'Falha ao carregar configuracoes da extensao.');
  }

  renderSession(response.settings);

  if (response.settings.lastImportSummary) {
    renderFeedback(response.settings.lastImportSummary, [], 'success');
  }

  return response.settings;
}

async function saveBaseSettings() {
  return loadSettings();
}

async function collectOrderPreview() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    throw new Error('Nao foi possivel identificar a aba ativa para coletar a ordem.');
  }

  const response = await requestOrderCollection(activeTab);

  if (!response?.ok) {
    if (response?.payloadPreview) {
      renderCapturedData(response.payloadPreview);
    } else {
      clearCapturedData();
    }

    state.currentPayload = null;
    importButton.disabled = true;

    const details = [];

    if (Array.isArray(response?.missingFields) && response.missingFields.length > 0) {
      details.push(
        formatDetailLabel(
          'Campos faltantes',
          response.missingFields.join(', '),
        ),
      );
    }

    if (response?.extractionMeta?.sourcePageUrl) {
      details.push(
        formatDetailLabel('Pagina', response.extractionMeta.sourcePageUrl),
      );
    }

    if (response?.extractionMeta?.activeFilters) {
      syncDateFilters(response.extractionMeta.activeFilters);
      details.push(
        formatDetailLabel(
          'Periodo',
          formatPeriodLabel(
            response.extractionMeta.activeFilters.issueDateFrom,
            response.extractionMeta.activeFilters.issueDateTo,
          ),
        ),
      );
    }

    setMappingState('error', 'Revisar captura');
    renderFeedback(
      response?.message ?? 'A pagina atual nao retornou dados validos.',
      details,
      'error',
    );

    return null;
  }

  const payloadOptions = Array.isArray(response.payloadOptions)
    ? response.payloadOptions
        .map((entry) => entry?.payload)
        .filter(Boolean)
    : [response.payload];

  state.currentPayloadOptions = payloadOptions;
  state.currentPayload = response.payload;
  syncDateFilters(response?.extractionMeta?.activeFilters);
  renderOrderOptions(payloadOptions, response.payload);
  renderCapturedData(response.payload);
  importButton.disabled = false;

  const snapshot = buildDerivedSnapshot(response.payload);
  const details = [];

  if (snapshot.extractionStrategy) {
    details.push(
      formatDetailLabel('Estrategia de captura', snapshot.extractionStrategy),
    );
  }

  if (snapshot.sourcePageUrl) {
    details.push(formatDetailLabel('Pagina', snapshot.sourcePageUrl));
  }

  details.push(
    formatDetailLabel(
      'Periodo',
      formatPeriodLabel(
        state.activeFilters.issueDateFrom,
        state.activeFilters.issueDateTo,
      ),
    ),
  );

  if (payloadOptions.length > 1) {
    details.push(formatDetailLabel('Ordens encontradas', String(payloadOptions.length)));
  }

  renderFeedback(
    'Dados da ordem conferidos. Revise e siga para a criacao no kanban.',
    details,
    'success',
  );

  return response.payload;
}

function buildImportFeedback(result) {
  if (result.result === 'duplicate') {
    return {
      message: 'A ordem do ERP ja existe no kanban.',
      details: [
        formatDetailLabel(
          'OP existente',
          result.existingProductionOrderId ?? 'Nao informado',
        ),
        formatDetailLabel(
          'Id externo ERP',
          result.externalOrderId ?? 'Nao informado',
        ),
      ],
      tone: 'error',
    };
  }

  return {
    message: `OP ${result.productionOrder?.orderNumber ?? ''} criada no kanban com sucesso.`,
    details: [
      formatDetailLabel(
        'Id da ordem',
        result.productionOrder?.id ?? 'Nao informado',
      ),
      formatDetailLabel(
        'Id externo ERP',
        result.productionOrder?.source?.externalOrderId ?? 'Nao informado',
      ),
      formatDetailLabel(
        'Status inicial',
        result.productionOrder?.status ?? 'Nao informado',
      ),
    ],
    tone: 'success',
  };
}

async function handleImport() {
  if (!state.currentPayload) {
    renderFeedback(
      'Revise a pagina atual antes de criar a OP no kanban.',
      [],
      'error',
    );
    return;
  }

  setBusy(true);
  renderFeedback('Validando configuracao e enviando a OP para o kanban...');

  try {
    const settings = await saveBaseSettings();
    if (!normalizeText(settings.apiBaseUrl) || !normalizeText(settings.userEmail)) {
      throw new Error(
        'Abra Configuracao avancada e informe a API e o e-mail do sistema antes de importar.',
      );
    }

    const importResponse = await sendRuntimeMessage({
      type: 'ERP_FLEX_IMPORT_ORDER',
      apiBaseUrl: settings.apiBaseUrl,
      userEmail: settings.userEmail,
      userPassword: '',
      accessToken: settings.accessToken,
      payload: state.currentPayload,
    });

    if (!importResponse?.ok) {
      throw new Error(importResponse?.message ?? 'Falha na importacao da ordem.');
    }

    const feedback = buildImportFeedback(importResponse);
    renderFeedback(feedback.message, feedback.details, feedback.tone);

    await loadSettings();
  } catch (error) {
    renderFeedback(
      error instanceof Error ? error.message : 'Erro inesperado durante a importacao.',
      [],
      'error',
    );
  } finally {
    setBusy(false);
  }
}

async function bootstrapPopup() {
  try {
    await loadSettings();
    syncDateFilters(state.activeFilters);
    clearCapturedData();
    setBusy(false);
    await collectOrderPreview();
  } catch (error) {
    clearCapturedData();
    setBusy(false);
    renderFeedback(
      error instanceof Error ? error.message : 'Falha ao iniciar a extensao.',
      [],
      'error',
    );
  }
}

function selectOrderPayloadByKey(selectionKey) {
  const selectedPayload = state.currentPayloadOptions.find((payload) => {
    return buildPayloadSelectionKey(payload) === selectionKey;
  });

  if (!selectedPayload) {
    return false;
  }

  state.currentPayload = selectedPayload;
  renderOrderOptions(state.currentPayloadOptions, selectedPayload);
  renderCapturedData(selectedPayload);

  const snapshot = buildDerivedSnapshot(selectedPayload);
  const details = [];

  if (snapshot.extractionStrategy) {
    details.push(
      formatDetailLabel('Estrategia de captura', snapshot.extractionStrategy),
    );
  }

  if (snapshot.sourcePageUrl) {
    details.push(formatDetailLabel('Pagina', snapshot.sourcePageUrl));
  }

  details.push(
    formatDetailLabel(
      'Periodo',
      formatPeriodLabel(
        state.activeFilters.issueDateFrom,
        state.activeFilters.issueDateTo,
      ),
    ),
  );

  if (state.currentPayloadOptions.length > 1) {
    details.push(
      formatDetailLabel('Ordens encontradas', String(state.currentPayloadOptions.length)),
    );
  }

  renderFeedback(
    'OP selecionada. Revise os dados e siga para a criacao no kanban.',
    details,
    'success',
  );
  setBusy(false);
  setOrderPickerOpen(false);

  return true;
}

bindClick(orderSelectorTrigger, () => {
  setOrderPickerOpen(!state.isOrderPickerOpen);
});

document.addEventListener('click', (event) => {
  if (orderSelectorSection && !orderSelectorSection.contains(event.target)) {
    setOrderPickerOpen(false);
  }
});

bindChange(issueDateFromInput, () => {
  state.activeFilters.issueDateFrom = normalizeDateInputValue(issueDateFromInput.value);
});

bindChange(issueDateToInput, () => {
  state.activeFilters.issueDateTo = normalizeDateInputValue(issueDateToInput.value);
});

bindClick(reviewButton, () => {
  void handleReviewData();
});

bindClick(importButton, () => {
  void handleImport();
});

bindClick(loadPreviewButton, () => {
  loadMockPreview();
});

bindClick(openAdvancedSettingsButton, () => {
  window.location.href = 'advanced-settings.html';
});

void bootstrapPopup();
