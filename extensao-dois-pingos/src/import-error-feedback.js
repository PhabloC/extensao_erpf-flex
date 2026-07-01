function normalizeImportErrorText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasVariationLookupFailure(message, details = []) {
  const haystack = [message, ...details].map((entry) =>
    normalizeImportErrorText(entry),
  );

  return haystack.some((entry) => {
    return (
      /no registered variation was found for the provided product code/i.test(
        entry,
      ) ||
      /nenhuma variação cadastrada foi encontrada para o código de produto/i.test(
        entry,
      ) ||
      /variação cadastrada compatível com o código do produto/i.test(entry)
    );
  });
}

function hasColorLookupFailure(message, details = [], code = "") {
  const haystack = [message, code, ...details].map((entry) =>
    normalizeImportErrorText(entry),
  );

  return haystack.some((entry) => {
    return (
      /variation_color_not_registered/i.test(entry) ||
      /color_not_registered/i.test(entry) ||
      /cor.*não.*cadastrad/i.test(entry) ||
      /cor.*nao.*cadastrad/i.test(entry) ||
      /registered color was not found/i.test(entry)
    );
  });
}

function hasVariationCodeLookupFailure(message, details = [], code = "") {
  const haystack = [message, code, ...details].map((entry) =>
    normalizeImportErrorText(entry),
  );

  return haystack.some((entry) => {
    return (
      /variation_code_not_registered/i.test(entry) ||
      /sku_not_registered/i.test(entry) ||
      /código da variação.*não.*cadastrad/i.test(entry) ||
      /codigo da variacao.*nao.*cadastrad/i.test(entry) ||
      /variation sku was not found/i.test(entry)
    );
  });
}

function extractPayloadImportContext(payload) {
  const candidates = payload?.rawPayload?.candidates ?? {};

  return {
    orderNumber: normalizeImportErrorText(payload?.orderNumber),
    externalOrderId: normalizeImportErrorText(payload?.externalOrderId),
    productCode: normalizeImportErrorText(
      candidates.productCode || payload?.item?.productCode,
    ),
    productBase: normalizeImportErrorText(
      candidates.baseProduct || candidates.productBase,
    ),
    variations: normalizeImportErrorText(candidates.variations),
    color: normalizeImportErrorText(candidates.color),
    size: normalizeImportErrorText(candidates.size),
  };
}

function classifyImportFailure(errorLike, payload) {
  const message = normalizeImportErrorText(errorLike?.message || errorLike);
  const details = Array.isArray(errorLike?.details) ? errorLike.details : [];
  const code = normalizeImportErrorText(errorLike?.code);
  const context = extractPayloadImportContext(payload);
  const hasCapturedVariations = Boolean(context.variations);
  const hasCapturedColor = Boolean(context.color);

  if (hasColorLookupFailure(message, details, code)) {
    return {
      cause: "color_not_registered",
      summary:
        "A importação falhou porque a cor enviada não está cadastrada no sistema destino.",
      actionHint:
        "Cadastre a cor no sistema destino ou confira se a cor capturada do ERP está correta.",
    };
  }

  if (hasVariationCodeLookupFailure(message, details, code)) {
    return {
      cause: "variation_code_not_registered",
      summary:
        "A importação falhou porque o código da variação enviado não está cadastrado no sistema destino.",
      actionHint:
        "Cadastre o código da variação no sistema destino ou confira o código capturado do ERP.",
    };
  }

  if (hasVariationLookupFailure(message, details)) {
    if (!hasCapturedVariations && !hasCapturedColor) {
      return {
        cause: "variation_data_missing",
        summary:
          "A importação falhou porque nenhuma variação ou cor foi capturada do ERP para esta OP.",
        actionHint:
          "Revise a captura no ERP Flex e confirme se a OP exibe variação/cor antes de importar.",
      };
    }

    if (hasCapturedColor && !hasCapturedVariations) {
      return {
        cause: "variation_not_registered",
        summary:
          "A importação falhou porque a cor capturada não foi encontrada no cadastro do sistema destino.",
        actionHint:
          "Verifique se a cor está cadastrada para o produto no sistema destino.",
      };
    }

    return {
      cause: "variation_not_registered",
      summary:
        "A importação falhou porque a variação/código enviado não foi encontrado no cadastro do sistema destino.",
      actionHint:
        "Verifique se a variação e o código do produto estão cadastrados no sistema destino.",
    };
  }

  if (/sessao expirada|renovar o token/i.test(message)) {
    return {
      cause: "session_expired",
      summary: message,
      actionHint:
        "Abra a configuração avançada e informe a senha para renovar a sessão.",
    };
  }

  if (/failed to fetch|networkerror|network error/i.test(message)) {
    return {
      cause: "network_error",
      summary: "A extensão não conseguiu alcançar a API do sistema destino.",
      actionHint:
        "Verifique se a API está online e acessível a partir do navegador.",
    };
  }

  if (/dados enviados pela extensão foram rejeitados/i.test(message)) {
    return {
      cause: "validation_error",
      summary: message,
      actionHint: "Revise os dados capturados e tente novamente.",
    };
  }

  return {
    cause: "unknown",
    summary: message || "Erro inesperado durante a importação da OP.",
    actionHint: "",
  };
}

