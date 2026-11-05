// Vérification régulière : badge du nombre d'annonces non lues, notification à chaque nouvelle annonce.
import { fetchClassInfo, getSettings } from "./shared.js";

const ALARM = "refresh";
const PERIOD_MINUTES = 15;
const NOTIFICATION = "nouvelle-annonce";

async function refresh() {
  const settings = await getSettings();
  if (!settings.token) {
    await chrome.storage.local.set({ info: null, error: "token", checkedAt: Date.now() });
    await setBadge("", "#9ca3af");
    return;
  }
  const { info, error } = await fetchClassInfo(settings);
  if (error) {
    await chrome.storage.local.set({ error, checkedAt: Date.now() });
    await setBadge(error === "token" ? "!" : "", "#b91c1c");
    return;
  }
  await chrome.storage.local.set({ info, error: null, checkedAt: Date.now() });
  await setBadge(info.unread > 0 ? String(Math.min(info.unread, 99)) : "", "#ea580c");

  const last = info.lastAnnouncement;
  const { notifiedId = null } = await chrome.storage.local.get("notifiedId");
  if (last && info.unread > 0 && last.id !== notifiedId) {
    await chrome.notifications.create(NOTIFICATION, {
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: info.classe ? `Nouvelle annonce pour la ${info.classe}` : "Nouvelle annonce",
      message: last.body.length > 180 ? `${last.body.slice(0, 177)}…` : last.body,
    });
  }
  if (last) await chrome.storage.local.set({ notifiedId: last.id });
}

async function setBadge(text, color) {
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color });
}

async function schedule() {
  const existing = await chrome.alarms.get(ALARM);
  if (!existing) await chrome.alarms.create(ALARM, { periodInMinutes: PERIOD_MINUTES, delayInMinutes: 1 });
}

chrome.runtime.onInstalled.addListener(async () => {
  await schedule();
  await refresh();
});

chrome.runtime.onStartup.addListener(async () => {
  await schedule();
  await refresh();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) void refresh();
});

// Réglages enregistrés ou bouton « Actualiser » du popup.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "refresh") return false;
  refresh().then(() => sendResponse({ ok: true }));
  return true;
});

chrome.notifications.onClicked.addListener(async (id) => {
  if (id !== NOTIFICATION) return;
  const { site } = await getSettings();
  await chrome.tabs.create({ url: `${site}/espace/classe#annonces` });
  await chrome.notifications.clear(id);
});
