import { Lightbulb } from "lucide-react";
import type { ErrorHelp } from "@/lib/python-error-help";

/** Explication en français d'une erreur Python ou d'un test raté, sous le message brut. */
export function ErrorHelpBox({ help }: { help: ErrorHelp }) {
  return (
    <div className="error-help" role="note">
      <p className="error-help-title">
        <Lightbulb size={15} aria-hidden />
        <span>{help.title}</span>
      </p>
      {help.line && help.lineText ? (
        <p className="error-help-line">
          <span>Ligne {help.line}</span>
          <code>{help.lineText.trim()}</code>
        </p>
      ) : null}
      <p className="error-help-text">{help.text}</p>
      {help.hint ? <p className="error-help-hint">{help.hint}</p> : null}
    </div>
  );
}
