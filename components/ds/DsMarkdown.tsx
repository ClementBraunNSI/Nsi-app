import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

/**
 * Markdown d'un DS (sujet ou correction), avec le rendu des cours : tableaux, formules, blocs de code colorés.
 * Le HTML brut écrit dans le texte n'est pas interprété (comportement par défaut de react-markdown).
 * Utilisable côté serveur (page élève) comme côté navigateur (aperçu de l'admin).
 */
export function DsMarkdown({ source }: { source: string }) {
  return (
    <article className="prose prose-slate max-w-none course-prose ds-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: false, plainText: ["txt", "text", "console"] }]]}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
