const statusMessage = document.getElementById("status-message");
const statusDetails = document.getElementById("status-details");
const mappingStatus = document.getElementById("mapping-status");
const importButton = document.getElementById("import-button");
const reviewButton = document.getElementById("review-button");
const loadPreviewButton = document.getElementById("load-preview-button");
const openAdvancedSettingsButton = document.getElementById(
  "open-advanced-settings-button",
);
const openLogsButton = document.getElementById("open-logs-button");
const issueDateFromInput = document.getElementById("issue-date-from");
const issueDateToInput = document.getElementById("issue-date-to");
const orderSelectorSection = document.getElementById("order-selector-section");
const orderSelectorCount = document.getElementById("order-selector-count");
const orderSelectorTrigger = document.getElementById("order-selector-trigger");
const orderSelectorPanel = document.getElementById("order-selector-panel");
const orderSelectorList = document.getElementById("order-selector-list");
const captureOrderNumber = document.getElementById("capture-order-number");
const captureProductErp = document.getElementById("capture-product-erp");
const captureProductCode = document.getElementById("capture-product-code");
const captureCustomerName = document.getElementById("capture-customer-name");
const captureProductBase = document.getElementById("capture-product-base");
const captureVariations = document.getElementById("capture-variations");
const captureQuantity = document.getElementById("capture-quantity");
const captureUnit = document.getElementById("capture-unit");
const captureDueDate = document.getElementById("capture-due-date");
const captureNotes = document.getElementById("capture-notes");
const importConfirmationPanel = document.getElementById(
  "import-confirmation-panel",
);
const cancelConfirmationButton = document.getElementById(
  "cancel-confirmation-button",
);
const dismissConfirmationButton = document.getElementById(
  "dismiss-confirmation-button",
);
const confirmImportButton = document.getElementById("confirm-import-button");
const confirmOrderNumber = document.getElementById("confirm-order-number");
const confirmProductErp = document.getElementById("confirm-product-erp");
const confirmProductCode = document.getElementById("confirm-product-code");
const confirmCustomerName = document.getElementById("confirm-customer-name");
const confirmProductBase = document.getElementById("confirm-product-base");
const confirmVariations = document.getElementById("confirm-variations");
const confirmQuantity = document.getElementById("confirm-quantity");
const confirmUnit = document.getElementById("confirm-unit");
const confirmDueDate = document.getElementById("confirm-due-date");
const confirmNotes = document.getElementById("confirm-notes");

const state = {
  currentPayload: null,
  currentPayloadOptions: [],
  activeFilters: getCurrentMonthDateRange(),
  isOrderPickerOpen: false,
  isImportConfirmationOpen: false,
  isSubmittingImport: false,
  importButtonMode: "idle",
  lastFocusedElementBeforeConfirmation: null,
};

const NO_RECEIVER_ERROR_PATTERN =
  /receiving end does not exist|could not establish connection/i;
const EXPECTED_CONTENT_SCRIPT_VERSION =
  "2026-06-11-quantity-and-unit-layout-fix";

const MOCK_PREVIEW_PAYLOAD = {
  externalOrderId: "OP-12345",
  orderNumber: "OP-12345",
  item: {
    productCode: "CAMISETA POLO",
    productDescription: "CAMISETA POLO AZUL P",
    quantity: 100,
    unit: "",
  },
  dueDate: "2026-06-10",
  sourcePageUrl: "https://erp-flex.local/ordens/OP-12345",
  rawPayload: {
    extractionStrategy: "preview-mock",
    candidates: {
      orderNumber: "OP-12345",
      externalOrderId: "OP-12345",
      customerName: "Cliente Exemplo",
      productDescription: "CAMISETA POLO AZUL P",
      baseProduct: "CAMISETA POLO",
      color: "Azul",
      size: "P",
      quantity: 100,
      dueDate: "10/06/2026",
    },
  },
};

