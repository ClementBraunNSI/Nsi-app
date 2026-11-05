"use client";

import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import { createExtensionToken, revokeExtensionToken } from "@/app/actions/classInfo";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** Jeton personnel de l'extension : créé, montré une seule fois, révocable. */
export function ExtensionTokenCard({ createdAt }: { createdAt: string | null }) {
  const [since, setSince] = useState(createdAt);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    if (since && !window.confirm("Un nouveau jeton remplace l'ancien, qui cessera de fonctionner. Continuer ?")) return;
    setBusy(true);
    setError(null);
    const result = await createExtensionToken();
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setToken(result.token);
    setCopied(false);
    setSince(new Date().toISOString());
  };

  const revoke = async () => {
    if (!window.confirm("Révoquer le jeton ? L'extension ne recevra plus rien.")) return;
    setBusy(true);
    setError(null);
    const result = await revokeExtensionToken();
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setToken(null);
    setSince(null);
  };

  return (
    <div className="classe-token">
      <p>
        L&apos;extension de navigateur affiche les devoirs et les dates d&apos;interros et de DS, et signale les nouvelles annonces. Elle a
        besoin d&apos;un jeton personnel, à coller une seule fois dans ses réglages. Le jeton ne donne accès qu&apos;à ces informations, en
        lecture seule.
      </p>
      {token ? (
        <div className="classe-token-value">
          <code>{token}</code>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(token);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy size={15} aria-hidden /> {copied ? "Copié" : "Copier"}
          </button>
          <small>Ce jeton ne sera plus affiché. En cas de perte, en créer un nouveau.</small>
        </div>
      ) : since ? (
        <p className="classe-token-state">
          <KeyRound size={15} aria-hidden /> Jeton actif, créé le {dateFormat.format(new Date(since))}.
        </p>
      ) : null}
      {error ? <p className="classe-token-error">{error}</p> : null}
      <div className="classe-token-actions">
        <button type="button" className="classe-button" disabled={busy} onClick={create}>
          {since ? "Créer un nouveau jeton" : "Créer un jeton"}
        </button>
        {since ? (
          <button type="button" className="classe-button is-quiet" disabled={busy} onClick={revoke}>
            Révoquer
          </button>
        ) : null}
      </div>
    </div>
  );
}
