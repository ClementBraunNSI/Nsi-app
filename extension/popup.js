import { formatAssessmentDate, formatDue, getSettings } from "./shared.js";

const $ = (id) => document.getElementById(id);
const LABELS = { interro: "Interro", ds: "DS" };

function item(title, detail, extra) {
  const li = document.createElement("li");
  const b = document.createElement("b");
  b.textContent = title;
  const small = document.createElement("small");
  small.textContent = detail;
  li.append(b, small);
  if (extra) {
    const p = document.createElement("p");
    p.textContent = extra;
    li.append(p);
  }
  return li;
}

function fill(list, rows, empty) {
  list.replaceChildren(...(rows.length ? rows : [Object.assign(document.createElement("li"), { className: "empty", textContent: empty })]));
}

async function render() {
  const { site } = await getSettings();
  const { info = null, error = null, checkedAt = null } = await chrome.storage.local.get(["info", "error", "checkedAt"]);
  $("site-link").href = `${site}/espace/classe`;
  $("announcement-link").href = `${site}/espace/classe#annonces`;

  const status = $("status");
  status.hidden = true;
  if (error === "token") {
    status.textContent = "Jeton absent ou refusé. Créer un jeton sur la page Ma classe du site, puis le coller dans les réglages.";
    status.hidden = false;
  } else if (error === "network") {
    status.textContent = "Site injoignable pour le moment. Les informations affichées datent de la dernière vérification.";
    status.hidden = false;
  }

  $("content").hidden = !info;
  if (!info) return;

  $("title").textContent = info.classe ? `Ma classe : ${info.classe}` : "Ma classe";

  const last = info.lastAnnouncement;
  $("announcement").hidden = !last || info.unread === 0;
  if (last) {
    $("announcement-body").textContent = last.body;
    $("announcement").querySelector("h2").textContent =
      info.unread > 1 ? `${info.unread} annonces non lues` : "Annonce non lue";
  }

  fill(
    $("assessments"),
    info.assessments.map((a) => item(`${LABELS[a.kind] ?? a.kind}${a.title ? ` : ${a.title}` : ""}`, formatAssessmentDate(a.day, a.time), a.chapters)),
    "Aucune date annoncée.",
  );
  fill(
    $("homework"),
    info.homework
      .filter((h) => !h.done)
      .map((h) => item(h.title, formatDue(h.dueAt), h.description)),
    "Aucun devoir en cours.",
  );

  if (checkedAt) $("refresh").title = `Dernière vérification : ${new Date(checkedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

$("refresh").addEventListener("click", async () => {
  $("refresh").disabled = true;
  await chrome.runtime.sendMessage({ type: "refresh" });
  $("refresh").disabled = false;
  await render();
});

void render();