const MOCK_PREVIEW_OPTIONS = [
  structuredClone(MOCK_PREVIEW_PAYLOAD),
  {
    externalOrderId: "6266580",
    orderNumber: "0000000567",
    item: {
      productCode: "10AC7524P",
      productDescription:
        "Ombrelone Redondo 2,40m; armacao/vareta Aluminio, tecido Poliester PVC SLIM-Personalizado",
      quantity: 4,
      unit: "UN",
    },
    dueDate: "2026-06-19",
    notes: "SILK MINIKAY, COSTURA DP",
    sourcePageUrl:
      "https://app.erpflex.com.br/erp/lancamentos/producao/ordensproducao",
    rawPayload: {
      extractionStrategy: "preview-mock",
      selectionKey: "6266580|0000000567|10AC7524P",
      candidates: {
        orderNumber: "0000000567",
        externalOrderId: "6266580",
        customerName: "PRAXI SERVICOS LTDA",
        productCode: "10AC7524P",
        productDescription:
          "Ombrelone Redondo 2,40m; armacao/vareta Aluminio, tecido Poliester PVC SLIM-Personalizado",
        baseProduct: "10AC7524P",
        variations: "Azul Guanabara C/Abas",
        complementaryFields: "SILK MINIKAY, COSTURA DP",
        quantity: 4,
        dueDate: "19/06/2026",
      },
    },
  },
];

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function appendExtensionLog(entry) {
  return sendRuntimeMessage({
    type: "ERP_FLEX_APPEND_LOG",
    entry,
  }).catch(() => undefined);
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
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
    .join("|");
}

function normalizeDateInputValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(normalizeText(value))
    ? normalizeText(value)
    : "";
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

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
    return "Não capturado";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [year, month, day] = normalized.split("-");
    return `${day}/${month}/${year}`;
  }

  return normalized;
}

function formatQuantity(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Não capturada";
  }

  const renderedValue = Number.isInteger(value)
    ? String(value)
    : value.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  return renderedValue;
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

  return "Não informado";
}

function setFeedbackTone(tone) {
  statusMessage.classList.remove(
    "feedback-message--error",
    "feedback-message--success",
  );

  if (tone === "error") {
    statusMessage.classList.add("feedback-message--error");
  }

  if (tone === "success") {
    statusMessage.classList.add("feedback-message--success");
  }
}

function isSupportedTabUrl(url) {
  const normalizedUrl = normalizeText(url);

  return (
    normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")
  );
}

function isReceiverMissingError(error) {
  return NO_RECEIVER_ERROR_PATTERN.test(
    error instanceof Error ? error.message : String(error ?? ""),
  );
}

function buildReceiverGuidance(activeTab) {
  if (!isSupportedTabUrl(activeTab?.url)) {
    return "Abra uma página http ou https do ERP Flex e tente novamente.";
  }

  return 'Recarregue a página do ERP Flex e clique em "Fazer análise" novamente.';
}

async function requestOrderCollection(activeTab) {
  if (!activeTab?.id) {
    throw new Error(
      "Não foi possível identificar a aba ativa para coletar a ordem.",
    );
  }

  try {
    const healthcheck = await chrome.tabs.sendMessage(activeTab.id, {
      type: "ERP_FLEX_HEALTHCHECK",
    });

    if (healthcheck?.version !== EXPECTED_CONTENT_SCRIPT_VERSION) {
      throw new Error("ERP_FLEX_OUTDATED_CONTENT_SCRIPT");
    }
  } catch (error) {
    const isOutdatedScriptError =
      error instanceof Error &&
      error.message === "ERP_FLEX_OUTDATED_CONTENT_SCRIPT";

    if (!isOutdatedScriptError && !isReceiverMissingError(error)) {
      throw error;
    }

    if (!isSupportedTabUrl(activeTab.url)) {
      throw new Error(buildReceiverGuidance(activeTab));
    }

    await chrome.scripting.executeScript({
      target: {
        tabId: activeTab.id,
      },
      files: ["src/content-script.js"],
    });
  }

  try {
    return await chrome.tabs.sendMessage(activeTab.id, {
      type: "ERP_FLEX_COLLECT_ORDER",
      filters: state.activeFilters,
    });
  } catch (error) {
    if (isReceiverMissingError(error)) {
      throw new Error(buildReceiverGuidance(activeTab));
    }

    throw error;
  }
}

