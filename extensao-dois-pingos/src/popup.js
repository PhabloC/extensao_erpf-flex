const popupCard = document.querySelector(".popup-card");
const statusMessage = document.getElementById("status-message");
const statusAlert = document.getElementById("status-alert");
const feedbackPanel = document.getElementById("feedback-panel");
const mappingStatus = document.getElementById("mapping-status");
const importButton = document.getElementById("import-button");
const reviewButton = document.getElementById("review-button");
const reviewButtonIcon = document.getElementById("review-button-icon");
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
const orderSelectorSearch = document.getElementById("order-selector-search");
const orderSelectorList = document.getElementById("order-selector-list");
const orderSelectorEmpty = document.getElementById("order-selector-empty");
const selectedOrdersSection = document.getElementById("selected-orders-section");
const selectedOrdersCount = document.getElementById("selected-orders-count");
const selectedOrdersList = document.getElementById("selected-orders-list");
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
const importConfirmationTitle = document.getElementById(
  "import-confirmation-title",
);
const importConfirmationCopy = document.getElementById(
  "import-confirmation-copy",
);
const importConfirmationList = document.getElementById("import-confirmation-list");
const activeConflictPanel = document.getElementById("active-conflict-panel");
const cancelActiveConflictButton = document.getElementById(
  "cancel-active-conflict-button",
);
const confirmActiveUpdateButton = document.getElementById(
  "confirm-active-update-button",
);
const dismissActiveConflictButton = document.getElementById(
  "dismiss-active-conflict-button",
);
const activeConflictTitle = document.getElementById("active-conflict-title");
const activeConflictCopy = document.getElementById("active-conflict-copy");
const activeConflictHighlight = document.getElementById(
  "active-conflict-highlight",
);
const activeConflictList = document.getElementById("active-conflict-list");
const importSuccessOverlay = document.getElementById("import-success-overlay");
const importSuccessMessage = document.getElementById("import-success-message");
const importErrorOverlay = document.getElementById("import-error-overlay");
const importErrorMessage = document.getElementById("import-error-message");
const importErrorLogsButton = document.getElementById("import-error-logs-button");
const importErrorDismissButton = document.getElementById(
  "import-error-dismiss-button",
);
const IMPORT_RESULT_ANIMATION_MS = 1800;
let importSuccessAnimationTimer = null;
const state = {
  currentPayload: null,
  currentPayloadOptions: [],
  selectedPayloadKeys: [],
  orderSearchTerm: "",
  activeFilters: getCurrentMonthDateRange(),
  isOrderPickerOpen: false,
  isImportConfirmationOpen: false,
  isActiveConflictOpen: false,
  isSubmittingImport: false,
  importButtonMode: "idle",
  lastFocusedElementBeforeConfirmation: null,
  lastFocusedElementBeforeActiveConflict: null,
  pendingBatchSummary: null,
  pendingActiveConflicts: [],
  pendingImportErrorFeedback: null,
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

function findPayloadBySelectionKey(selectionKey) {
  return state.currentPayloadOptions.find((payload) => {
    return buildPayloadSelectionKey(payload) === selectionKey;
  });
}

function getSelectedPayloads() {
  return state.selectedPayloadKeys
    .map((selectionKey) => findPayloadBySelectionKey(selectionKey))
    .filter(Boolean);
}

function setSelectedPayloadKeys(selectionKeys) {
  const availableSelectionKeys = new Set(
    state.currentPayloadOptions.map((payload) => buildPayloadSelectionKey(payload)),
  );

  state.selectedPayloadKeys = Array.from(new Set(selectionKeys)).filter(
    (selectionKey) => availableSelectionKeys.has(selectionKey),
  );
}

function ensureCurrentPayload(selectionKey = "") {
  const explicitPayload = selectionKey ? findPayloadBySelectionKey(selectionKey) : null;

  if (explicitPayload) {
    state.currentPayload = explicitPayload;
    return;
  }

  const selectedPayloads = getSelectedPayloads();

  if (selectedPayloads.length > 0) {
    state.currentPayload = selectedPayloads[0];
    return;
  }

  state.currentPayload = state.currentPayloadOptions[0] ?? null;
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

function formatBooleanLabel(value) {
  return value ? "sim" : "nao";
}

function buildAnalysisDiagnosticDetails(response) {
  const details = [];
  const payloadOptions = Array.isArray(response?.payloadOptions)
    ? response.payloadOptions
    : [];
  const missingFields = Array.isArray(response?.missingFields)
    ? response.missingFields.filter(Boolean)
    : [];
  const extractionMeta = response?.extractionMeta ?? {};
  const payloadPreview = response?.payloadPreview ?? null;
  const selectedPayload = response?.payload ?? payloadPreview ?? null;
  const selectedSnapshot = buildDerivedSnapshot(selectedPayload);

  if (response?.code) {
    details.push(formatDetailLabel("Codigo", response.code));
  }

  details.push(
    formatDetailLabel(
      "Payload principal",
      formatBooleanLabel(Boolean(response?.payload)),
    ),
  );
  details.push(
    formatDetailLabel("Opcoes retornadas", String(payloadOptions.length)),
  );

  if (missingFields.length > 0) {
    details.push(
      formatDetailLabel("Campos faltantes", missingFields.join(", ")),
    );
  }

  if (selectedSnapshot.orderNumber) {
    details.push(formatDetailLabel("OP selecionada", selectedSnapshot.orderNumber));
  }

  if (selectedSnapshot.productCode) {
    details.push(formatDetailLabel("Codigo produto", selectedSnapshot.productCode));
  }

  if (extractionMeta.endpointUrl) {
    details.push(formatDetailLabel("Endpoint", extractionMeta.endpointUrl));
  }

  if (extractionMeta.sourcePageUrl) {
    details.push(formatDetailLabel("Pagina", extractionMeta.sourcePageUrl));
  }

  if (extractionMeta.activeFilters) {
    details.push(
      formatDetailLabel(
        "Periodo",
        formatPeriodLabel(
          extractionMeta.activeFilters.issueDateFrom,
          extractionMeta.activeFilters.issueDateTo,
        ),
      ),
    );
  }

  details.push(
    formatDetailLabel(
      "Usou endpoint estruturado",
      formatBooleanLabel(Boolean(extractionMeta.usedStructuredSource)),
    ),
  );
  details.push(
    formatDetailLabel(
      "Suporte via endpoint",
      formatBooleanLabel(Boolean(extractionMeta.supportedByStructuredEndpoint)),
    ),
  );

  if ("requiresExplicitSelection" in extractionMeta) {
    details.push(
      formatDetailLabel(
        "Exige selecao manual",
        formatBooleanLabel(Boolean(extractionMeta.requiresExplicitSelection)),
      ),
    );
  }

  if ("noResults" in extractionMeta) {
    details.push(
      formatDetailLabel(
        "Sem resultados no periodo",
        formatBooleanLabel(Boolean(extractionMeta.noResults)),
      ),
    );
  }

  if (typeof extractionMeta.totalStructuredOrders === "number") {
    details.push(
      formatDetailLabel(
        "Ordens estruturadas",
        String(extractionMeta.totalStructuredOrders),
      ),
    );
  }

  if (typeof extractionMeta.bestMatchScore === "number") {
    details.push(
      formatDetailLabel("Score do match", String(extractionMeta.bestMatchScore)),
    );
  }

  return details;
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

function parseDetailLabel(detail) {
  const separatorIndex = detail.indexOf(": ");

  if (separatorIndex === -1) {
    return {
      label: detail,
      value: "",
    };
  }

  return {
    label: detail.slice(0, separatorIndex),
    value: detail.slice(separatorIndex + 2),
  };
}

function clearDuplicateAlert() {
  if (!statusAlert) {
    return;
  }

  statusAlert.hidden = true;
  statusAlert.replaceChildren();
  feedbackPanel?.classList.remove("feedback-panel--duplicate");
}

function getDetailValue(details, label) {
  const prefix = `${label}: `;
  const match = details.find((detail) => detail.startsWith(prefix));

  if (!match) {
    return "";
  }

  return match.slice(prefix.length).trim();
}

function renderDuplicateAlert(message, details = []) {
  if (!statusAlert) {
    statusMessage.hidden = false;
    statusMessage.textContent = message;
    return;
  }

  clearDuplicateAlert();
  statusAlert.hidden = false;
  statusMessage.hidden = true;
  feedbackPanel?.classList.add("feedback-panel--duplicate");

  const header = document.createElement("div");
  header.className = "feedback-alert__header";

  const pulse = document.createElement("span");
  pulse.className = "feedback-alert__pulse";
  pulse.setAttribute("aria-hidden", "true");

  const title = document.createElement("p");
  title.className = "feedback-alert__title";
  title.textContent = "OP ativa já existente";

  header.append(pulse, title);

  const externalOrderId = getDetailValue(details, "Id externo ERP");

  if (externalOrderId) {
    const highlight = document.createElement("div");
    highlight.className = "feedback-alert__highlight";

    const highlightLabel = document.createElement("span");
    highlightLabel.className = "feedback-alert__highlight-label";
    highlightLabel.textContent = "Id externo ERP";

    const highlightValue = document.createElement("strong");
    highlightValue.className = "feedback-alert__highlight-value";
    highlightValue.textContent = externalOrderId;

    highlight.append(highlightLabel, highlightValue);
    statusAlert.append(header, highlight);
  } else {
    statusAlert.append(header);
  }

  const body = document.createElement("p");
  body.className = "feedback-alert__message";
  body.textContent = message;
  statusAlert.append(body);

  const secondaryDetails = details.filter(
    (detail) => !detail.startsWith("Id externo ERP: "),
  );

  if (secondaryDetails.length) {
    const detailsList = document.createElement("dl");
    detailsList.className = "feedback-alert__details";

    secondaryDetails.forEach((detail) => {
      const { label, value } = parseDetailLabel(detail);
      const row = document.createElement("div");
      row.className = "feedback-alert__detail-row";

      const term = document.createElement("dt");
      term.textContent = label;

      const definition = document.createElement("dd");
      definition.textContent = value;

      row.append(term, definition);
      detailsList.append(row);
    });

    statusAlert.append(detailsList);
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

function renderFeedback(message, _details = [], tone = "neutral") {
  if (tone === "duplicate") {
    clearDuplicateAlert();
    renderDuplicateAlert(message, _details);
    return;
  }

  clearDuplicateAlert();
  statusMessage.hidden = false;
  statusMessage.textContent = message;
  setFeedbackTone(tone);
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

function setReviewButtonVisualState(isBusy) {
  if (!reviewButton) {
    return;
  }

  reviewButton.classList.toggle("icon-button--busy", isBusy);
  reviewButton.setAttribute(
    "aria-label",
    isBusy
      ? "Analisando a página atual do ERP"
      : "Fazer análise da página atual do ERP",
  );
  reviewButton.setAttribute(
    "title",
    isBusy ? "Analisando..." : "Fazer análise",
  );

  if (reviewButtonIcon) {
    reviewButtonIcon.innerHTML = isBusy ? "&#8635;" : "&#10227;";
  }
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
  const selectedPayloadCount = getSelectedPayloads().length;
  const hasImportSelection = selectedPayloadCount > 0;
  const hasMultipleOrders = state.currentPayloadOptions.length > 1;

  setButtonVisualState(importButton, state.importButtonMode, {
    idle:
      selectedPayloadCount > 1
        ? `Criar ${selectedPayloadCount} OPs no Kanban`
        : "Criar OP no Kanban",
    loading:
      selectedPayloadCount > 1
        ? "Criando OPs no Kanban..."
        : "Criando OP no Kanban...",
    success:
      selectedPayloadCount > 1 ? "OPs enviadas ao Kanban" : "OP criada no Kanban",
  });

  setButtonVisualState(confirmImportButton, state.importButtonMode, {
    idle:
      selectedPayloadCount > 1
        ? `Confirmar e criar ${selectedPayloadCount} OPs`
        : "Confirmar e criar OP",
    loading:
      selectedPayloadCount > 1
        ? "Criando OPs no Kanban..."
        : "Criando OP no Kanban...",
    success:
      selectedPayloadCount > 1 ? "OPs enviadas ao Kanban" : "OP criada no Kanban",
  });

  setElementDisabled(
    importButton,
    !hasImportSelection ||
      state.isSubmittingImport ||
      state.isImportConfirmationOpen ||
      state.isActiveConflictOpen,
  );
  setElementDisabled(
    confirmImportButton,
    !hasImportSelection || state.isSubmittingImport,
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
  } = options;

  state.isSubmittingImport = importBusy;

  setElementDisabled(reviewButton, isBusy);
  setElementDisabled(loadPreviewButton, isBusy);
  setElementDisabled(openAdvancedSettingsButton, isBusy);
  setElementDisabled(openLogsButton, isBusy);
  setElementDisabled(issueDateFromInput, isBusy);
  setElementDisabled(issueDateToInput, isBusy);
  setReviewButtonVisualState(isBusy);
  updateImportActionState();
  updateActiveConflictActionState();
}

function setOrderPickerOpen(isOpen) {
  const canOpen =
    state.currentPayloadOptions.length > 1 && !orderSelectorTrigger.disabled;
  const nextState = canOpen ? isOpen : false;
  const wasOpen = state.isOrderPickerOpen;

  state.isOrderPickerOpen = nextState;
  orderSelectorPanel.hidden = !nextState;
  orderSelectorTrigger.setAttribute("aria-expanded", String(nextState));

  if (orderSelectorSearch) {
    if (nextState && !wasOpen) {
      orderSelectorSearch.focus();
      orderSelectorSearch.select();
    } else if (!nextState && wasOpen) {
      orderSelectorSearch.blur();
    }
  }
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

function buildConfirmOrderDetailsList(snapshot) {
  const details = document.createElement("dl");
  details.className = "confirm-list confirm-order-item__details";

  const fields = [
    ["OP:", formatFallback(snapshot.orderNumber, "Não capturada")],
    ["Produto ERP:", formatFallback(snapshot.productErp, "Não capturado")],
    ["Código:", formatFallback(snapshot.productCode, "Não capturado")],
    ["Cliente:", formatFallback(snapshot.customerName, "Não capturado")],
    ["Produto base:", formatFallback(snapshot.productBase, "Não identificado")],
    ["Variações:", formatFallback(snapshot.variations, "Não identificadas")],
    ["Quantidade:", formatQuantity(snapshot.quantity)],
    ["Unidade de Medida:", formatFallback(snapshot.unit, "Não capturada")],
    ["Prazo:", formatDate(snapshot.dueDate)],
    ["Observações:", formatFallback(snapshot.notes, "Não capturadas")],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "confirm-row";

    const term = document.createElement("dt");
    term.textContent = label;

    const definition = document.createElement("dd");
    definition.textContent = value;

    row.append(term, definition);
    details.append(row);
  });

  return details;
}

function createConfirmOrderAccordionItem(payload) {
  const snapshot = buildDerivedSnapshot(payload);
  const article = document.createElement("article");
  article.className = "confirm-order-item confirm-order-item--collapsible";
  article.setAttribute("role", "listitem");

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "confirm-order-item__trigger";
  trigger.setAttribute("aria-expanded", "false");

  const summary = document.createElement("span");
  summary.className = "confirm-order-item__summary";
  summary.textContent = buildOrderOptionLabel(payload);

  const chevron = document.createElement("span");
  chevron.className = "confirm-order-item__chevron";
  chevron.setAttribute("aria-hidden", "true");

  trigger.append(summary, chevron);

  const details = buildConfirmOrderDetailsList(snapshot);
  details.hidden = true;

  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    trigger.setAttribute("aria-expanded", String(nextExpanded));
    details.hidden = !nextExpanded;
    article.classList.toggle("confirm-order-item--expanded", nextExpanded);
  });

  article.append(trigger, details);
  return article;
}

function createConfirmOrderSingleItem(payload) {
  const article = document.createElement("article");
  article.className = "confirm-order-item confirm-order-item--single";
  article.setAttribute("role", "listitem");
  article.append(buildConfirmOrderDetailsList(buildDerivedSnapshot(payload)));
  return article;
}

function renderImportConfirmation() {
  const selectedPayloads = getSelectedPayloads();
  const selectedPayloadCount = selectedPayloads.length;
  const isMultiple = selectedPayloadCount > 1;

  if (importConfirmationTitle) {
    importConfirmationTitle.textContent = isMultiple
      ? "Confirmar criação das OPs"
      : "Confirmar criação da OP";
  }

  if (importConfirmationCopy) {
    importConfirmationCopy.textContent = isMultiple
      ? `Revise as ${selectedPayloadCount} OPs selecionadas. Toque em cada uma para expandir os detalhes antes de enviar.`
      : "Revise a OP selecionada antes de enviar para o sistema destino.";
  }

  if (!importConfirmationList) {
    return;
  }

  importConfirmationList.replaceChildren();

  if (selectedPayloadCount === 0) {
    return;
  }

  selectedPayloads.forEach((payload) => {
    importConfirmationList.append(
      isMultiple
        ? createConfirmOrderAccordionItem(payload)
        : createConfirmOrderSingleItem(payload),
    );
  });
}

function syncModalOverlayState() {
  const isModalOpen =
    state.isImportConfirmationOpen || state.isActiveConflictOpen;

  popupCard?.classList.toggle("popup-card--modal-open", isModalOpen);
  document.body.classList.toggle("popup-modal-open", isModalOpen);

  importConfirmationPanel?.classList.toggle(
    "confirm-panel--stacked",
    state.isImportConfirmationOpen && !state.isActiveConflictOpen,
  );
  activeConflictPanel?.classList.toggle(
    "confirm-panel--stacked",
    state.isActiveConflictOpen,
  );

  if (isModalOpen) {
    window.scrollTo(0, 0);
  }
}

function setImportConfirmationOpen(isOpen, { restoreFocus = true } = {}) {
  state.isImportConfirmationOpen = isOpen;
  importConfirmationPanel.hidden = !isOpen;
  syncModalOverlayState();
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

function focusFirstActiveConflictAction() {
  if (confirmActiveUpdateButton && !confirmActiveUpdateButton.disabled) {
    confirmActiveUpdateButton.focus();
    return;
  }

  if (dismissActiveConflictButton && !dismissActiveConflictButton.disabled) {
    dismissActiveConflictButton.focus();
  }
}

function updateActiveConflictActionState() {
  const isSingle = state.pendingActiveConflicts.length === 1;
  const hasSelectedConflict = state.pendingActiveConflicts.some(
    (conflict) => conflict.selectedForUpdate,
  );
  const conflictsMissingId = (isSingle
    ? state.pendingActiveConflicts
    : state.pendingActiveConflicts.filter((conflict) => conflict.selectedForUpdate)
  ).some((conflict) => !normalizeText(conflict.existingProductionOrderId));

  setElementDisabled(
    confirmActiveUpdateButton,
    state.isSubmittingImport ||
      conflictsMissingId ||
      (!isSingle && !hasSelectedConflict),
  );
  setElementDisabled(cancelActiveConflictButton, state.isSubmittingImport);
  setElementDisabled(dismissActiveConflictButton, state.isSubmittingImport);
}

function renderActiveConflictPanel() {
  const conflicts = state.pendingActiveConflicts;
  const isSingle = conflicts.length === 1;

  if (activeConflictTitle) {
    activeConflictTitle.textContent = isSingle
      ? "OP ativa já existente"
      : `${conflicts.length} OPs ativas encontradas`;
  }

  if (activeConflictCopy) {
    activeConflictCopy.textContent = isSingle
      ? "Esta OP já está ativa no kanban. Deseja atualizar com os dados capturados agora?"
      : "As OPs abaixo já estão ativas no kanban. Marque apenas as que deseja atualizar; as demais serão ignoradas.";
  }

  if (confirmActiveUpdateButton) {
    confirmActiveUpdateButton.textContent = isSingle
      ? "Atualizar OP"
      : "Atualizar selecionadas";
  }

  if (dismissActiveConflictButton) {
    dismissActiveConflictButton.textContent = isSingle
      ? "Ignorar"
      : "Ignorar todas";
  }

  if (activeConflictHighlight) {
    if (isSingle && conflicts[0]) {
      activeConflictHighlight.hidden = false;
      activeConflictHighlight.replaceChildren();

      const label = document.createElement("span");
      label.className = "active-conflict__highlight-label";
      label.textContent = "OP detectada";

      const value = document.createElement("strong");
      value.className = "active-conflict__highlight-value";
      value.textContent = buildOrderOptionLabel(conflicts[0].payload);

      activeConflictHighlight.append(label, value);
    } else {
      activeConflictHighlight.hidden = true;
      activeConflictHighlight.replaceChildren();
    }
  }

  if (activeConflictList) {
    activeConflictList.replaceChildren();

    if (!isSingle) {
      activeConflictList.hidden = false;

      conflicts.forEach((conflict) => {
        const row = document.createElement("label");
        row.className = "active-conflict-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(conflict.selectedForUpdate);
        checkbox.addEventListener("change", () => {
          conflict.selectedForUpdate = checkbox.checked;
          updateActiveConflictActionState();
        });

        const text = document.createElement("span");
        text.textContent = buildOrderOptionLabel(conflict.payload);

        row.append(checkbox, text);
        activeConflictList.append(row);
      });
    } else {
      activeConflictList.hidden = true;
    }
  }

  updateActiveConflictActionState();
}

function setActiveConflictOpen(isOpen, { restoreFocus = true } = {}) {
  state.isActiveConflictOpen = isOpen;

  if (activeConflictPanel) {
    activeConflictPanel.hidden = !isOpen;
  }

  syncModalOverlayState();
  updateImportActionState();

  if (isOpen) {
    renderActiveConflictPanel();
    focusFirstActiveConflictAction();
    return;
  }

  state.pendingActiveConflicts = [];

  if (
    restoreFocus &&
    state.lastFocusedElementBeforeActiveConflict instanceof HTMLElement
  ) {
    state.lastFocusedElementBeforeActiveConflict.focus();
  }
}

function openActiveConflictPanel(conflicts) {
  state.pendingActiveConflicts = conflicts.map((conflict) => ({
    ...conflict,
    selectedForUpdate: false,
  }));
  state.lastFocusedElementBeforeActiveConflict = document.activeElement;
  setActiveConflictOpen(true, { restoreFocus: false });
  void appendExtensionLog({
    source: "importacao",
    level: "warning",
    message:
      conflicts.length > 1
        ? "Importação pausada para confirmar atualização de OPs ativas."
        : "Importação pausada para confirmar atualização de OP ativa.",
    details: [
      formatDetailLabel("OPs ativas", String(conflicts.length)),
    ],
  });
  renderFeedback(
    conflicts.length > 1
      ? "Algumas OPs selecionadas já estão ativas no kanban. Confirme quais deseja atualizar."
      : "A OP selecionada já está ativa no kanban. Confirme se deseja atualizar.",
  );
}

function closeActiveConflictPanel(options) {
  setActiveConflictOpen(false, options);
}

function renderSelectedOrders() {
  const selectedPayloads = getSelectedPayloads();

  if (!selectedOrdersSection || !selectedOrdersList || !selectedOrdersCount) {
    return;
  }

  if (selectedPayloads.length === 0) {
    selectedOrdersSection.hidden = true;
    selectedOrdersList.replaceChildren();
    selectedOrdersCount.textContent = "0 selecionadas";
    updateImportActionState();
    return;
  }

  const nodes = selectedPayloads.map((payload) => {
    const selectionKey = buildPayloadSelectionKey(payload);
    const row = document.createElement("div");
    row.className = "selected-order-chip";
    row.setAttribute("role", "listitem");

    const label = document.createElement("p");
    label.className = "selected-order-chip__label";
    label.textContent = buildOrderOptionLabel(payload);

    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "selected-order-chip__preview";
    previewButton.textContent = "Revisar";
    previewButton.addEventListener("click", () => {
      selectOrderPayloadByKey(selectionKey, {
        toggleSelection: false,
        keepPickerOpen: false,
      });
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "selected-order-chip__remove";
    removeButton.setAttribute("aria-label", "Remover OP da seleção");
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      toggleOrderSelectionByKey(selectionKey, {
        nextSelected: false,
        keepPickerOpen: true,
      });
    });

    row.append(label, previewButton, removeButton);
    return row;
  });

  selectedOrdersList.replaceChildren(...nodes);
  selectedOrdersCount.textContent = `${selectedPayloads.length} selecionadas`;
  selectedOrdersSection.hidden = false;
  updateImportActionState();
}

function resetImportButtonState() {
  state.importButtonMode = "idle";
  updateImportActionState();
}

function buildImportSuccessAnimationMessage({ created = [], updated = [] } = {}) {
  const createdCount = created.length;
  const updatedCount = updated.length;

  if (createdCount > 0 && updatedCount === 0) {
    return createdCount > 1
      ? `${createdCount} OPs criadas com sucesso`
      : "OP criada com sucesso";
  }

  if (updatedCount > 0 && createdCount === 0) {
    return updatedCount > 1
      ? `${updatedCount} OPs atualizadas com sucesso`
      : "OP atualizada com sucesso";
  }

  const total = createdCount + updatedCount;
  return total > 1
    ? `${total} OPs enviadas com sucesso`
    : "OP enviada com sucesso";
}

function hideImportSuccessAnimation() {
  if (importSuccessAnimationTimer) {
    clearTimeout(importSuccessAnimationTimer);
    importSuccessAnimationTimer = null;
  }

  importSuccessOverlay?.classList.remove("import-success-overlay--visible");

  if (importSuccessOverlay) {
    importSuccessOverlay.hidden = true;
  }
}

function hideImportErrorOverlay() {
  importErrorOverlay?.classList.remove("import-error-overlay--visible");

  if (importErrorOverlay) {
    importErrorOverlay.hidden = true;
  }

  state.pendingImportErrorFeedback = null;
}

function hideImportResultAnimations() {
  hideImportSuccessAnimation();
  hideImportErrorOverlay();
}

function resetExtensionToInitialSelection() {
  state.selectedPayloadKeys = [];
  state.currentPayload = null;
  state.pendingBatchSummary = null;
  resetImportButtonState();

  if (state.currentPayloadOptions.length > 0) {
    renderOrderOptions(state.currentPayloadOptions, null, {
      autoSelect: false,
    });
    renderCapturedData(null);
    renderSelectedOrders();
    setMappingState("neutral", "Selecione uma OP");
    renderFeedback(
      "Selecione uma ordem na lista para revisar os dados capturados.",
      [],
      "neutral",
    );
  } else {
    clearCapturedData();
  }

  updateImportActionState();
}

function showImportSuccessAnimation(message) {
  if (!importSuccessOverlay || !importSuccessMessage) {
    resetExtensionToInitialSelection();
    return;
  }

  hideImportResultAnimations();
  importSuccessMessage.textContent = message;
  importSuccessOverlay.hidden = false;
  importSuccessOverlay.classList.remove("import-success-overlay--visible");
  void importSuccessOverlay.offsetWidth;
  importSuccessOverlay.classList.add("import-success-overlay--visible");

  importSuccessAnimationTimer = setTimeout(() => {
    hideImportSuccessAnimation();
    resetExtensionToInitialSelection();
  }, IMPORT_RESULT_ANIMATION_MS);
}

function showImportErrorOverlay(message = "Não foi possível importar a OP.") {
  if (!importErrorOverlay || !importErrorMessage) {
    return;
  }

  hideImportResultAnimations();
  importErrorMessage.textContent = message;
  importErrorOverlay.hidden = false;
  importErrorOverlay.classList.remove("import-error-overlay--visible");
  void importErrorOverlay.offsetWidth;
  importErrorOverlay.classList.add("import-error-overlay--visible");
  importErrorLogsButton?.focus();
}

function dismissImportErrorOverlay() {
  const feedback = state.pendingImportErrorFeedback;

  hideImportErrorOverlay();

  if (feedback) {
    renderFeedback(feedback.message, feedback.details, feedback.tone);
  }
}

function navigateToLogsPage(source = "popup") {
  void appendExtensionLog({
    source: "Navegação",
    level: "info",
    message: "Navegação para a página de logs iniciada pela popup.",
    details: [formatDetailLabel("Origem", source)],
  });
  window.location.href = "logs.html";
}

function dismissImportModalsBeforeResultFeedback() {
  if (state.isImportConfirmationOpen) {
    closeImportConfirmation({ restoreFocus: false });
  }

  if (state.isActiveConflictOpen) {
    closeActiveConflictPanel({ restoreFocus: false });
  }
}

function reportImportFailure(errorLike, payload, settings = {}) {
  const feedback = buildImportErrorPresentation(errorLike, payload, settings);

  if (!errorLike?.alreadyLogged && !errorLike?.__alreadyLogged) {
    void appendExtensionLog({
      source: "importacao",
      level: "error",
      message: feedback.message,
      details: feedback.details,
    });
  }

  dismissImportModalsBeforeResultFeedback();
  state.pendingImportErrorFeedback = {
    message: feedback.message,
    details: feedback.details,
    tone: feedback.tone,
  };
  showImportErrorOverlay(feedback.overlayMessage);
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

function buildOrderOptionLabel(payload) {
  const snapshot = buildDerivedSnapshot(payload);
  const primaryId =
    snapshot.orderNumber || normalizeText(payload?.externalOrderId) || "OP";
  const code = snapshot.productCode || "Código não informado";
  const variations = snapshot.variations || snapshot.productErp;

  return [primaryId, code, variations].filter(Boolean).join(" | ");
}

function getFilteredOrderOptions() {
  const normalizedSearch = normalizeText(state.orderSearchTerm).toLocaleLowerCase(
    "pt-BR",
  );

  if (!normalizedSearch) {
    return state.currentPayloadOptions;
  }

  return state.currentPayloadOptions.filter((payload) => {
    return buildOrderOptionLabel(payload)
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedSearch);
  });
}

function buildOrderPickerOption(payload, { selectedKey, selectedPayloadKeySet }) {
  const option = document.createElement("button");
  const optionKey = buildPayloadSelectionKey(payload);
  const isPreviewed = optionKey === selectedKey;
  const isSelected = selectedPayloadKeySet.has(optionKey);

  option.type = "button";
  option.className = "order-picker__option";
  option.setAttribute("role", "option");
  option.dataset.selectionKey = optionKey;
  option.setAttribute("aria-selected", String(isSelected));
  option.textContent = buildOrderOptionLabel(payload);

  if (isSelected || isPreviewed) {
    option.classList.add("order-picker__option--selected");
  }

  option.addEventListener("click", () => {
    toggleOrderSelectionByKey(optionKey, {
      keepPickerOpen: true,
    });
  });

  return option;
}

function renderOrderOptions(payloadOptions, selectedPayload, options = {}) {
  const { preserveOpen = false, preserveSearch = false, autoSelect = true } =
    options;

  state.currentPayloadOptions = Array.isArray(payloadOptions)
    ? payloadOptions
    : [];

  if (!preserveSearch) {
    state.orderSearchTerm = "";
    orderSelectorSearch.value = "";
  }

  if (!preserveOpen) {
    setOrderPickerOpen(false);
  }

  if (state.currentPayloadOptions.length <= 1) {
    const onlyPayload = state.currentPayloadOptions[0] ?? null;
    const onlySelectionKey = onlyPayload
      ? buildPayloadSelectionKey(onlyPayload)
      : "";
    const previewPayload =
      selectedPayload ?? (autoSelect ? onlyPayload : getSelectedPayloads()[0] ?? null);

    if (autoSelect && onlySelectionKey) {
      setSelectedPayloadKeys([onlySelectionKey]);
      ensureCurrentPayload(onlySelectionKey);
    }

    orderSelectorSection.hidden = !onlyPayload;
    orderSelectorCount.textContent = onlyPayload ? "1 OP" : "0 OPs";
    orderSelectorTrigger.textContent =
      buildOrderOptionLabel(previewPayload) || "Selecionar ordem";
    orderSelectorTrigger.disabled = !onlyPayload;

    if (onlyPayload) {
      const selectedKey = buildPayloadSelectionKey(previewPayload);
      const selectedPayloadKeySet = new Set(state.selectedPayloadKeys);
      orderSelectorList.replaceChildren(
        buildOrderPickerOption(onlyPayload, {
          selectedKey,
          selectedPayloadKeySet,
        }),
      );
    } else {
      orderSelectorList.replaceChildren();
    }

    orderSelectorEmpty.hidden = true;
    renderSelectedOrders();
    return;
  }

  const selectedKey = buildPayloadSelectionKey(selectedPayload);
  const selectedPayloadKeySet = new Set(state.selectedPayloadKeys);
  const filteredPayloadOptions = getFilteredOrderOptions();
  const optionNodes = filteredPayloadOptions.map((payload) =>
    buildOrderPickerOption(payload, {
      selectedKey,
      selectedPayloadKeySet,
    }),
  );

  orderSelectorList.replaceChildren(...optionNodes);
  orderSelectorEmpty.hidden = optionNodes.length > 0;
  orderSelectorTrigger.textContent =
    buildOrderOptionLabel(selectedPayload) || "Selecionar ordem";
  orderSelectorCount.textContent = `${state.currentPayloadOptions.length} OPs`;
  orderSelectorTrigger.disabled = false;
  orderSelectorSection.hidden = false;
  renderSelectedOrders();
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
  hideImportResultAnimations();
  resetImportButtonState();
  setImportConfirmationOpen(false, { restoreFocus: false });
  state.currentPayloadOptions = [];
  state.selectedPayloadKeys = [];
  state.pendingBatchSummary = null;
  state.currentPayload = null;
  state.orderSearchTerm = "";
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
  orderSelectorSearch.value = "";
  orderSelectorEmpty.hidden = true;
  if (selectedOrdersList) {
    selectedOrdersList.replaceChildren();
  }
  if (selectedOrdersCount) {
    selectedOrdersCount.textContent = "0 selecionadas";
  }
  if (selectedOrdersSection) {
    selectedOrdersSection.hidden = true;
  }
  setOrderPickerOpen(false);
  setMappingState("neutral", "Aguardando leitura da página");
  updateImportActionState();
}

function loadMockPreview() {
  state.currentPayloadOptions = structuredClone(MOCK_PREVIEW_OPTIONS);
  state.currentPayload = state.currentPayloadOptions[0];
  setSelectedPayloadKeys([
    buildPayloadSelectionKey(state.currentPayloadOptions[0]),
  ]);
  syncDateFilters({
    issueDateFrom: "2026-06-01",
    issueDateTo: "2026-06-30",
  });
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload);
  renderSelectedOrders();
  renderCapturedData(state.currentPayload);
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
      formatDetailLabel(
        "Ordens selecionadas",
        String(getSelectedPayloads().length),
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

function normalizeImportConflictResponse(importResponse, payload) {
  if (importResponse?.conflict) {
    return importResponse;
  }

  const message = normalizeText(importResponse?.message);
  const existingProductionOrderId = normalizeText(
    importResponse?.existingProductionOrderId ??
      importResponse?.productionOrder?.id ??
      "",
  );
  const isActiveOpConflict =
    importResponse?.statusCode === 409 ||
    /ativa para esta OP|already exists for this ERP|já foi importada do ERP Flex/i.test(
      message,
    );

  if (!isActiveOpConflict) {
    return importResponse;
  }

  return {
    ...importResponse,
    conflict: true,
    result: "duplicate",
    existingProductionOrderId,
    externalOrderId:
      normalizeText(importResponse?.externalOrderId) ||
      normalizeText(payload?.externalOrderId),
    message:
      message ||
      "Já existe uma ordem de produção ativa para esta OP do ERP.",
  };
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

  if (state.isActiveConflictOpen || state.isImportConfirmationOpen) {
    return response.settings;
  }

  const lastImportFeedback = buildLastImportFeedback(response.settings);

  if (lastImportFeedback) {
    renderFeedback(
      lastImportFeedback.message,
      lastImportFeedback.details,
      lastImportFeedback.tone,
    );
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
    const details = buildAnalysisDiagnosticDetails(response);

    if (response?.extractionMeta?.activeFilters) {
      syncDateFilters(response.extractionMeta.activeFilters);
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
  state.currentPayload = response.payload ?? payloadOptions[0] ?? null;
  state.pendingBatchSummary = null;
  if (payloadOptions.length <= 1 && state.currentPayload) {
    setSelectedPayloadKeys([buildPayloadSelectionKey(state.currentPayload)]);
  } else {
    setSelectedPayloadKeys([]);
  }
  syncDateFilters(response?.extractionMeta?.activeFilters);
  renderOrderOptions(payloadOptions, state.currentPayload);
  renderSelectedOrders();
  renderCapturedData(state.currentPayload);
  const details = buildAnalysisDiagnosticDetails(response);

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

function buildLastImportFeedback(settings) {
  const summary = normalizeText(settings?.lastImportSummary);

  if (!summary) {
    return null;
  }

  if (summary.startsWith("Importada:")) {
    return {
      message: summary,
      details: [],
      tone: "success",
    };
  }

  if (summary.startsWith("Atualizada:")) {
    return {
      message: summary,
      details: [],
      tone: "success",
    };
  }

  return {
    message: summary,
    details: [],
    tone: "neutral",
  };
}

function buildImportFeedback(result) {
  if (result.result === "updated") {
    return {
      message: `OP ${result.productionOrder?.orderNumber ?? ""} atualizada no kanban com sucesso.`,
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
          "Status atual",
          result.productionOrder?.status ?? "Não informado",
        ),
      ],
      tone: "success",
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
  const selectedPayloads = getSelectedPayloads();

  if (!state.currentPayload || selectedPayloads.length === 0) {
    void appendExtensionLog({
      source: "importacao",
      level: "warning",
      message:
        "Tentativa de abrir a confirmação de importação sem OPs selecionadas.",
    });
    renderFeedback(
      "Selecione ao menos uma OP encontrada antes de criar no kanban.",
      [],
      "error",
    );
    return;
  }

  resetImportButtonState();
  state.lastFocusedElementBeforeConfirmation = document.activeElement;
  renderImportConfirmation();
  setImportConfirmationOpen(true, { restoreFocus: false });
  void appendExtensionLog({
    source: "importacao",
    level: "info",
    message: "Confirmação final de importação aberta na popup.",
    details: [
      formatDetailLabel("OPs selecionadas", String(selectedPayloads.length)),
    ],
  });
  renderFeedback(
    selectedPayloads.length > 1
      ? `Confirme o envio das ${selectedPayloads.length} OPs selecionadas para o sistema destino.`
      : "Confirme os dados da OP selecionada antes de enviar para o sistema destino.",
  );
}

function closeImportConfirmation(options) {
  setImportConfirmationOpen(false, options);
}

function buildBatchFeedback(summary) {
  const details = [
    formatDetailLabel("Selecionadas", String(summary.totalSelected || 0)),
    formatDetailLabel("Criadas", String(summary.created.length)),
    formatDetailLabel("Atualizadas", String(summary.updated.length)),
    formatDetailLabel("Ignoradas", String(summary.skipped.length)),
  ];

  if (
    summary.created.length === 0 &&
    summary.updated.length === 0 &&
    summary.skipped.length === 0
  ) {
    return {
      message: "Nenhuma OP foi enviada ao kanban.",
      details,
      tone: "neutral",
    };
  }

  if (summary.skipped.length > 0) {
    return {
      message: `Envio concluído: ${summary.created.length} criada(s), ${summary.updated.length} atualizada(s) e ${summary.skipped.length} ignorada(s).`,
      details,
      tone: "success",
    };
  }

  return {
    message: `Envio concluído: ${summary.created.length} criada(s) e ${summary.updated.length} atualizada(s).`,
    details,
    tone: "success",
  };
}

async function processImportBatch(payloads, settings) {
  const created = [];
  const updated = [];
  const conflicts = [];

  for (const payload of payloads) {
    const importResponse = normalizeImportConflictResponse(
      await importPayloadWithSettings(settings, payload),
      payload,
    );

    if (importResponse?.conflict) {
      conflicts.push({
        payload,
        existingProductionOrderId: importResponse.existingProductionOrderId,
        externalOrderId: importResponse.externalOrderId,
        message: importResponse.message,
        selectionKey: buildPayloadSelectionKey(payload),
      });
      continue;
    }

    if (!importResponse?.ok) {
      throw importResponse;
    }

    if (importResponse.result === "updated") {
      updated.push(importResponse);
      continue;
    }

    created.push(importResponse);
  }

  return { created, updated, conflicts };
}

async function processActiveConflictUpdates(conflicts, settings) {
  const updated = [];

  for (const conflict of conflicts) {
    const importResponse = await importPayloadWithSettings(
      settings,
      conflict.payload,
      {
        existingProductionOrderId: conflict.existingProductionOrderId,
      },
    );

    if (!importResponse?.ok) {
      throw importResponse;
    }

    updated.push(importResponse);
  }

  return updated;
}

function finalizeBatchImport(summary) {
  state.pendingBatchSummary = summary;

  if (summary.created.length > 0 || summary.updated.length > 0) {
    showImportSuccessAnimation(buildImportSuccessAnimationMessage(summary));
    return;
  }

  state.importButtonMode = "idle";
  updateImportActionState();
  const feedback = buildBatchFeedback(summary);
  renderFeedback(feedback.message, feedback.details, feedback.tone);
}

async function importPayloadWithSettings(settings, payload, options = {}) {
  const payloadForImport =
    options.existingProductionOrderId &&
    typeof payload === "object" &&
    payload
      ? {
          ...payload,
          existingProductionOrderId: options.existingProductionOrderId,
        }
      : payload;

  return sendRuntimeMessage({
    type: "ERP_FLEX_IMPORT_ORDER",
    apiBaseUrl: settings.apiBaseUrl,
    userEmail: settings.userEmail,
    userPassword: "",
    accessToken: settings.accessToken,
    payload: payloadForImport,
  });
}

async function handleImportConfirmation() {
  const selectedPayloads = getSelectedPayloads();

  if (selectedPayloads.length === 0 || state.isSubmittingImport) {
    return;
  }

  state.importButtonMode = "loading";
  setBusy(true, { importBusy: true });
  renderFeedback(
    selectedPayloads.length > 1
      ? `Enviando ${selectedPayloads.length} OPs selecionadas para o sistema destino...`
      : "Enviando a OP confirmada para o sistema destino...",
  );

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

    const batchResult = await processImportBatch(selectedPayloads, settings);
    closeImportConfirmation({ restoreFocus: false });

    if (batchResult.conflicts.length > 0) {
      state.pendingBatchSummary = {
        totalSelected: selectedPayloads.length,
        created: batchResult.created,
        updated: batchResult.updated,
        skipped: [],
      };
      state.importButtonMode = "idle";
      openActiveConflictPanel(batchResult.conflicts);
      return;
    }

    finalizeBatchImport({
      totalSelected: selectedPayloads.length,
      created: batchResult.created,
      updated: batchResult.updated,
      skipped: [],
    });
    await loadSettings();
  } catch (error) {
    const settingsFallback =
      error && typeof error === "object" && "apiBaseUrl" in error
        ? error
        : await saveBaseSettings().catch(() => ({
            apiBaseUrl: "",
            userEmail: "",
          }));
    state.importButtonMode = "idle";
    reportImportFailure(error, selectedPayloads[0], settingsFallback);
  } finally {
    setBusy(false, { importBusy: false });
  }
}

async function handleActiveConflictConfirmation() {
  if (state.isSubmittingImport || state.pendingActiveConflicts.length === 0) {
    return;
  }

  const isSingle = state.pendingActiveConflicts.length === 1;
  const conflictsToUpdate = isSingle
    ? state.pendingActiveConflicts
    : state.pendingActiveConflicts.filter((conflict) => conflict.selectedForUpdate);

  if (!isSingle && conflictsToUpdate.length === 0) {
    return;
  }

  const skippedConflicts = isSingle
    ? []
    : state.pendingActiveConflicts.filter(
        (conflict) => !conflict.selectedForUpdate,
      );

  state.importButtonMode = "loading";
  setBusy(true, { importBusy: true });
  renderFeedback(
    conflictsToUpdate.length > 1
      ? `Atualizando ${conflictsToUpdate.length} OPs ativas selecionadas...`
      : "Atualizando a OP ativa selecionada...",
  );

  try {
    const settings = await saveBaseSettings();
    const updated = await processActiveConflictUpdates(
      conflictsToUpdate,
      settings,
    );
    const summary = {
      totalSelected: state.pendingBatchSummary?.totalSelected ?? 0,
      created: state.pendingBatchSummary?.created ?? [],
      updated: [...(state.pendingBatchSummary?.updated ?? []), ...updated],
      skipped: skippedConflicts,
    };

    closeActiveConflictPanel({ restoreFocus: false });
    state.pendingBatchSummary = summary;
    await loadSettings();

    void appendExtensionLog({
      source: "importacao",
      level: "success",
      message:
        updated.length > 1
          ? `${updated.length} OPs ativas atualizadas no kanban.`
          : "OP ativa atualizada no kanban.",
      details: [
        formatDetailLabel("Atualizadas", String(updated.length)),
        formatDetailLabel("Ignoradas", String(skippedConflicts.length)),
      ],
    });

    showImportSuccessAnimation(
      buildImportSuccessAnimationMessage({ created: [], updated }),
    );
  } catch (error) {
    const settingsFallback =
      error && typeof error === "object" && "apiBaseUrl" in error
        ? error
        : await saveBaseSettings().catch(() => ({
            apiBaseUrl: "",
            userEmail: "",
          }));
    state.importButtonMode = "idle";
    reportImportFailure(
      error,
      conflictsToUpdate[0]?.payload ?? state.pendingActiveConflicts[0]?.payload,
      settingsFallback,
    );
  } finally {
    setBusy(false, { importBusy: false });
  }
}

function handleDismissActiveConflict() {
  if (state.isSubmittingImport) {
    return;
  }

  const summary = {
    totalSelected: state.pendingBatchSummary?.totalSelected ?? 0,
    created: state.pendingBatchSummary?.created ?? [],
    updated: state.pendingBatchSummary?.updated ?? [],
    skipped: [...state.pendingActiveConflicts],
  };

  closeActiveConflictPanel({ restoreFocus: false });
  finalizeBatchImport(summary);
  void loadSettings();
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

function toggleOrderSelectionByKey(selectionKey, options = {}) {
  const { nextSelected, keepPickerOpen = false } = options;
  const payload = findPayloadBySelectionKey(selectionKey);

  if (!payload) {
    return false;
  }

  const currentlySelected = state.selectedPayloadKeys.includes(selectionKey);
  const shouldSelect =
    typeof nextSelected === "boolean" ? nextSelected : !currentlySelected;

  if (shouldSelect) {
    setSelectedPayloadKeys([...state.selectedPayloadKeys, selectionKey]);
  } else {
    setSelectedPayloadKeys(
      state.selectedPayloadKeys.filter((entry) => entry !== selectionKey),
    );
  }

  ensureCurrentPayload(selectionKey);
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload, {
    preserveOpen: keepPickerOpen,
    preserveSearch: keepPickerOpen,
  });
  renderCapturedData(state.currentPayload);
  renderImportConfirmation();

  const snapshot = buildDerivedSnapshot(payload);
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
  details.push(
    formatDetailLabel("Ordens selecionadas", String(getSelectedPayloads().length)),
  );

  renderFeedback(
    shouldSelect
      ? "OP adicionada à seleção. Revise os dados e siga para a criação no kanban."
      : "OP removida da seleção.",
    details,
    "success",
  );
  void appendExtensionLog({
    source: "popup",
    level: "info",
    message: shouldSelect
      ? "OP adicionada manualmente à seleção da popup."
      : "OP removida manualmente da seleção da popup.",
    details,
  });
  setBusy(false);
  if (!keepPickerOpen) {
    setOrderPickerOpen(false);
  }

  return true;
}

function selectOrderPayloadByKey(selectionKey, options = {}) {
  const { toggleSelection = true, keepPickerOpen = false } = options;
  const payload = findPayloadBySelectionKey(selectionKey);

  if (!payload) {
    return false;
  }

  ensureCurrentPayload(selectionKey);
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload, {
    preserveOpen: keepPickerOpen,
    preserveSearch: keepPickerOpen,
  });
  renderCapturedData(state.currentPayload);
  renderImportConfirmation();

  if (toggleSelection) {
    return toggleOrderSelectionByKey(selectionKey, {
      nextSelected: true,
      keepPickerOpen,
    });
  }

  return true;
}

orderSelectorSearch?.addEventListener("input", () => {
  state.orderSearchTerm = normalizeText(orderSelectorSearch.value);
  renderOrderOptions(state.currentPayloadOptions, state.currentPayload, {
    preserveOpen: true,
    preserveSearch: true,
  });
});

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

bindClick(confirmActiveUpdateButton, () => {
  void handleActiveConflictConfirmation();
});

bindClick(cancelActiveConflictButton, () => {
  handleDismissActiveConflict();
});

bindClick(dismissActiveConflictButton, () => {
  handleDismissActiveConflict();
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
  navigateToLogsPage("menu-lateral");
});

bindClick(importErrorLogsButton, () => {
  navigateToLogsPage("erro-importacao");
});

bindClick(importErrorDismissButton, dismissImportErrorOverlay);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !importErrorOverlay?.hidden) {
    event.preventDefault();
    dismissImportErrorOverlay();
    return;
  }

  if (event.key === "Escape" && state.isActiveConflictOpen) {
    event.preventDefault();
    handleDismissActiveConflict();
    return;
  }

  if (event.key === "Escape" && state.isImportConfirmationOpen) {
    event.preventDefault();
    closeImportConfirmation();
  }
});

void bootstrapPopup();
