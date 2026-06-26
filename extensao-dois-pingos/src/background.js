const EXTENSION_STORAGE_KEY = "erpFlexImporterSettings";
const EXTENSION_LOG_STORAGE_KEY = "erpFlexImporterLogs";
const MAX_EXTENSION_LOGS = 100;

function createExtensionError(message, options = {}) {
  const error = new Error(message);

  error.statusCode = options.statusCode ?? null;
  error.code = options.code ?? null;
  error.details = Array.isArray(options.details) ? options.details : [];

  return error;
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function translateKnownApiText(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return "";
  }

  if (/^Request payload is invalid\.$/i.test(normalized)) {
    return "Os dados enviados pela extensão foram rejeitados pela API.";
  }

  if (/^Production order already imported from ERP Flex\.$/i.test(normalized)) {
    return "A ordem de produção já foi importada do ERP Flex.";
  }

  if (
    /^An active production order already exists for this ERP order\.$/i.test(
      normalized,
    )
  ) {
    return "Já existe uma ordem de produção ativa para esta OP do ERP.";
  }

  if (
    /^A production order with this order number already exists\.$/i.test(
      normalized,
    )
  ) {
    return "Já existe uma ordem de produção com esse número.";
  }

  if (/^Authentication required\.?$/i.test(normalized)) {
    return "Autenticação obrigatória.";
  }

  if (/^Invalid credentials\.?$/i.test(normalized)) {
    return "Credenciais inválidas.";
  }

  if (/^Production order not found\.?$/i.test(normalized)) {
    return "Ordem de produção não encontrada.";
  }

  if (
    /^No registered variation was found for the provided product code\.$/i.test(
      normalized,
    )
  ) {
    return "Nenhuma variação cadastrada foi encontrada para o código de produto informado.";
  }

  return normalized;
}

function translateValidationFragment(text) {
  return normalizeText(text)
    .replace(
      /must be shorter than or equal to (\d+) characters?/gi,
      "deve ter no máximo $1 caracteres",
    )
    .replace(
      /must be longer than or equal to (\d+) characters?/gi,
      "deve ter no mínimo $1 caracteres",
    )
    .replace(/must be a string/gi, "deve ser um texto")
    .replace(/must be a number/gi, "deve ser um número")
    .replace(/must be a valid URL address/gi, "deve ser uma URL válida")
    .replace(/must be a UUID/gi, "deve ser um UUID válido")
    .replace(/must be a date string/gi, "deve ser uma data válida")
    .replace(/must be an object/gi, "deve ser um objeto")
    .replace(/must not be less than ([\d.]+)/gi, "não pode ser menor que $1")
    .replace(
      /must be a number conforming to the specified constraints/gi,
      "deve ser um número válido dentro das regras esperadas",
    )
    .replace(/should not exist/gi, "não deve ser enviado");
}

function translateKnownApiDetail(detail) {
  const normalized = normalizeText(detail);

  if (!normalized) {
    return "";
  }

  const [field, ...rest] = normalized.split(":");
  if (rest.length === 0) {
    return translateValidationFragment(translateKnownApiText(normalized));
  }

  const translatedTail = translateValidationFragment(
    translateKnownApiText(rest.join(":")),
  );

  return translatedTail ? `${field.trim()}: ${translatedTail}` : normalized;
}

function localizeLogMessage(message) {
  return translateValidationFragment(translateKnownApiText(message));
}

function hasVariationLookupFailure(message, details = []) {
  const haystack = [message, ...details].map((entry) => normalizeText(entry));

  return haystack.some((entry) => {
    return /no registered variation was found for the provided product code/i.test(
      entry,
    );
  });
}

function hasNonWhitelistedPropertyError(details = []) {
  return details.some((entry) => {
    return /should not exist|property .* should not exist/i.test(
      normalizeText(entry),
    );
  });
}

function buildFriendlyImportMessage(message, details = []) {
  if (hasVariationLookupFailure(message, details)) {
    return "A API não encontrou uma variação cadastrada compatível com o código do produto enviado.";
  }

  return translateKnownApiText(message);
}