function renderFeedback(message, details = [], tone = "neutral") {
  statusMessage.textContent = message;
  setFeedbackTone(tone);

  if (!details.length) {
    statusDetails.hidden = true;
    statusDetails.replaceChildren();
    return;
  }

  const nodes = details.map((detail) => {
    const row = document.createElement("p");
    row.className = "feedback-detail";
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

  element.addEventListener("click", handler);
}

function bindChange(element, handler) {
  if (!element) {
    return;
  }

  element.addEventListener("change", handler);
}

function setElementDisabled(element, isDisabled) {
  if (!element) {
    return;
  }

  element.disabled = isDisabled;
}

function setElementText(element, text) {
  if (!element) {
    return;
  }

  element.textContent = text;
}

function setButtonVisualState(button, mode, labels) {
  if (!button) {
    return;
  }

  button.classList.remove("action-button--loading", "action-button--success");

  if (mode === "loading") {
    button.classList.add("action-button--loading");
  }

  if (mode === "success") {
    button.classList.add("action-button--success");
  }

  button.textContent =
    labels[mode] ?? labels.idle ?? labels.default ?? button.textContent;
}

function setMappingState(tone, message) {
  mappingStatus.textContent = message;
  mappingStatus.className = `mapping-badge mapping-badge--${tone}`;
}

function renderSession(settings) {
  return settings;
}

function updateImportActionState() {
  const hasPayload = Boolean(state.currentPayload);
  const hasMultipleOrders = state.currentPayloadOptions.length > 1;

  setButtonVisualState(importButton, state.importButtonMode, {
    idle: "Criar OP no Kanban",
    loading: "Criando OP no Kanban...",
    success: "OP criada no Kanban",
  });

  setButtonVisualState(confirmImportButton, state.importButtonMode, {
    idle: "Confirmar e criar OP",
    loading: "Criando OP no Kanban...",
    success: "OP criada no Kanban",
  });

  setElementDisabled(
    importButton,
    !hasPayload || state.isSubmittingImport || state.isImportConfirmationOpen,
  );
  setElementDisabled(
    confirmImportButton,
    !hasPayload || state.isSubmittingImport,
  );
  setElementDisabled(cancelConfirmationButton, state.isSubmittingImport);
  setElementDisabled(dismissConfirmationButton, state.isSubmittingImport);
  setElementDisabled(
    orderSelectorTrigger,
    state.isSubmittingImport || hasMultipleOrders === false,
  );
}

function setBusy(isBusy, options = {}) {
  const {
    importBusy = false,
    reviewBusyLabel = "Analisando ERP...",
    reviewIdleLabel = "Fazer análise",
  } = options;

  state.isSubmittingImport = importBusy;

  setElementDisabled(reviewButton, isBusy);
  setElementDisabled(loadPreviewButton, isBusy);
  setElementDisabled(openAdvancedSettingsButton, isBusy);
  setElementDisabled(openLogsButton, isBusy);
  setElementDisabled(issueDateFromInput, isBusy);
  setElementDisabled(issueDateToInput, isBusy);
  setElementText(reviewButton, isBusy ? reviewBusyLabel : reviewIdleLabel);
  updateImportActionState();
}

function setOrderPickerOpen(isOpen) {
  const canOpen =
    state.currentPayloadOptions.length > 1 && !orderSelectorTrigger.disabled;
  const nextState = canOpen ? isOpen : false;

  state.isOrderPickerOpen = nextState;
  orderSelectorPanel.hidden = !nextState;
  orderSelectorTrigger.setAttribute("aria-expanded", String(nextState));
}

function syncDateFilters(filters = {}) {
  const fallbackRange = getCurrentMonthDateRange();
  state.activeFilters.issueDateFrom =
    normalizeDateInputValue(filters.issueDateFrom) ||
    fallbackRange.issueDateFrom;
  state.activeFilters.issueDateTo =
    normalizeDateInputValue(filters.issueDateTo) || fallbackRange.issueDateTo;
  issueDateFromInput.value = state.activeFilters.issueDateFrom;
  issueDateToInput.value = state.activeFilters.issueDateTo;
}

function focusFirstConfirmationAction() {
  if (confirmImportButton && !confirmImportButton.disabled) {
    confirmImportButton.focus();
    return;
  }

  if (dismissConfirmationButton && !dismissConfirmationButton.disabled) {
    dismissConfirmationButton.focus();
  }
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
    "";
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
    orderNumber: normalizeText(
      payload?.orderNumber || payload?.externalOrderId,
    ),
    productErp: rawProductDescription,
    productCode:
      normalizeText(candidates.productCode) ||
      normalizeText(payload?.item?.productCode),
    customerName: normalizeText(candidates.customerName),
    productBase: baseProduct,
    variations: explicitVariations || variationPieces.join(" | ") || "",
    notes:
      normalizeText(candidates.complementaryFields) ||
      normalizeText(payload?.notes),
    quantity: payload?.item?.quantity,
    unit: payload?.item?.unit,
    dueDate: payload?.dueDate,
    sourcePageUrl: normalizeText(payload?.sourcePageUrl),
    extractionStrategy: normalizeText(payload?.rawPayload?.extractionStrategy),
    hasVariationMapping: Boolean(explicitVariations || variationPieces.length),
  };
}

function renderImportConfirmation(payload) {
  const snapshot = buildDerivedSnapshot(payload);

  confirmOrderNumber.textContent = formatFallback(
    snapshot.orderNumber,
    "Não capturada",
  );
  confirmProductErp.textContent = formatFallback(
    snapshot.productErp,
    "Não capturado",
  );
  confirmProductCode.textContent = formatFallback(
    snapshot.productCode,
    "Não capturado",
  );
  confirmCustomerName.textContent = formatFallback(
    snapshot.customerName,
    "Não capturado",
  );
  confirmProductBase.textContent = formatFallback(
    snapshot.productBase,
    "Não identificado",
  );
  confirmVariations.textContent = formatFallback(
    snapshot.variations,
    "Não identificadas",
  );
  confirmQuantity.textContent = formatQuantity(snapshot.quantity);
  confirmUnit.textContent = formatFallback(snapshot.unit, "Não capturada");
  confirmDueDate.textContent = formatDate(snapshot.dueDate);
  confirmNotes.textContent = formatFallback(snapshot.notes, "Não capturadas");
}

function setImportConfirmationOpen(isOpen, { restoreFocus = true } = {}) {
  state.isImportConfirmationOpen = isOpen;
  importConfirmationPanel.hidden = !isOpen;
  updateImportActionState();

  if (isOpen) {
    focusFirstConfirmationAction();
    return;
  }

  if (
    restoreFocus &&
    state.lastFocusedElementBeforeConfirmation instanceof HTMLElement
  ) {
    state.lastFocusedElementBeforeConfirmation.focus();
  }
}

function resetImportButtonState() {
  state.importButtonMode = "idle";
  updateImportActionState();
}

function markImportSuccess() {
  state.importButtonMode = "success";
  updateImportActionState();
}

function buildSettingsMissingDetails(settings) {
  return [
    formatDetailLabel(
      "API configurada",
      normalizeText(settings.apiBaseUrl) || "Não informada",
    ),
    formatDetailLabel(
      "E-mail configurado",
      normalizeText(settings.userEmail) || "Não informado",
    ),
    "Abra a engrenagem para preencher os dados da API do sistema destino.",
  ];
}

function normalizeFeedbackDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details.map((detail) => normalizeText(detail)).filter(Boolean);
}

