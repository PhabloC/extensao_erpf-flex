const EXTENSION_STORAGE_KEY = "erpFlexImporterSettings";

function createExtensionError(message, options = {}) {
  const error = new Error(message);

  error.statusCode = options.statusCode ?? null;
  error.code = options.code ?? null;
  error.details = Array.isArray(options.details) ? options.details : [];

  return error;
}

function normalizeErrorDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.trim();
      }

      if (!entry || typeof entry !== "object") {
        return "";
      }

      const field = String(entry.field ?? entry.path ?? "").trim();
      const message = String(entry.message ?? entry.error ?? "").trim();

      if (field && message) {
        return `${field}: ${message}`;
      }

      return field || message;
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

  if (!contentType.includes("application/json")) {
    return null;
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
    payload.rawPayload?.candidates && typeof payload.rawPayload.candidates === "object"
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

  if (hasUsableValue(payload.notes)) {
    apiPayload.notes = payload.notes;
  }

  if (hasUsableValue(payload.sourcePageUrl)) {
    apiPayload.sourcePageUrl = payload.sourcePageUrl;
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

  const sanitizedRawPayload = sanitizeRawPayloadForApi(payload.rawPayload);

  if (sanitizedRawPayload) {
    apiPayload.rawPayload = sanitizedRawPayload;
  }

  return apiPayload;
}

async function loginWithCredentials({ apiBaseUrl, email, password }) {
  if (!email || !password) {
    throw createExtensionError(
      "Sessao expirada. Informe e-mail e senha do sistema para renovar o token.",
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
  const response = await fetch(
    `${apiBaseUrl}/production-orders/imports/erp-flex`,
    {
      method: "POST",
      headers: buildRequestHeaders(accessToken),
      body: JSON.stringify(payload),
    },
  );

  const data = await readJsonSafely(response);

  if (response.ok && data?.result === "created") {
    return {
      ok: true,
      result: "created",
      productionOrder: data.productionOrder ?? null,
    };
  }

  if (response.status === 409 && data?.result === "duplicate") {
    return {
      ok: true,
      result: "duplicate",
      message: data.message ?? "A ordem já foi importada anteriormente.",
      existingProductionOrderId: data.existingProductionOrderId ?? null,
      externalOrderId: data.externalOrderId ?? payload.externalOrderId,
    };
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

  throw createExtensionError(
    data?.message ?? "Falha ao importar a ordem para o backend.",
    {
      statusCode: response.status,
      code: data?.code ?? "IMPORT_FAILED",
      details: normalizeErrorDetails(data?.details),
    },
  );
}

async function handleGetSettings(sendResponse) {
  const settings = await readSettings();

  sendResponse({
    ok: true,
    settings,
  });
}

async function handleSaveSettings(message, sendResponse) {
  const next = await writeSettings({
    apiBaseUrl: normalizeApiBaseUrl(message.apiBaseUrl),
    userEmail: String(message.userEmail ?? "")
      .trim()
      .toLowerCase(),
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

    const summary =
      result.result === "created"
        ? `Importada: ${result.productionOrder?.orderNumber ?? message.payload.orderNumber} (${result.productionOrder?.source?.externalOrderId ?? message.payload.externalOrderId})`
        : `Duplicada: ${result.externalOrderId ?? message.payload.externalOrderId}`;

    await writeSettings({
      apiBaseUrl,
      userEmail: email,
      accessToken,
      lastImportSummary: summary,
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

    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "ERP_FLEX_GET_SETTINGS":
        await handleGetSettings(sendResponse);
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
    sendResponse({
      ok: false,
      message:
        error instanceof Error ? error.message : "Erro inesperado na extensão.",
      statusCode: error?.statusCode ?? null,
      code: error?.code ?? null,
      details: Array.isArray(error?.details) ? error.details : [],
    });
  });

  return true;
});
