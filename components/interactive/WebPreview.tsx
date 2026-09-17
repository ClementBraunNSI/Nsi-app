
'use client';

import React, { useState } from 'react';
import SimpleCodeEditor from './SimpleCodeEditor';

export default function WebPreview() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>

  <head>
    <meta charset="UTF-8"/>
    <title>Titre de la page</title>
  </head>

  <body>

  </body>

</html>`);
  
  return (
    <div className="flex min-h-[32rem] flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] md:min-h-96 md:flex-row">
      <div className="min-h-64 w-full border-b border-[var(--border)] bg-[#1e1e1e] md:min-h-0 md:w-1/2 md:border-b-0 md:border-r">
        <div className="bg-[#2d2d2d] text-gray-400 text-xs px-4 py-2 font-mono border-b border-[#3e3e3e]">index.html</div>
        <SimpleCodeEditor
          height="calc(100% - 33px)"
          language="html"
          value={html}
          onChange={setHtml}
          ariaLabel="Code HTML"
        />
      </div>
      <div className="flex min-h-64 w-full flex-col bg-white md:min-h-0 md:w-1/2">
        <div className="border-b bg-gray-100 px-4 py-2 font-mono text-xs text-gray-500">Aperçu dans le terrier</div>
        <iframe
          srcDoc={html}
          className="w-full h-full border-none"
          title="Aperçu de la page HTML"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
