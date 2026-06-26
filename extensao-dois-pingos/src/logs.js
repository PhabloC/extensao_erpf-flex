const statusMessage = document.getElementById("status-message");
const statusDetails = document.getElementById("status-details");
const logList = document.getElementById("log-list");
const refreshLogsButton = document.getElementById("refresh-logs-button");
const clearLogsButton = document.getElementById("clear-logs-button");
const backToPopupButton = document.getElementById("back-to-popup-button");

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function translateLogText(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return "";
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

  if (/^Request payload is invalid\.$/i.test(normalized)) {
    return "Os dados enviados pela extensão foram rejeitados pela API.";
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

  return normalized
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

function setBusy(isBusy, primaryLabel = "Atualizar logs") {
  refreshLogsButton.disabled = isBusy;
  clearLogsButton.disabled = isBusy;
  backToPopupButton.disabled = isBusy;
  refreshLogsButton.textContent = isBusy ? primaryLabel : "Atualizar logs";
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Horário não informado";
  }

  return date.toLocaleString("pt-BR");
}

function normalizeDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  return details.map((detail) => translateLogText(detail)).filter(Boolean);
}

function isProductionOrderCreationLog(entry) {
  return normalizeText(entry?.source).toLowerCase() === "importacao";
}

function getLogLevel(entry) {
  return normalizeText(entry?.level).toLowerCase() || "info";
}

function formatLogSourceLabel(source) {
  const normalized = normalizeText(source).toLowerCase();

  if (normalized === "importacao") {
    return "Importação";
  }

  return normalizeText(source) || "extensão";
}

function formatLogLevelLabel(level) {
  if (level === "error") {
    return "Erro";
  }

  if (level === "success") {
    return "Sucesso";
  }

  if (level === "warning") {
    return "Alerta";
  }

  return "Info";
}

function buildEmptyState() {
  const item = document.createElement("li");
  item.className = "log-item";

  const message = document.createElement("p");
  message.className = "log-item__message";
  message.textContent =
    "Nenhum log de criação de OP foi salvo ainda neste navegador.";

  item.append(message);
  return item;
}

function buildLogItem(entry) {
  const item = document.createElement("li");
  item.className = "log-item";
  const level = getLogLevel(entry);

  if (level === "error") {
    item.classList.add("log-item--error");
  }

  const meta = document.createElement("div");
  meta.className = "log-item__meta";

  const sourceBadge = document.createElement("span");
  sourceBadge.className = "log-item__badge";
  sourceBadge.textContent = formatLogSourceLabel(entry.source);

  const levelBadge = document.createElement("span");
  levelBadge.className = "log-item__badge";
  levelBadge.dataset.level = level;
  levelBadge.textContent = formatLogLevelLabel(level);

  const time = document.createElement("span");
  time.className = "log-item__time";
  time.textContent = formatTimestamp(entry.createdAt);

  meta.append(sourceBadge, levelBadge, time);

  const message = document.createElement("p");
  message.className = "log-item__message";
  message.textContent =
    level === "error"
      ? `Erro: ${translateLogText(entry.message) || "Evento sem descrição."}`
      : translateLogText(entry.message) || "Evento sem descrição.";

  item.append(meta, message);

  const details = normalizeDetails(entry.details);
  if (details.length) {
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "log-item__details";

    for (const detail of details) {
      const row = document.createElement("p");
      row.className = "log-item__detail";
      row.textContent = detail;
      detailsContainer.append(row);
    }

    item.append(detailsContainer);
  }

  return item;
}

function renderLogs(logs) {
  const entries = Array.isArray(logs)
    ? logs.filter((entry) => isProductionOrderCreationLog(entry))
    : [];

  if (!entries.length) {
    logList.replaceChildren(buildEmptyState());
    return entries;
  }

  const nodes = entries.map((entry) => buildLogItem(entry));
  logList.replaceChildren(...nodes);
  return entries;
}

async function loadLogs() {
  setBusy(true, "Atualizando...");
  renderFeedback("Carregando logs de criação de OP...");

  try {
    const response = await sendRuntimeMessage({
      type: "ERP_FLEX_GET_LOGS",
    });

    if (!response?.ok) {
      throw new Error(
        response?.message ?? "Falha ao carregar logs da extensão.",
      );
    }

    const filteredLogs = renderLogs(response.logs);
    const errorCount = Array.isArray(filteredLogs)
      ? filteredLogs.filter((entry) => getLogLevel(entry) === "error").length
      : 0;
    renderFeedback(
      filteredLogs?.length
        ? errorCount
          ? "Logs carregados. Existem erros de importação que exigem revisão."
          : "Logs de criação de OP carregados com sucesso."
        : "Nenhum log de criação de OP foi salvo ainda neste navegador.",
      [
        `Entradas: ${Array.isArray(filteredLogs) ? filteredLogs.length : 0}`,
        `Erros: ${errorCount}`,
      ],
      errorCount ? "error" : "success",
    );
  } catch (error) {
    logList.replaceChildren(buildEmptyState());
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao carregar logs da extensão.",
      [],
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function handleClearLogs() {
  setBusy(true, "Limpando...");
  renderFeedback("Limpando logs salvos da extensão...");

  try {
    const response = await sendRuntimeMessage({
      type: "ERP_FLEX_CLEAR_LOGS",
    });

    if (!response?.ok) {
      throw new Error(response?.message ?? "Falha ao limpar logs da extensão.");
    }

    renderLogs(response.logs);
    renderFeedback("Logs removidos com sucesso.", [], "success");
  } catch (error) {
    renderFeedback(
      error instanceof Error
        ? error.message
        : "Falha ao limpar logs da extensão.",
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

refreshLogsButton.addEventListener("click", () => {
  void loadLogs();
});

clearLogsButton.addEventListener("click", () => {
  void handleClearLogs();
});

backToPopupButton.addEventListener("click", () => {
  goBackToPopup();
});

void loadLogs();