function buildImportErrorFeedback(errorLike, settings = {}) {
  const message = normalizeText(errorLike?.message || errorLike);
  const normalizedMessage =
    message || "Erro inesperado durante a importação da OP.";
  const details = normalizeFeedbackDetails(errorLike?.details);

  if (
    !normalizeText(settings.apiBaseUrl) ||
    !normalizeText(settings.userEmail)
  ) {
    return {
      message:
        "A criação da OP precisa da API e do e-mail configurados antes do envio.",
      details: buildSettingsMissingDetails(settings),
      tone: "error",
    };
  }

  if (/sessao expirada|renovar o token/i.test(normalizedMessage)) {
    return {
      message: normalizedMessage,
      details: [
        "Abra a configuração avançada e informe a senha para renovar a sessão.",
        ...details,
      ],
      tone: "error",
    };
  }

  if (/failed to fetch|networkerror|network error/i.test(normalizedMessage)) {
    return {
      message: "A extensão não conseguiu alcançar a API do sistema destino.",
      details: [
        formatDetailLabel(
          "API configurada",
          normalizeText(settings.apiBaseUrl) || "Não informada",
        ),
        "Verifique se a API está online e acessível a partir do navegador.",
        ...details,
      ],
      tone: "error",
    };
  }

  return {
    message: normalizedMessage,
    details,
    tone: "error",
  };
}

function buildOrderOptionLabel(payload) {
  const snapshot = buildDerivedSnapshot(payload);
  const primaryId =
    snapshot.orderNumber || normalizeText(payload?.externalOrderId) || "OP";
  const code = snapshot.productCode || "Código não informado";
  const variations = snapshot.variations || snapshot.productErp;

  return [primaryId, code, variations].filter(Boolean).join(" | ");
}

