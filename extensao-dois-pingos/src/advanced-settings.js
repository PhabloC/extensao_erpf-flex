const apiBaseUrlInput = document.getElementById("api-base-url");
const apiPresetButtons = Array.from(
  document.querySelectorAll("[data-api-base-url]"),
);
const userEmailInput = document.getElementById("user-email");
const userPasswordInput = document.getElementById("user-password");
const togglePasswordVisibilityButton = document.getElementById(
  "toggle-password-visibility-button",
);
const sessionSummary = document.getElementById("session-summary");
const statusMessage = document.getElementById("status-message");
const statusDetails = document.getElementById("status-details");
const saveSettingsButton = document.getElementById("save-settings-button");
const authenticateButton = document.getElementById("authenticate-button");
const clearSessionButton = document.getElementById("clear-session-button");
const backToPopupButton = document.getElementById("back-to-popup-button");
let isPasswordVisible = false;
const DEFAULT_API_PRESETS = [
  {
    id: "production",
    label: "Produção",
    value: "https://api-dois-pingos.fasters.app/api",
  },
  {
    id: "local",
    label: "Local",
    value: "http://localhost:3000",
  },
];

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeApiBaseUrlForComparison(rawValue) {
  const trimmed = String(rawValue ?? "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "");

    if (!normalizedPath) {
      parsed.pathname = "/api";
    } else if (!normalizedPath.endsWith("/api")) {
      parsed.pathname = `${normalizedPath}/api`;
    } else {
      parsed.pathname = normalizedPath;
    }

    parsed.search = "";
    parsed.hash = "";

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
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

function renderSession(settings) {
  if (settings.accessToken) {
    sessionSummary.textContent = `Sessão ativa para ${
      settings.userEmail || "usuário autenticado"
    }.`;
    return;
  }

  sessionSummary.textContent = "Nenhuma sessão autenticada salva.";
}

function syncPasswordVisibility() {
  userPasswordInput.type = isPasswordVisible ? "text" : "password";
  togglePasswordVisibilityButton.setAttribute(
    "aria-label",
    isPasswordVisible ? "Ocultar senha" : "Mostrar senha",
  );
  togglePasswordVisibilityButton.setAttribute(
    "aria-pressed",
    String(isPasswordVisible),
  );
}

function syncApiPresetState() {
  const normalizedCurrent = normalizeApiBaseUrlForComparison(
    apiBaseUrlInput.value,
  );

  apiPresetButtons.forEach((button) => {
    const presetValue = button.dataset.apiBaseUrl ?? "";
    const isActive =
      normalizeApiBaseUrlForComparison(presetValue) === normalizedCurrent;

    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setBusy(isBusy, primaryLabel = "Salvar configuração") {
  saveSettingsButton.disabled = isBusy;
  authenticateButton.disabled = isBusy;
  clearSessionButton.disabled = isBusy;
  backToPopupButton.disabled = isBusy;
  togglePasswordVisibilityButton.disabled = isBusy;
  apiPresetButtons.forEach((button) => {
    button.disabled = isBusy;
  });
  apiBaseUrlInput.disabled = isBusy;
  userEmailInput.disabled = isBusy;
  userPasswordInput.disabled = isBusy;
  saveSettingsButton.textContent = isBusy
    ? primaryLabel
    : "Salvar configuração";
}

function hidePassword() {
  isPasswordVisible = false;
  syncPasswordVisibility();
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

  apiBaseUrlInput.value = response.settings.apiBaseUrl ?? "";
  syncApiPresetState();
  userEmailInput.value = response.settings.userEmail ?? "";
  renderSession(response.settings);

  return response.settings;
}

async function handleSaveSettings() {
  setBusy(true, "Salvando...");
  renderFeedback("Salvando configurações da extensão...");

  try {
    const response = await sendRuntimeMessage({
      type: "ERP_FLEX_SAVE_SETTINGS",
      apiBaseUrl: apiBaseUrlInput.value,
      userEmail: userEmailInput.value,
    });

    if (!response?.ok) {
      throw new Error(
        response?.message ?? "Falha ao salvar configurações da extensão.",
      );
    }

    renderSession(response.settings);
    renderFeedback("Configurações salvas com sucesso.", [], "success");
  } catch (error) {
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao salvar configurações da extensão.",
      [],
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function handleAuthenticate() {
  setBusy(true, "Autenticando...");
  renderFeedback("Renovando sessão no sistema destino...");

  try {
    const response = await sendRuntimeMessage({
      type: "ERP_FLEX_AUTHENTICATE",
      apiBaseUrl: apiBaseUrlInput.value,
      userEmail: userEmailInput.value,
      userPassword: userPasswordInput.value,
    });

    if (!response?.ok) {
      throw new Error(response?.message ?? "Falha ao autenticar na API.");
    }

    userPasswordInput.value = "";
    hidePassword();
    renderSession(response.settings);
    renderFeedback("Sessão renovada com sucesso.", [], "success");
  } catch (error) {
    renderFeedback(
      error instanceof Error ? error.message : "Falha ao autenticar na API.",
      [],
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function handleClearSession() {
  setBusy(true, "Limpando...");
  renderFeedback("Limpando sessão local da extensão...");

  try {
    const response = await sendRuntimeMessage({
      type: "ERP_FLEX_CLEAR_SESSION",
    });

    if (!response?.ok) {
      throw new Error(
        response?.message ?? "Falha ao limpar a sessão da extensão.",
      );
    }

    userPasswordInput.value = "";
    hidePassword();
    renderSession(response.settings);
    renderFeedback(
      "Sessão local removida. Informe a senha novamente para renovar o token.",
      [],
      "success",
    );
  } catch (error) {
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao limpar a sessão da extensão.",
      [],
      "error",
    );
  } finally {
    setBusy(false);
  }
}

function goBackToPopup() {
  window.location.href = "popup.html";
}

function handleTogglePasswordVisibility() {
  isPasswordVisible = !isPasswordVisible;
  syncPasswordVisibility();
}

function applyApiPreset(rawValue) {
  apiBaseUrlInput.value = rawValue;
  syncApiPresetState();
}

async function bootstrapAdvancedSettings() {
  try {
    await loadSettings();
    syncPasswordVisibility();
    syncApiPresetState();
    setBusy(false);
  } catch (error) {
    setBusy(false);
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao iniciar configuração avançada.",
      [],
      "error",
    );
  }
}

saveSettingsButton.addEventListener("click", () => {
  void handleSaveSettings();
});

authenticateButton.addEventListener("click", () => {
  void handleAuthenticate();
});

clearSessionButton.addEventListener("click", () => {
  void handleClearSession();
});

togglePasswordVisibilityButton.addEventListener("click", () => {
  handleTogglePasswordVisibility();
});

apiPresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyApiPreset(button.dataset.apiBaseUrl ?? "");
  });
});

backToPopupButton.addEventListener("click", () => {
  goBackToPopup();
});

DEFAULT_API_PRESETS.forEach((preset) => {
  const button = document.querySelector(
    `[data-api-base-url="${preset.value}"]`,
  );

  if (button) {
    button.textContent = preset.label;
  }
});

void bootstrapAdvancedSettings();
