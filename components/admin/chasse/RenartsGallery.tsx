"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Download, Loader2, Search, Trash2, X } from "lucide-react";
import { deleteRenart, deleteRenarts, getRenartImage, listRenarts } from "@/app/actions/chasseRenarts";
import { renartFileName, type Renart } from "@/lib/chasse-renarts";
import { isAbortError } from "@/lib/is-abort-error";
import { foldText } from "@/lib/revisions";
import { zipParts, type ZipFile } from "@/lib/zip";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });
/** Date du jour à Paris, en AAAA-MM-JJ, pour le nom de l'archive. */
const dayStamp = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });
/** Images en grand gardées en mémoire (jusqu'à 2,5 Mo chacune) : de quoi revenir en arrière sans tout recharger. */
const IMAGE_CACHE = 12;

const plural = (count: number) => `${count} tableau${count > 1 ? "x" : ""}`;

/** Archive des tableaux : en préparation, prête (en attente de la confirmation de réception), ou terminée. */
type Bundle =
  | { phase: "preparing"; done: number; total: number }
  | { phase: "ready"; url: string; fileName: string; included: Renart[]; missing: number; busy: boolean; error: string | null }
  | { phase: "done"; message: string };

function dataUrlBytes(dataUrl: string) {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

/** Deux tableaux du même élève : « Zoe.jpg » puis « Zoe-2.jpg » (sans tenir compte de la casse, comme Windows et macOS). */
function uniqueName(taken: Set<string>, name: string) {
  let candidate = name;
  for (let n = 2; taken.has(candidate.toLowerCase()); n += 1) candidate = name.replace(/\.jpg$/, `-${n}.jpg`);
  taken.add(candidate.toLowerCase());
  return candidate;
}

function saveFile(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * Tableaux envoyés par les élèves depuis l'accueil : filtre par classe, recherche par prénom,
 * visionneuse plein écran qui passe d'un tableau à l'autre (flèches, glissé, bande de vignettes),
 * et téléchargement de tout dans un zip rangé par classe, puis retrait du site une fois la réception confirmée.
 */
export function RenartsGallery() {
  const [renarts, setRenarts] = useState<Renart[] | null>(null);
  const [classe, setClasse] = useState("");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const images = useRef(new Map<string, Promise<string | null>>());
  /** Numéro de la préparation en cours : l'annuler ou en lancer une autre arrête la précédente. */
  const run = useRef(0);

  useEffect(() => {
    let alive = true;
    listRenarts()
      .then((items) => {
        if (alive) setRenarts(items);
      })
      .catch((error) => {
        if (!isAbortError(error)) console.error(error);
        if (alive) setRenarts([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const classes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const renart of renarts ?? []) counts.set(renart.classe, (counts.get(renart.classe) ?? 0) + 1);
    return [...counts].sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }));
  }, [renarts]);

  // Classe disparue (dernier tableau supprimé) : retour à toutes les classes.
  useEffect(() => {
    if (classe && renarts && !classes.some(([name]) => name === classe)) setClasse("");
  }, [classe, classes, renarts]);

  const groups = useMemo(() => {
    const words = foldText(query).split(" ").filter(Boolean);
    const byClass = new Map<string, Renart[]>();
    for (const renart of renarts ?? []) {
      if (classe && renart.classe !== classe) continue;
      const name = foldText(renart.prenom);
      if (!words.every((word) => name.includes(word))) continue;
      byClass.set(renart.classe, [...(byClass.get(renart.classe) ?? []), renart]);
    }
    return [...byClass].sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }));
  }, [renarts, classe, query]);

  // Ordre de la visionneuse : celui de la page, classe après classe.
  const visible = useMemo(() => groups.flatMap(([, items]) => items), [groups]);

  const loadImage = useCallback((id: string) => {
    const cache = images.current;
    const known = cache.get(id);
    if (known) {
      // Remis en fin de file : le plus ancien consulté part en premier.
      cache.delete(id);
      cache.set(id, known);
      return known;
    }
    const promise = getRenartImage(id)
      .catch(() => null)
      .then((data) => {
        if (!data) cache.delete(id);
        return data;
      });
    cache.set(id, promise);
    while (cache.size > IMAGE_CACHE) cache.delete(cache.keys().next().value as string);
    return promise;
  }, []);

  const removed = (id: string) => {
    const index = visible.findIndex((item) => item.id === id);
    const next = visible[index + 1] ?? visible[index - 1] ?? null;
    images.current.delete(id);
    setRenarts((items) => (items ?? []).filter((item) => item.id !== id));
    setOpenId(next?.id ?? null);
  };

  // L'archive vit en mémoire tant que la réception n'est pas confirmée ; on la libère ensuite.
  const bundleUrl = bundle?.phase === "ready" ? bundle.url : null;
  useEffect(() => () => {
    if (bundleUrl) URL.revokeObjectURL(bundleUrl);
  }, [bundleUrl]);

  useEffect(() => () => {
    run.current += 1;
  }, []);

  /** Les tableaux affichés, un par un, dans un zip : un dossier par classe. */
  const downloadAll = async () => {
    const items = visible;
    const token = (run.current += 1);
    setBundle({ phase: "preparing", done: 0, total: items.length });
    const files: ZipFile[] = [];
    const included: Renart[] = [];
    const taken = new Set<string>();
    for (const [position, renart] of items.entries()) {
      const data = await loadImage(renart.id);
      if (run.current !== token) return;
      if (data) {
        files.push({ name: uniqueName(taken, `${renart.classe}/${renartFileName(renart)}`), content: dataUrlBytes(data), date: new Date(renart.createdAt) });
        included.push(renart);
      }
      setBundle({ phase: "preparing", done: position + 1, total: items.length });
    }
    if (included.length === 0) {
      setBundle({ phase: "done", message: "Aucun tableau n'a pu être chargé : rien n'a été téléchargé." });
      return;
    }
    const url = URL.createObjectURL(new Blob(zipParts(files) as BlobPart[], { type: "application/zip" }));
    const fileName = `renarts${classe ? `-${classe}` : ""}-${dayStamp.format(new Date())}.zip`;
    saveFile(url, fileName);
    setBundle({ phase: "ready", url, fileName, included, missing: items.length - included.length, busy: false, error: null });
  };

  const confirmReceived = async () => {
    if (bundle?.phase !== "ready") return;
    setBundle({ ...bundle, busy: true, error: null });
    const result = await deleteRenarts(bundle.included.map((item) => item.id));
    if (!result.ok) {
      setBundle({ ...bundle, busy: false, error: result.error });
      return;
    }
    const gone = new Set(result.deleted);
    for (const id of gone) images.current.delete(id);
    setRenarts((items) => (items ?? []).filter((item) => !gone.has(item.id)));
    const left = bundle.included.length - gone.size;
    setBundle({
      phase: "done",
      message:
        `${plural(gone.size)} retiré${gone.size > 1 ? "s" : ""} du site.` +
        (left > 0 ? ` ${plural(left)} n'${left > 1 ? "ont" : "a"} pas pu l'être : relance la suppression plus tard.` : ""),
    });
  };

  const openIndex = openId ? visible.findIndex((item) => item.id === openId) : -1;

  if (renarts === null) return <p className="bug-empty">Chargement en cours</p>;

  const panel = bundle ? (
    <BundlePanel
      bundle={bundle}
      onCancel={() => {
        run.current += 1;
        setBundle(null);
      }}
      onConfirm={confirmReceived}
      onClose={() => setBundle(null)}
    />
  ) : null;

  if (renarts.length === 0) {
    return (
      <div className="renart-gallery">
        {panel}
        <p className="bug-empty">Aucun tableau reçu pour le moment.</p>
      </div>
    );
  }

  const exporting = bundle?.phase === "preparing" || (bundle?.phase === "ready" && bundle.busy);

  return (
    <div className="renart-gallery">
      <div className="renart-toolbar">
        <nav className="bug-filters" aria-label="Classe">
          <button type="button" aria-pressed={classe === ""} onClick={() => setClasse("")}>
            Toutes
            <span>{renarts.length}</span>
          </button>
          {classes.map(([name, count]) => (
            <button key={name} type="button" aria-pressed={classe === name} onClick={() => setClasse(name)}>
              {name}
              <span>{count}</span>
            </button>
          ))}
        </nav>
        <div className="renart-toolbar-end">
          <label className="renart-search">
            <Search size={15} aria-hidden />
            <input type="search" value={query} placeholder="Prénom" aria-label="Chercher un prénom" onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button type="button" className="admin-btn" onClick={downloadAll} disabled={exporting || visible.length === 0} title="Un fichier .zip, avec un dossier par classe">
            <Download size={16} aria-hidden /> {classe ? `Télécharger ${classe}` : "Tout télécharger"} ({visible.length})
          </button>
        </div>
      </div>

      {panel}

      {groups.length === 0 ? (
        <p className="bug-empty">{query.trim() ? `Aucun tableau pour « ${query.trim()} ».` : "Aucun tableau ici."}</p>
      ) : (
        groups.map(([name, items]) => (
          <section key={name} className="renart-class" aria-label={name}>
            {classe ? null : (
              <h3>
                {name}
                <small>{plural(items.length)}</small>
              </h3>
            )}
            <ul className="renart-grid">
              {items.map((renart) => (
                <li key={renart.id}>
                  <button type="button" onClick={() => setOpenId(renart.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={renart.thumbnail} alt={`Tableau de ${renart.prenom}`} loading="lazy" />
                    <b>{renart.prenom}</b>
                    <small>{dateFormat.format(new Date(renart.createdAt))}</small>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {openIndex >= 0 ? (
        <RenartViewer
          items={visible}
          index={openIndex}
          loadImage={loadImage}
          onMove={(index) => setOpenId(visible[index].id)}
          onClose={() => setOpenId(null)}
          onDeleted={removed}
        />
      ) : null}
    </div>
  );
}

/** Avancement de l'archive, puis confirmation de réception : rien n'est retiré du site sans ce clic. */
function BundlePanel({
  bundle,
  onCancel,
  onConfirm,
  onClose,
}: {
  bundle: Bundle;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (bundle.phase === "preparing") {
    return (
      <div className="renart-export is-preparing" role="status">
        <Loader2 size={16} className="animate-spin" aria-hidden />
        <p>
          Préparation du fichier : {bundle.done} / {plural(bundle.total)}
        </p>
        <button type="button" className="admin-btn is-quiet is-small" onClick={onCancel}>
          Annuler
        </button>
        <progress value={bundle.done} max={bundle.total} aria-label="Avancement" />
      </div>
    );
  }

  if (bundle.phase === "done") {
    return (
      <div className="renart-export is-done" role="status">
        <p>{bundle.message}</p>
        <button type="button" className="admin-btn is-quiet is-small" onClick={onClose}>
          Fermer
        </button>
      </div>
    );
  }

  const count = bundle.included.length;
  const byClass = new Map<string, number>();
  for (const item of bundle.included) byClass.set(item.classe, (byClass.get(item.classe) ?? 0) + 1);
  const folders = [...byClass].sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }));

  return (
    <div className="renart-export" role="region" aria-label="Confirmation de réception">
      <p>
        <b>{bundle.fileName}</b> : {plural(count)}, {folders.length > 1 ? `un dossier par classe (${folders.map(([name, n]) => `${name} : ${n}`).join(", ")})` : `dans le dossier ${folders[0][0]}`}.
      </p>
      {bundle.missing > 0 ? (
        <p className="bug-error">
          {bundle.missing > 1
            ? `${bundle.missing} tableaux n'ont pas pu être chargés : ils ne sont pas dans le fichier et restent sur le site.`
            : "1 tableau n'a pas pu être chargé : il n'est pas dans le fichier et reste sur le site."}
        </p>
      ) : null}
      <p className="renart-export-hint">
        Ouvre le fichier et vérifie que les tableaux y sont bien. Une fois retirés du site, ils ne pourront plus être récupérés.
      </p>
      {bundle.error ? <p className="bug-error">{bundle.error}</p> : null}
      <div className="renart-export-actions">
        <button type="button" className="admin-btn is-danger" onClick={onConfirm} disabled={bundle.busy}>
          {bundle.busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Check size={16} aria-hidden />}
          {count > 1 ? `J'ai bien reçu les ${count} tableaux : les retirer du site` : "J'ai bien reçu le tableau : le retirer du site"}
        </button>
        <a className="admin-btn is-quiet" href={bundle.url} download={bundle.fileName}>
          <Download size={16} aria-hidden /> Télécharger à nouveau
        </a>
        <button type="button" className="admin-btn is-quiet" onClick={onClose} disabled={bundle.busy}>
          Plus tard
        </button>
      </div>
    </div>
  );
}

/** Visionneuse plein écran : ← → ou glissé pour changer de tableau, Échap pour fermer. */
function RenartViewer({
  items,
  index,
  loadImage,
  onMove,
  onClose,
  onDeleted,
}: {
  items: Renart[];
  index: number;
  loadImage: (id: string) => Promise<string | null>;
  onMove: (index: number) => void;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const renart = items[index];
  const [image, setImage] = useState<{ id: string; data: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback((step: number) => {
    const next = index + step;
    if (next >= 0 && next < items.length) onMove(next);
  }, [index, items.length, onMove]);

  // L'image en grand du tableau affiché, puis celles des voisins pour que le suivant s'affiche aussitôt.
  useEffect(() => {
    let alive = true;
    setError(null);
    loadImage(renart.id).then((data) => {
      if (alive) setImage({ id: renart.id, data });
    });
    for (const neighbour of [items[index + 1], items[index - 1]]) if (neighbour) loadImage(neighbour.id);
    strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
    return () => {
      alive = false;
    };
  }, [renart.id, index, items, loadImage]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Page figée derrière la visionneuse ; le focus revient à la vignette à la fermeture.
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      before?.focus();
    };
  }, []);

  const current = image?.id === renart.id ? image : null;

  const remove = async () => {
    if (!window.confirm(`Supprimer le tableau de ${renart.prenom} (${renart.classe}) ?`)) return;
    setBusy(true);
    const result = await deleteRenart(renart.id);
    setBusy(false);
    if (!result.ok) setError(result.error);
    else onDeleted(renart.id);
  };

  return (
    <div ref={dialog} className="renart-viewer" role="dialog" aria-modal="true" aria-label={`Tableau de ${renart.prenom}, ${renart.classe}`} tabIndex={-1}>
      <header className="renart-viewer-head">
        <div className="min-w-0">
          <b>{renart.prenom}</b>
          <span>{renart.classe}</span>
          <small>Envoyé le {dateFormat.format(new Date(renart.createdAt))}</small>
        </div>
        <span className="renart-viewer-count">
          {index + 1} / {items.length}
        </span>
        {current?.data ? (
          <a className="bug-primary" href={current.data} download={renartFileName(renart)}>
            <Download size={16} aria-hidden /> Télécharger
          </a>
        ) : null}
        <button type="button" className="renart-viewer-ghost" onClick={remove} disabled={busy}>
          <Trash2 size={15} aria-hidden /> Supprimer
        </button>
        <button type="button" className="renart-viewer-close" onClick={onClose} aria-label="Fermer">
          <X size={20} aria-hidden />
        </button>
      </header>
      {error ? <p className="bug-error renart-viewer-error">{error}</p> : null}

      <div
        className="renart-viewer-stage"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const dx = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <button type="button" className="renart-viewer-arrow is-prev" onClick={() => go(-1)} disabled={index === 0} aria-label="Tableau précédent">
          <ChevronLeft size={28} aria-hidden />
        </button>
        {current && current.data === null ? (
          <p className="renart-viewer-note">Le tableau n&apos;a pas pu être chargé.</p>
        ) : (
          // La vignette tient la place, floue, le temps que l'image en grand arrive.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={renart.id} src={current?.data ?? renart.thumbnail} alt={`Tableau de ${renart.prenom}, ${renart.classe}`} className={current ? "" : "is-preview"} />
        )}
        {current ? null : (
          <span className="renart-viewer-loading">
            <Loader2 size={14} className="animate-spin" aria-hidden /> Chargement
          </span>
        )}
        <button type="button" className="renart-viewer-arrow is-next" onClick={() => go(1)} disabled={index === items.length - 1} aria-label="Tableau suivant">
          <ChevronRight size={28} aria-hidden />
        </button>
      </div>

      <ol ref={strip} className="renart-viewer-strip" aria-label="Tableaux">
        {items.map((item, position) => (
          <li key={item.id}>
            <button type="button" aria-current={position === index} onClick={() => onMove(position)} aria-label={`${item.prenom}, ${item.classe}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnail} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