function renderOrderOptions(payloadOptions, selectedPayload) {
  state.currentPayloadOptions = Array.isArray(payloadOptions)
    ? payloadOptions
    : [];
  setOrderPickerOpen(false);

  if (state.currentPayloadOptions.length <= 1) {
    orderSelectorSection.hidden = true;
    orderSelectorList.replaceChildren();
    orderSelectorCount.textContent = "1 OP";
    orderSelectorTrigger.textContent =
      buildOrderOptionLabel(selectedPayload) || "Selecionar ordem";
    orderSelectorTrigger.disabled = true;
    return;
  }

  const selectedKey = buildPayloadSelectionKey(selectedPayload);
  const optionNodes = state.currentPayloadOptions.map((payload) => {
    const option = document.createElement("button");
    const optionKey = buildPayloadSelectionKey(payload);
    option.type = "button";
    option.className = "order-picker__option";
    option.setAttribute("role", "option");
    option.dataset.selectionKey = optionKey;
    option.setAttribute("aria-selected", String(optionKey === selectedKey));
    option.textContent = buildOrderOptionLabel(payload);

    if (optionKey === selectedKey) {
      option.classList.add("order-picker__option--selected");
    }

    option.addEventListener("click", () => {
      selectOrderPayloadByKey(optionKey);
    });

    return option;
  });

  orderSelectorList.replaceChildren(...optionNodes);
  orderSelectorTrigger.textContent =
    buildOrderOptionLabel(selectedPayload) || "Selecionar ordem";
  orderSelectorCount.textContent = `${state.currentPayloadOptions.length} OPs`;
  orderSelectorTrigger.disabled = false;
  orderSelectorSection.hidden = false;
}

function renderCapturedData(payload) {
  resetImportButtonState();
  const snapshot = buildDerivedSnapshot(payload);

  captureProductErp.textContent = formatFallback(
    snapshot.productErp,
    "Não capturado",
  );
  captureOrderNumber.textContent = formatFallback(
    snapshot.orderNumber,
    "Não capturada",
  );
  captureProductCode.textContent = formatFallback(
    snapshot.productCode,
    "Não capturado",
  );
  captureCustomerName.textContent = formatFallback(
    snapshot.customerName,
    "Não capturado",
  );
  captureProductBase.textContent = formatFallback(
    snapshot.productBase,
    "Não identificado",
  );
  captureVariations.textContent = formatFallback(
    snapshot.variations,
    "Não identificadas",
  );
  captureQuantity.textContent = formatQuantity(snapshot.quantity);
  captureUnit.textContent = formatFallback(snapshot.unit, "Não capturada");
  captureDueDate.textContent = formatDate(snapshot.dueDate);
  captureNotes.textContent = formatFallback(snapshot.notes, "Não capturadas");

  if (snapshot.hasVariationMapping) {
    setMappingState("success", "Variação encontrada");
  } else if (snapshot.productErp) {
    setMappingState("warning", "Mapeamento parcial");
  } else {
    setMappingState("neutral", "Aguardando leitura da página");
  }
}

function clearCapturedData() {
  resetImportButtonState();
  setImportConfirmationOpen(false, { restoreFocus: false });
  state.currentPayloadOptions = [];
  captureOrderNumber.textContent = "Não capturada";
  captureProductErp.textContent = "Não capturado";
  captureProductCode.textContent = "Não capturado";
  captureCustomerName.textContent = "Não capturado";
  captureProductBase.textContent = "Não identificado";
  captureVariations.textContent = "Não identificadas";
  captureQuantity.textContent = "Não capturada";
  captureUnit.textContent = "Não capturada";
  captureDueDate.textContent = "Não capturado";
  captureNotes.textContent = "Não capturadas";
  orderSelectorSection.hidden = true;
  orderSelectorList.replaceChildren();
  orderSelectorCount.textContent = "0 OPs";
  orderSelectorTrigger.textContent = "Selecionar ordem";
  orderSelectorTrigger.disabled = true;
  setOrderPickerOpen(false);
  setMappingState("neutral", "Aguardando leitura da página");
}

