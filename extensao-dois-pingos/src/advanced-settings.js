const apiBaseUrlInput = document.getElementById("api-base-url");
const userEmailInput = document.getElementById("user-email");
const userPasswordInput = document.getElementById("user-password");
const sessionSummary = document.getElementById("session-summary");
const statusMessage = document.getElementById("status-message");
const statusDetails = document.getElementById("status-details");
const saveSettingsButton = document.getElementById("save-settings-button");
const authenticateButton = document.getElementById("authenticate-button");
const clearSessionButton = document.getElementById("clear-session-button");
const backToPopupButton = document.getElementById("back-to-popup-button");

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
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

function setBusy(isBusy, primaryLabel = "Salvar configuração") {
  saveSettingsButton.disabled = isBusy;
  authenticateButton.disabled = isBusy;
  clearSessionButton.disabled = isBusy;
  backToPopupButton.disabled = isBusy;
  apiBaseUrlInput.disabled = isBusy;
  userEmailInput.disabled = isBusy;
  userPasswordInput.disabled = isBusy;
  saveSettingsButton.textContent = isBusy
    ? primaryLabel
    : "Salvar configuração";
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

async function bootstrapAdvancedSettings() {
  try {
    await loadSettings();
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

backToPopupButton.addEventListener("click", () => {
  goBackToPopup();
});

void bootstrapAdvancedSettings();
