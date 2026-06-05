const importForm = document.getElementById('import-form');
const apiBaseUrlInput = document.getElementById('api-base-url');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');
const sessionSummary = document.getElementById('session-summary');
const statusMessage = document.getElementById('status-message');
const statusDetails = document.getElementById('status-details');
const clearSessionButton = document.getElementById('clear-session-button');
const importButton = document.getElementById('import-button');

function setBusy(isBusy) {
  importButton.disabled = isBusy;
  clearSessionButton.disabled = isBusy;
  importButton.textContent = isBusy ? 'Importando...' : 'Importar ordem atual';
}

function renderStatus(message, details) {
  statusMessage.textContent = message;

  if (!details) {
    statusDetails.hidden = true;
    statusDetails.textContent = '';
    return;
  }

  statusDetails.hidden = false;
  statusDetails.textContent =
    typeof details === 'string' ? details : JSON.stringify(details, null, 2);
}

function renderSession(settings) {
  if (settings.accessToken) {
    sessionSummary.textContent = `Sessao ativa para ${
      settings.userEmail || 'usuario autenticado'
    }.`;
    return;
  }

  sessionSummary.textContent = 'Nenhuma sessao autenticada salva.';
}

function sendRuntimeMessage(message) {
  return chrome.runtime.sendMessage(message);
}

async function loadSettings() {
  const response = await sendRuntimeMessage({
    type: 'ERP_FLEX_GET_SETTINGS',
  });

  if (!response?.ok) {
    throw new Error(response?.message ?? 'Falha ao carregar configuracoes da extensao.');
  }

  apiBaseUrlInput.value = response.settings.apiBaseUrl ?? '';
  userEmailInput.value = response.settings.userEmail ?? '';
  renderSession(response.settings);

  if (response.settings.lastImportSummary) {
    renderStatus(response.settings.lastImportSummary);
  }
}

async function saveBaseSettings() {
  const response = await sendRuntimeMessage({
    type: 'ERP_FLEX_SAVE_SETTINGS',
    apiBaseUrl: apiBaseUrlInput.value,
    userEmail: userEmailInput.value,
  });

  if (!response?.ok) {
    throw new Error(response?.message ?? 'Falha ao salvar configuracoes da extensao.');
  }

  renderSession(response.settings);

  return response.settings;
}

async function collectOrderFromActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    throw new Error('Nao foi possivel identificar a aba ativa para coletar a ordem.');
  }

  const response = await chrome.tabs.sendMessage(activeTab.id, {
    type: 'ERP_FLEX_COLLECT_ORDER',
  });

  if (!response?.ok) {
    throw new Error(response?.message ?? 'A pagina atual nao retornou dados validos.');
  }

  return response.payload;
}

function buildImportFeedback(result) {
  if (result.result === 'duplicate') {
    return {
      message: 'A ordem do ERP ja existe no kanban.',
      details: {
        existingProductionOrderId: result.existingProductionOrderId,
        externalOrderId: result.externalOrderId,
      },
    };
  }

  return {
    message: `Ordem ${result.productionOrder?.orderNumber ?? ''} importada com sucesso.`,
    details: {
      productionOrderId: result.productionOrder?.id,
      externalOrderId: result.productionOrder?.source?.externalOrderId,
      status: result.productionOrder?.status,
      origin: result.productionOrder?.source?.origin,
    },
  };
}

async function handleImport(event) {
  event.preventDefault();
  setBusy(true);
  renderStatus('Validando configuracao e coletando a ordem do ERP...');

  try {
    const settings = await saveBaseSettings();
    const payload = await collectOrderFromActiveTab();
    const importResponse = await sendRuntimeMessage({
      type: 'ERP_FLEX_IMPORT_ORDER',
      apiBaseUrl: settings.apiBaseUrl,
      userEmail: userEmailInput.value,
      userPassword: userPasswordInput.value,
      accessToken: settings.accessToken,
      payload,
    });

    if (!importResponse?.ok) {
      throw new Error(importResponse?.message ?? 'Falha na importacao da ordem.');
    }

    const feedback = buildImportFeedback(importResponse);
    userPasswordInput.value = '';
    renderStatus(feedback.message, feedback.details);

    const latestSettings = await sendRuntimeMessage({
      type: 'ERP_FLEX_GET_SETTINGS',
    });

    if (latestSettings?.ok) {
      renderSession(latestSettings.settings);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro inesperado durante a importacao.';
    renderStatus(message);
  } finally {
    setBusy(false);
  }
}

async function handleClearSession() {
  setBusy(true);

  try {
    const response = await sendRuntimeMessage({
      type: 'ERP_FLEX_CLEAR_SESSION',
    });

    if (!response?.ok) {
      throw new Error(response?.message ?? 'Falha ao limpar a sessao da extensao.');
    }

    userPasswordInput.value = '';
    renderSession(response.settings);
    renderStatus('Sessao local removida. Informe a senha novamente na proxima importacao.');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Falha ao limpar a sessao da extensao.';
    renderStatus(message);
  } finally {
    setBusy(false);
  }
}

importForm.addEventListener('submit', handleImport);
clearSessionButton.addEventListener('click', handleClearSession);

loadSettings().catch((error) => {
  const message =
    error instanceof Error ? error.message : 'Falha ao iniciar a extensao.';
  renderStatus(message);
});