function loadMockPreview() {
  state.currentPayloadOptions = structuredClone(MOCK_PREVIEW_OPTIONS);
  state.currentPayload = state.currentPayloadOptions[0];
  syncDateFilters({
    issueDateFrom: "2026-06-01",
    issueDateTo: "2026-06-30",
  });
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload);
  renderCapturedData(state.currentPayload);
  importButton.disabled = false;
  renderFeedback(
    "Preview visual carregado com dados mockados para revisar a popup.",
    [
      formatDetailLabel("Modo", "Preview visual local"),
      formatDetailLabel("Estratégia de captura", "preview-mock"),
      formatDetailLabel(
        "Periodo",
        formatPeriodLabel(
          state.activeFilters.issueDateFrom,
          state.activeFilters.issueDateTo,
        ),
      ),
      formatDetailLabel(
        "Ordens encontradas",
        String(state.currentPayloadOptions.length),
      ),
      formatDetailLabel("Pagina", MOCK_PREVIEW_PAYLOAD.sourcePageUrl),
    ],
    "success",
  );
  void appendExtensionLog({
    source: "popup",
    level: "info",
    message: "Preview visual mockado carregado na popup.",
    details: [
      formatDetailLabel(
        "Ordens encontradas",
        String(state.currentPayloadOptions.length),
      ),
    ],
  });
}