function isActiveProductionOrderConflictMessage(message) {
  const normalized = normalizeText(message);

  return (
    /active production order already exists/i.test(normalized) ||
    /already imported from erp flex/i.test(normalized) ||
    /já existe uma ordem de produção ativa/i.test(normalized) ||
    /ordem de produção já foi importada do erp flex/i.test(normalized)
  );
}

function extractExistingProductionOrderId(data) {
  if (!data || typeof data !== "object") {
    return "";
  }

  return normalizeText(
    data.existingProductionOrderId ?? data.productionOrder?.id ?? "",
  );
}

function extractExternalOrderId(data, payload) {
  if (!data || typeof data !== "object") {
    return normalizeText(payload?.externalOrderId);
  }

  return normalizeText(data.externalOrderId ?? payload?.externalOrderId);
}

function resolveActiveImportConflict({ response, data, payload }) {
  if (response.status !== 409) {
    return null;
  }

  const message = normalizeText(
    data?.message ?? (typeof data === "string" ? data : ""),
  );
  const existingProductionOrderId = extractExistingProductionOrderId(data);
  const externalOrderId = extractExternalOrderId(data, payload);
  const isDuplicateResult = data?.result === "duplicate";
  const hasActiveOpMessage = isActiveProductionOrderConflictMessage(message);

  if (!isDuplicateResult && !existingProductionOrderId && !hasActiveOpMessage) {
    return null;
  }

  return {
    ok: false,
    conflict: true,
    result: "duplicate",
    statusCode: response.status,
    code: data?.code ?? "ACTIVE_PRODUCTION_ORDER_EXISTS",
    message: buildFriendlyImportMessage(
      message ||
        "Já existe uma ordem de produção ativa para esta OP do ERP.",
      normalizeErrorDetails(data?.details),
    ),
    existingProductionOrderId,
    externalOrderId,
    productionOrder: data?.productionOrder ?? null,
  };
}

function normalizeErrorDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details
    .map((entry) => {
      if (typeof entry === "string") {
        return translateKnownApiDetail(entry);
      }

      if (!entry || typeof entry !== "object") {
        return "";
      }

      const field = String(entry.field ?? entry.path ?? "").trim();
      const message = String(entry.message ?? entry.error ?? "").trim();

      if (field && message) {
        return translateKnownApiDetail(`${field}: ${message}`);
      }

      return translateKnownApiDetail(field || message);
    })
    .filter(Boolean);
}

function getStorageArea() {
  return chrome.storage.local;
}

async function readSettings() {
  const stored = await getStorageArea().get(EXTENSION_STORAGE_KEY);

  return {
    apiBaseUrl: "",
    accessToken: "",
    userEmail: "",
    lastImportSummary: "",
    lastImportResult: "",
    lastImportExternalOrderId: "",
    lastImportExistingProductionOrderId: "",
    lastImportOrderNumber: "",
    ...stored[EXTENSION_STORAGE_KEY],
  };
}

async function writeSettings(partialSettings) {
  const current = await readSettings();
  const next = { ...current, ...partialSettings };

  await getStorageArea().set({
    [EXTENSION_STORAGE_KEY]: next,
  });

  return next;
}

async function readLogs() {
  const stored = await getStorageArea().get(EXTENSION_LOG_STORAGE_KEY);
  const logs = stored[EXTENSION_LOG_STORAGE_KEY];

  return Array.isArray(logs) ? logs : [];
}

async function writeLogs(logs) {
  const normalizedLogs = Array.isArray(logs)
    ? logs.slice(0, MAX_EXTENSION_LOGS)
    : [];

  await getStorageArea().set({
    [EXTENSION_LOG_STORAGE_KEY]: normalizedLogs,
  });

  return normalizedLogs;
}

function normalizeLogDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details
    .map((entry) => String(entry ?? "").trim())
    .filter(Boolean)
    .slice(0, 10);
}

function buildLogEntry(entry = {}) {
  return {
    createdAt: new Date().toISOString(),
    source: String(entry.source ?? "extensao").trim() || "extensao",
    level:
      String(entry.level ?? "info")
        .trim()
        .toLowerCase() || "info",
    message: localizeLogMessage(
      String(entry.message ?? "Evento sem descrição.").trim(),
    ),
    details: normalizeLogDetails(entry.details).map((detail) =>
      translateKnownApiDetail(detail),
    ),
  };
}

