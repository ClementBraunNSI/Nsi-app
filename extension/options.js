import { ALLOWED_SITES, TOKEN_PATTERN, getSettings } from "./shared.js";

const $ = (id) => document.getElementById(id);

async function init() {
  const { token, site } = await getSettings();
  $("token").value = token;
  $("site").replaceChildren(...ALLOWED_SITES.map((value) => new Option(value, value, false, value === site)));
}

$("save").addEventListener("click", async () => {
  const token = $("token").value.trim();
  if (!TOKEN_PATTERN.test(token)) {
    $("result").textContent = "Ce jeton n'a pas la forme attendue (tdc_ suivi de 64 caractères).";
    return;
  }
  await chrome.storage.local.set({ token, site: $("site").value, notifiedId: null });
  $("result").textContent = "Vérification…";
  await chrome.runtime.sendMessage({ type: "refresh" });
  const { error, info } = await chrome.storage.local.get(["error", "info"]);
  $("result").textContent =
    error === "token"
      ? "Jeton refusé par le site. En créer un nouveau sur la page Ma classe."
      : error === "network"
        ? "Site injoignable. Réessayer plus tard."
        : `Jeton accepté${info?.classe ? ` pour la ${info.classe}` : ""}.`;
});

$("clear").addEventListener("click", async () => {
  await chrome.storage.local.remove(["token", "info", "notifiedId"]);
  $("token").value = "";
  await chrome.runtime.sendMessage({ type: "refresh" });
  $("result").textContent = "Jeton effacé.";
});

void init();