async function handleReviewData() {
  if (
    state.activeFilters.issueDateFrom &&
    state.activeFilters.issueDateTo &&
    state.activeFilters.issueDateFrom > state.activeFilters.issueDateTo
  ) {
    renderFeedback(
      "O período informado está inválido.",
      [
        formatDetailLabel(
          "Periodo",
          formatPeriodLabel(
            state.activeFilters.issueDateFrom,
            state.activeFilters.issueDateTo,
          ),
        ),
      ],
      "error",
    );
    return;
  }

  resetImportButtonState();
  setImportConfirmationOpen(false, { restoreFocus: false });
  setBusy(true);
  renderFeedback(
    "Analisando a página atual do ERP Flex para buscar as Ordens de Produção...",
  );

  try {
    await collectOrderPreview();
  } catch (error) {
    state.currentPayload = null;
    clearCapturedData();
    void appendExtensionLog({
      source: "popup",
      level: "error",
      message:
        error instanceof Error
          ? error.message
          : "Falha ao analisar os dados do ERP.",
    });
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao analisar os dados do ERP.",
      [],
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function loadSettings() {
  const response = await sendRuntimeMessage({
    type: "ERP_FLEX_GET_SETTINGS",
  });

  if (!response?.ok) {
    throw new Error(
      response?.message ?? "Falha ao carregar configurações da extensão.",
    );
  }

  renderSession(response.settings);

  if (response.settings.lastImportSummary) {
    renderFeedback(response.settings.lastImportSummary, [], "success");
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
    throw new Error(
      "Não foi possível identificar a aba ativa para coletar a ordem.",
    );
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

    if (
      Array.isArray(response?.missingFields) &&
      response.missingFields.length > 0
    ) {
      details.push(
        formatDetailLabel(
          "Campos faltantes",
          response.missingFields.join(", "),
        ),
      );
    }

    if (response?.extractionMeta?.sourcePageUrl) {
      details.push(
        formatDetailLabel("Pagina", response.extractionMeta.sourcePageUrl),
      );
    }

    if (response?.extractionMeta?.activeFilters) {
      syncDateFilters(response.extractionMeta.activeFilters);
      details.push(
        formatDetailLabel(
          "Periodo",
          formatPeriodLabel(
            response.extractionMeta.activeFilters.issueDateFrom,
            response.extractionMeta.activeFilters.issueDateTo,
          ),
        ),
      );
    }

    setMappingState("error", "Revisar captura");
    void appendExtensionLog({
      source: "Análise",
      level: "warning",
      message:
        response?.message ?? "A página atual não retornou dados válidos.",
      details,
    });
    renderFeedback(
      response?.message ?? "A página atual não retornou dados válidos.",
      details,
      "error",
    );

    return null;
  }

  const payloadOptions = Array.isArray(response.payloadOptions)
    ? response.payloadOptions.map((entry) => entry?.payload).filter(Boolean)
    : [response.payload];

  state.currentPayloadOptions = payloadOptions;
  state.currentPayload = response.payload ?? null;
  syncDateFilters(response?.extractionMeta?.activeFilters);
  renderOrderOptions(payloadOptions, state.currentPayload);
  renderCapturedData(state.currentPayload);
  importButton.disabled = !state.currentPayload;

  const snapshot = buildDerivedSnapshot(state.currentPayload);
  const details = [];

  if (snapshot.extractionStrategy) {
    details.push(
      formatDetailLabel("Estrategia de captura", snapshot.extractionStrategy),
    );
  }

  if (snapshot.sourcePageUrl) {
    details.push(formatDetailLabel("Página", snapshot.sourcePageUrl));
  }

  details.push(
    formatDetailLabel(
      "Período",
      formatPeriodLabel(
        state.activeFilters.issueDateFrom,
        state.activeFilters.issueDateTo,
      ),
    ),
  );

  if (payloadOptions.length > 1) {
    details.push(
      formatDetailLabel("Ordens encontradas", String(payloadOptions.length)),
    );
  }

  if (response?.extractionMeta?.requiresExplicitSelection) {
    void appendExtensionLog({
      source: "Análise",
      level: "warning",
      message:
        "A análise encontrou múltiplas OPs e exige seleção manual antes da importação.",
      details,
    });
    renderFeedback(
      "A análise encontrou várias OPs e não conseguiu confirmar automaticamente qual corresponde à tela atual. Selecione a ordem correta na lista antes de importar.",
      details,
      "error",
    );
    setMappingState("warning", "Selecionar OP");
  } else {
    void appendExtensionLog({
      source: "Análise",
      level: "success",
      message: "Análise da página concluída com sucesso.",
      details,
    });
    renderFeedback(
      "Análise concluída. Revise a OP encontrada e siga para a criação no kanban.",
      details,
      "success",
    );
  }

  return response.payload;
}

function buildImportFeedback(result) {
  if (result.result === "duplicate") {
    return {
      message: "A OP selecionada já existe no sistema destino.",
      details: [
        formatDetailLabel(
          "OP existente",
          result.existingProductionOrderId ?? "Não informado",
        ),
        formatDetailLabel(
          "Id externo ERP",
          result.externalOrderId ?? "Não informado",
        ),
      ],
      tone: "error",
    };
  }

  return {
    message: `OP ${result.productionOrder?.orderNumber ?? ""} criada no kanban com sucesso.`,
    details: [
      formatDetailLabel(
        "Id da ordem",
        result.productionOrder?.id ?? "Não informado",
      ),
      formatDetailLabel(
        "Id externo ERP",
        result.productionOrder?.source?.externalOrderId ?? "Não informado",
      ),
      formatDetailLabel(
        "Status inicial",
        result.productionOrder?.status ?? "Não informado",
      ),
    ],
    tone: "success",
  };
}

function openImportConfirmation() {
  if (!state.currentPayload) {
    void appendExtensionLog({
      source: "importacao",
      level: "warning",
      message:
        "Tentativa de abrir a confirmação de importação sem payload capturado.",
    });
    renderFeedback(
      "Faça a análise da página atual antes de criar a OP no kanban.",
      [],
      "error",
    );
    return;
  }

  resetImportButtonState();
  state.lastFocusedElementBeforeConfirmation = document.activeElement;
  renderImportConfirmation(state.currentPayload);
  setImportConfirmationOpen(true, { restoreFocus: false });
  void appendExtensionLog({
    source: "importacao",
    level: "info",
    message: "Confirmação final de importação aberta na popup.",
  });
  renderFeedback(
    "Confirme os dados da OP selecionada antes de enviar para o sistema destino.",
  );
}

function closeImportConfirmation(options) {
  setImportConfirmationOpen(false, options);
}

async function handleImportConfirmation() {
  if (!state.currentPayload || state.isSubmittingImport) {
    return;
  }

  state.importButtonMode = "loading";
  setBusy(true, { importBusy: true });
  renderFeedback("Enviando a OP confirmada para o sistema destino...");

  try {
    const settings = await saveBaseSettings();
    if (
      !normalizeText(settings.apiBaseUrl) ||
      !normalizeText(settings.userEmail)
    ) {
      throw {
        message:
          "A criação da OP precisa da API e do e-mail configurados antes do envio.",
        details: buildSettingsMissingDetails(settings),
      };
    }

    const importResponse = await sendRuntimeMessage({
      type: "ERP_FLEX_IMPORT_ORDER",
      apiBaseUrl: settings.apiBaseUrl,
      userEmail: settings.userEmail,
      userPassword: "",
      accessToken: settings.accessToken,
      payload: state.currentPayload,
    });

    if (!importResponse?.ok) {
      throw importResponse;
    }

    const feedback = buildImportFeedback(importResponse);

    if (importResponse.result === "created") {
      markImportSuccess();
    } else {
      state.importButtonMode = "idle";
    }

    closeImportConfirmation({ restoreFocus: false });
    renderFeedback(feedback.message, feedback.details, feedback.tone);

    await loadSettings();
  } catch (error) {
    const settingsFallback =
      error && typeof error === "object" && "apiBaseUrl" in error
        ? error
        : await saveBaseSettings().catch(() => ({
            apiBaseUrl: "",
            userEmail: "",
          }));
    const feedback = buildImportErrorFeedback(error, settingsFallback);
    state.importButtonMode = "idle";
    void appendExtensionLog({
      source: "importacao",
      level: "error",
      message: feedback.message,
      details: feedback.details,
    });
    renderFeedback(feedback.message, feedback.details, feedback.tone);
  } finally {
    setBusy(false, { importBusy: false });
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
    void appendExtensionLog({
      source: "popup",
      level: "error",
      message:
        error instanceof Error ? error.message : "Falha ao iniciar a extensão.",
    });
    renderFeedback(
      error instanceof Error ? error.message : "Falha ao iniciar a extensão.",
      [],
      "error",
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
  renderImportConfirmation(selectedPayload);

  const snapshot = buildDerivedSnapshot(selectedPayload);
  const details = [];

  if (snapshot.extractionStrategy) {
    details.push(
      formatDetailLabel("Estratégia de captura", snapshot.extractionStrategy),
    );
  }

  if (snapshot.sourcePageUrl) {
    details.push(formatDetailLabel("Página", snapshot.sourcePageUrl));
  }

  details.push(
    formatDetailLabel(
      "Período",
      formatPeriodLabel(
        state.activeFilters.issueDateFrom,
        state.activeFilters.issueDateTo,
      ),
    ),
  );

  if (state.currentPayloadOptions.length > 1) {
    details.push(
      formatDetailLabel(
        "Ordens encontradas",
        String(state.currentPayloadOptions.length),
      ),
    );
  }

  renderFeedback(
    "OP selecionada a partir da análise. Revise os dados e siga para a criação no kanban.",
    details,
    "success",
  );
  void appendExtensionLog({
    source: "popup",
    level: "info",
    message: "OP selecionada manualmente na lista da popup.",
    details,
  });
  setBusy(false);
  setOrderPickerOpen(false);

  return true;
}

bindClick(orderSelectorTrigger, () => {
  setOrderPickerOpen(!state.isOrderPickerOpen);
});

document.addEventListener("click", (event) => {
  if (orderSelectorSection && !orderSelectorSection.contains(event.target)) {
    setOrderPickerOpen(false);
  }
});

bindChange(issueDateFromInput, () => {
  state.activeFilters.issueDateFrom = normalizeDateInputValue(
    issueDateFromInput.value,
  );
});

bindChange(issueDateToInput, () => {
  state.activeFilters.issueDateTo = normalizeDateInputValue(
    issueDateToInput.value,
  );
});

bindClick(reviewButton, () => {
  void handleReviewData();
});

bindClick(importButton, () => {
  openImportConfirmation();
});

bindClick(confirmImportButton, () => {
  void handleImportConfirmation();
});

bindClick(cancelConfirmationButton, () => {
  closeImportConfirmation();
});

bindClick(dismissConfirmationButton, () => {
  closeImportConfirmation();
});

bindClick(loadPreviewButton, () => {
  loadMockPreview();
});

bindClick(openAdvancedSettingsButton, () => {
  void appendExtensionLog({
    source: "Navegação",
    level: "info",
    message: "Navegação para a configuração avançada iniciada pela popup.",
  });
  window.location.href = "advanced-settings.html";
});

bindClick(openLogsButton, () => {
  void appendExtensionLog({
    source: "Navegação",
    level: "info",
    message: "Navegação para a página de logs iniciada pela popup.",
  });
  window.location.href = "logs.html";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.isImportConfirmationOpen) {
    event.preventDefault();
    closeImportConfirmation();
  }
});

void bootstrapPopup();