async function appendLog(entry) {
  const currentLogs = await readLogs();
  const nextLogs = [buildLogEntry(entry), ...currentLogs].slice(
    0,
    MAX_EXTENSION_LOGS,
  );

  return writeLogs(nextLogs);
}

async function logExtensionEvent(entry) {
  try {
    await appendLog(entry);
  } catch {
    // Logging deve ser melhor esforco e nunca bloquear o fluxo principal.
  }
}

function normalizeApiBaseUrl(rawValue) {
  const trimmed = String(rawValue ?? "").trim();

  if (!trimmed) {
    throw new Error("Informe a URL base da API do sistema.");
  }

  const parsed = new URL(trimmed);
  const normalizedPath = parsed.pathname.replace(/\/+$/, "");

  if (!normalizedPath || normalizedPath === "") {
    parsed.pathname = "/api";
  } else if (!normalizedPath.endsWith("/api")) {
    parsed.pathname = `${normalizedPath}/api`;
  } else {
    parsed.pathname = normalizedPath;
  }

  parsed.search = "";
  parsed.hash = "";

  return parsed.toString().replace(/\/$/, "");
}

async function readJsonSafely(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildRequestHeaders(accessToken) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

const RAW_PAYLOAD_CANDIDATE_KEYS = [
  "externalOrderId",
  "orderNumber",
  "customerName",
  "productCode",
  "productDescription",
  "variations",
  "complementaryFields",
  "quantity",
  "dueDate",
];

function hasUsableValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function sanitizeRawPayloadForApi(rawPayload) {
  if (!rawPayload || typeof rawPayload !== "object") {
    return undefined;
  }

  const sanitized = {};
  const extractionStrategy = String(rawPayload.extractionStrategy ?? "").trim();

  if (extractionStrategy) {
    sanitized.extractionStrategy = extractionStrategy;
  }

  const candidates = rawPayload.candidates;
  if (candidates && typeof candidates === "object") {
    const sanitizedCandidates = {};

    for (const key of RAW_PAYLOAD_CANDIDATE_KEYS) {
      if (hasUsableValue(candidates[key])) {
        sanitizedCandidates[key] = candidates[key];
      }
    }

    if (Object.keys(sanitizedCandidates).length) {
      sanitized.candidates = sanitizedCandidates;
    }
  }

  return Object.keys(sanitized).length ? sanitized : undefined;
}

function buildImportPayloadForApi(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const candidates =
    payload.rawPayload?.candidates &&
    typeof payload.rawPayload.candidates === "object"
      ? payload.rawPayload.candidates
      : {};

  const apiPayload = {
    externalOrderId: payload.externalOrderId,
    orderNumber: payload.orderNumber,
    item: payload.item,
  };

  if (hasUsableValue(payload.issueDate)) {
    apiPayload.issueDate = payload.issueDate;
  }

  if (hasUsableValue(payload.dueDate)) {
    apiPayload.dueDate = payload.dueDate;
  }

  if (hasUsableValue(candidates.customerName)) {
    apiPayload.customerName = candidates.customerName;
  }

  if (hasUsableValue(candidates.variations)) {
    apiPayload.variations = candidates.variations;
  }

  const complementaryFields =
    candidates.complementaryFields ?? payload.notes ?? undefined;

  if (hasUsableValue(complementaryFields)) {
    apiPayload.complementaryFields = complementaryFields;
  }

  if (hasUsableValue(payload.notes)) {
    apiPayload.notes = payload.notes;
  }

  if (hasUsableValue(payload.sourcePageUrl)) {
    apiPayload.sourcePageUrl = payload.sourcePageUrl;
  }

  if (hasUsableValue(payload.existingProductionOrderId)) {
    apiPayload.existingProductionOrderId = payload.existingProductionOrderId;
  }

  const sanitizedRawPayload = sanitizeRawPayloadForApi(payload.rawPayload);

  if (sanitizedRawPayload) {
    apiPayload.rawPayload = sanitizedRawPayload;
  }

  return apiPayload;
}

function buildCompatibilityImportPayloadForApi(payload) {
  const apiPayload = buildImportPayloadForApi(payload);

  if (!payload || typeof payload !== "object") {
    return apiPayload;
  }

  const candidates =
    payload.rawPayload?.candidates &&
    typeof payload.rawPayload.candidates === "object"
      ? payload.rawPayload.candidates
      : {};

  if (hasUsableValue(candidates.customerName)) {
    apiPayload.customerName = candidates.customerName;
  }

  if (hasUsableValue(candidates.variations)) {
    apiPayload.variations = candidates.variations;
  }

  const complementaryFields =
    candidates.complementaryFields ?? payload.notes ?? undefined;

  if (hasUsableValue(complementaryFields)) {
    apiPayload.complementaryFields = complementaryFields;
  }

  return apiPayload;
}

async function postImportPayload({ apiBaseUrl, accessToken, payload }) {
  const response = await fetch(
    `${apiBaseUrl}/production-orders/imports/erp-flex`,
    {
      method: "POST",
      headers: buildRequestHeaders(accessToken),
      body: JSON.stringify(payload),
    },
  );

  const data = await readJsonSafely(response);

  return {
    response,
    data,
  };
}

function resolveImportResponse({ response, data, payload }) {
  if (response.ok && data?.result === "created") {
    return {
      ok: true,
      result: data.result,
      productionOrder: data.productionOrder ?? null,
    };
  }

  if (response.ok && data?.result === "updated") {
    if (!hasUsableValue(payload?.existingProductionOrderId)) {
      return {
        ok: false,
        conflict: true,
        result: "duplicate",
        statusCode: response.status,
        code: "ACTIVE_PRODUCTION_ORDER_EXISTS",
        message:
          "Esta OP já está ativa no kanban. Confirme se deseja atualizar com os dados capturados.",
        existingProductionOrderId: extractExistingProductionOrderId(data),
        externalOrderId: extractExternalOrderId(data, payload),
        productionOrder: data.productionOrder ?? null,
      };
    }

    return {
      ok: true,
      result: data.result,
      productionOrder: data.productionOrder ?? null,
    };
  }

  const activeConflict = resolveActiveImportConflict({ response, data, payload });

  if (activeConflict) {
    return activeConflict;
  }

  if (response.status === 401) {
    throw createExtensionError(
      "Sua sessão no sistema expirou. Informe a senha novamente para renovar o token.",
      {
        statusCode: response.status,
        code: data?.code ?? "AUTHENTICATION_REQUIRED",
        details: normalizeErrorDetails(data?.details),
      },
    );
  }

  const details = normalizeErrorDetails(data?.details);

  throw createExtensionError(
    buildFriendlyImportMessage(
      data?.message ?? "Falha ao importar a ordem para o backend.",
      details,
    ),
    {
      statusCode: response.status,
      code: data?.code ?? "IMPORT_FAILED",
      details,
    },
  );
}

async function loginWithCredentials({ apiBaseUrl, email, password }) {
  if (!email || !password) {
    throw createExtensionError(
      "Sessão expirada. Informe e-mail e senha do sistema para renovar o token.",
      {
        code: "SESSION_REQUIRES_PASSWORD",
      },
    );
  }

  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const payload = await readJsonSafely(response);

  if (!response.ok || !payload?.accessToken) {
    throw createExtensionError(
      payload?.message ?? "Não foi possível autenticar no backend do sistema.",
      {
        statusCode: response.status,
        code: payload?.code ?? "AUTHENTICATION_FAILED",
        details: normalizeErrorDetails(payload?.details),
      },
    );
  }

  return payload.accessToken;
}

async function importProductionOrder({ apiBaseUrl, accessToken, payload }) {
  const primaryAttempt = await postImportPayload({
    apiBaseUrl,
    accessToken,
    payload,
  });
  const primaryDetails = normalizeErrorDetails(primaryAttempt.data?.details);
  const compatibilityPayload = buildCompatibilityImportPayloadForApi(payload);
  const primaryPayloadSnapshot = JSON.stringify(payload);
  const compatibilityPayloadSnapshot = JSON.stringify(compatibilityPayload);
  const shouldRetryWithCompatibilityPayload =
    primaryAttempt.response.status === 400 &&
    hasVariationLookupFailure(primaryAttempt.data?.message, primaryDetails) &&
    compatibilityPayloadSnapshot !== primaryPayloadSnapshot;

  if (shouldRetryWithCompatibilityPayload) {
    const compatibilityAttempt = await postImportPayload({
      apiBaseUrl,
      accessToken,
      payload: compatibilityPayload,
    });
    const compatibilityDetails = normalizeErrorDetails(
      compatibilityAttempt.data?.details,
    );

    if (
      compatibilityAttempt.response.ok ||
      compatibilityAttempt.response.status === 401
    ) {
      return resolveImportResponse({
        response: compatibilityAttempt.response,
        data: compatibilityAttempt.data,
        payload: compatibilityPayload,
      });
    }

    if (hasNonWhitelistedPropertyError(compatibilityDetails)) {
      return resolveImportResponse({
        response: primaryAttempt.response,
        data: primaryAttempt.data,
        payload,
      });
    }

    return resolveImportResponse({
      response: compatibilityAttempt.response,
      data: compatibilityAttempt.data,
      payload: compatibilityPayload,
    });
  }

  return resolveImportResponse({
    response: primaryAttempt.response,
    data: primaryAttempt.data,
    payload,
  });
}

async function handleGetSettings(sendResponse) {
  const settings = await readSettings();

  sendResponse({
    ok: true,
    settings,
  });
}

async function handleGetLogs(sendResponse) {
  const logs = await readLogs();

  sendResponse({
    ok: true,
    logs,
  });
}

async function handleAppendLog(message, sendResponse) {
  const logs = await appendLog(message.entry);

  sendResponse({
    ok: true,
    logs,
  });
}

async function handleClearLogs(sendResponse) {
  const logs = await writeLogs([]);

  sendResponse({
    ok: true,
    logs,
  });
}

async function handleSaveSettings(message, sendResponse) {
  const next = await writeSettings({
    apiBaseUrl: normalizeApiBaseUrl(message.apiBaseUrl),
    userEmail: String(message.userEmail ?? "")
      .trim()
      .toLowerCase(),
  });

  await logExtensionEvent({
    source: "configuracao",
    level: "success",
    message: "Configuração base da extensão salva.",
    details: [
      `API: ${next.apiBaseUrl || "Não informada"}`,
      `E-mail: ${next.userEmail || "Não informado"}`,
    ],
  });

  sendResponse({
    ok: true,
    settings: next,
  });
}

async function handleClearSession(sendResponse) {
  const next = await writeSettings({
    accessToken: "",
    lastImportSummary: "",
  });

  await logExtensionEvent({
    source: "sessao",
    level: "warning",
    message: "Sessão local da extensão foi limpa.",
  });

  sendResponse({
    ok: true,
    settings: next,
  });
}

async function handleAuthenticate(message, sendResponse) {
  const apiBaseUrl = normalizeApiBaseUrl(message.apiBaseUrl);
  const email = String(message.userEmail ?? "")
    .trim()
    .toLowerCase();
  const password = String(message.userPassword ?? "").trim();
  const accessToken = await loginWithCredentials({
    apiBaseUrl,
    email,
    password,
  });
  const next = await writeSettings({
    apiBaseUrl,
    userEmail: email,
    accessToken,
  });

  await logExtensionEvent({
    source: "autenticacao",
    level: "success",
    message: "Sessão autenticada ou renovada com sucesso.",
    details: [`API: ${apiBaseUrl}`, `E-mail: ${email || "Não informado"}`],
  });

  sendResponse({
    ok: true,
    settings: next,
  });
}

async function handleImport(message, sendResponse) {
  const currentSettings = await readSettings();
  const apiBaseUrl = normalizeApiBaseUrl(
    message.apiBaseUrl ?? currentSettings.apiBaseUrl,
  );
  const email = String(message.userEmail ?? currentSettings.userEmail ?? "")
    .trim()
    .toLowerCase();
  const password = String(message.userPassword ?? "").trim();

  let accessToken = String(
    message.accessToken ?? currentSettings.accessToken ?? "",
  ).trim();

  if (!accessToken || password) {
    accessToken = await loginWithCredentials({
      apiBaseUrl,
      email,
      password,
    });

    await writeSettings({
      apiBaseUrl,
      userEmail: email,
      accessToken,
    });
  }

  try {
    const result = await importProductionOrder({
      apiBaseUrl,
      accessToken,
      payload: buildImportPayloadForApi(message.payload),
    });

    if (result.conflict) {
      sendResponse({
        ok: false,
        conflict: true,
        result: result.result,
        statusCode: result.statusCode,
        code: result.code,
        message: result.message,
        existingProductionOrderId: result.existingProductionOrderId,
        externalOrderId: result.externalOrderId,
        productionOrder: result.productionOrder,
      });
      return;
    }

    const summary =
      result.result === "created"
        ? `Importada: ${result.productionOrder?.orderNumber ?? message.payload.orderNumber} (${result.productionOrder?.source?.externalOrderId ?? message.payload.externalOrderId})`
        : `Atualizada: ${result.productionOrder?.orderNumber ?? message.payload.orderNumber} (${result.productionOrder?.source?.externalOrderId ?? message.payload.externalOrderId})`;

    await writeSettings({
      apiBaseUrl,
      userEmail: email,
      accessToken,
      lastImportSummary: summary,
      lastImportResult: result.result,
      lastImportExternalOrderId:
        result.productionOrder?.source?.externalOrderId ??
        message.payload.externalOrderId ??
        "",
      lastImportExistingProductionOrderId:
        result.result === "updated"
          ? (result.productionOrder?.id ??
            message.payload.existingProductionOrderId ??
            "")
          : "",
      lastImportOrderNumber:
        result.result === "created" || result.result === "updated"
          ? (result.productionOrder?.orderNumber ??
            message.payload.orderNumber ??
            "")
          : (message.payload.orderNumber ?? ""),
    });

    await logExtensionEvent({
      source: "importacao",
      level: "success",
      message:
        result.result === "created"
          ? "OP importada com sucesso para o sistema destino."
          : "OP atualizada com sucesso no sistema destino.",
      details: [
        `Ordem: ${message.payload?.orderNumber ?? "Não informada"}`,
        `Id externo ERP: ${message.payload?.externalOrderId ?? "Não informado"}`,
      ],
    });

    sendResponse(result);
  } catch (error) {
    const messageText =
      error instanceof Error
        ? error.message
        : "Falha técnica durante a importação.";

    if (/sessao expirada|renovar o token/i.test(messageText)) {
      await writeSettings({
        accessToken: "",
      });
    }

    await logExtensionEvent({
      source: "importacao",
      level: "error",
      message: messageText,
      details: Array.isArray(error?.details) ? error.details : [],
    });
    if (error && typeof error === "object") {
      error.__alreadyLogged = true;
    }

    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "ERP_FLEX_GET_SETTINGS":
        await handleGetSettings(sendResponse);
        return;
      case "ERP_FLEX_GET_LOGS":
        await handleGetLogs(sendResponse);
        return;
      case "ERP_FLEX_APPEND_LOG":
        await handleAppendLog(message, sendResponse);
        return;
      case "ERP_FLEX_CLEAR_LOGS":
        await handleClearLogs(sendResponse);
        return;
      case "ERP_FLEX_SAVE_SETTINGS":
        await handleSaveSettings(message, sendResponse);
        return;
      case "ERP_FLEX_CLEAR_SESSION":
        await handleClearSession(sendResponse);
        return;
      case "ERP_FLEX_AUTHENTICATE":
        await handleAuthenticate(message, sendResponse);
        return;
      case "ERP_FLEX_IMPORT_ORDER":
        await handleImport(message, sendResponse);
        return;
      default:
        sendResponse({
          ok: false,
          message: "Tipo de mensagem da extensão não suportado.",
        });
    }
  })().catch((error) => {
    if (!error?.__alreadyLogged) {
      void logExtensionEvent({
        source: "background",
        level: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro inesperado na extensão.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    }

    sendResponse({
      ok: false,
      message:
        error instanceof Error ? error.message : "Erro inesperado na extensão.",
      statusCode: error?.statusCode ?? null,
      code: error?.code ?? null,
      details: Array.isArray(error?.details) ? error.details : [],
      conflict: error?.statusCode === 409 &&
        isActiveProductionOrderConflictMessage(
          error instanceof Error ? error.message : String(error ?? ""),
        ),
      existingProductionOrderId: error?.existingProductionOrderId ?? "",
      externalOrderId: error?.externalOrderId ?? "",
    });
  });

  return true;
});