function buildImportFailureLogDetails(errorLike, payload) {
  const classification = classifyImportFailure(errorLike, payload);
  const context = extractPayloadImportContext(payload);
  const details = Array.isArray(errorLike?.details) ? errorLike.details : [];
  const code = normalizeImportErrorText(errorLike?.code);
  const statusCode = errorLike?.statusCode ?? null;

  const logDetails = [
    `Motivo: ${classification.summary}`,
  ];

  if (classification.actionHint) {
    logDetails.push(`Ação sugerida: ${classification.actionHint}`);
  }

  logDetails.push(
    `Tipo do erro: ${classification.cause}`,
    `OP: ${context.orderNumber || "Não informada"}`,
    `Id externo ERP: ${context.externalOrderId || "Não informado"}`,
    `Código produto: ${context.productCode || "Não informado"}`,
    `Produto base: ${context.productBase || "Não informado"}`,
    `Variações capturadas: ${context.variations || "Não informadas"}`,
    `Cor capturada: ${context.color || "Não informada"}`,
    `Tamanho capturado: ${context.size || "Não informado"}`,
  );

  if (code) {
    logDetails.push(`Código API: ${code}`);
  }

  if (statusCode) {
    logDetails.push(`HTTP: ${statusCode}`);
  }

  if (details.length > 0) {
    logDetails.push("Detalhes da API:", ...details);
  }

  return logDetails;
}

function buildImportErrorPresentation(errorLike, payload, settings = {}) {
  const classification = classifyImportFailure(errorLike, payload);
  const logDetails = buildImportFailureLogDetails(errorLike, payload);
  const settingsDetails = [];

  if (
    !normalizeImportErrorText(settings.apiBaseUrl) ||
    !normalizeImportErrorText(settings.userEmail)
  ) {
    return {
      message:
        "A criação da OP precisa da API e do e-mail configurados antes do envio.",
      overlayMessage:
        "Configure a API e o e-mail antes de importar.",
      details: logDetails,
      tone: "error",
    };
  }

  if (classification.cause === "session_expired") {
    settingsDetails.push(
      "Abra a configuração avançada e informe a senha para renovar a sessão.",
    );
  }

  if (classification.cause === "network_error") {
    settingsDetails.push(
      `API configurada: ${normalizeImportErrorText(settings.apiBaseUrl) || "Não informada"}`,
      classification.actionHint,
    );
  }

  return {
    message: classification.summary,
    overlayMessage: classification.summary,
    details: [...settingsDetails, ...logDetails],
    tone: "error",
  };
}
