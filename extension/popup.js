import { formatAssessmentDate, formatDue, formatTimeRange, getSettings } from "./shared.js";

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

function visioItem(visio) {
  const li = document.createElement("li");
  if (visio.title) li.append(Object.assign(document.createElement("b"), { textContent: visio.title }));
  if (visio.joinable && visio.url?.startsWith("https://")) {
    li.append(
      Object.assign(document.createElement("a"), {
        href: visio.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "join",
        textContent: "Rejoindre la visio",
      }),
    );
    if (visio.code) li.append(Object.assign(document.createElement("small"), { textContent: `Code d'accès : ${visio.code}` }));
  } else {
    const next = visio.nextSession;
    const text = next
      ? `Prochaine séance : ${formatAssessmentDate(next.day, null)}, ${formatTimeRange(next.start, next.end)}`
      : "Visio fermée pour le moment.";
    li.append(Object.assign(document.createElement("small"), { textContent: text }));
  }
  if (visio.note) li.append(Object.assign(document.createElement("p"), { textContent: visio.note }));
  return li;
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

  const visios = info.visios ?? [];
  $("visio").hidden = visios.length === 0;
  $("visios").replaceChildren(...visios.map(visioItem));

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
