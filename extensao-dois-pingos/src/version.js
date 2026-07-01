function renderExtensionVersion() {
  const versionElements = document.querySelectorAll("[data-extension-version]");

  if (!versionElements.length) {
    return;
  }

  fetch(chrome.runtime.getURL("manifest.json"))
    .then((response) => response.json())
    .then((manifest) => {
      const version = manifest.version ?? "?.?.?";

      versionElements.forEach((element) => {
        element.textContent = version;
      });
    })
    .catch(() => {
      versionElements.forEach((element) => {
        element.textContent = "?.?.?";
      });
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderExtensionVersion);
} else {
  renderExtensionVersion();
}
