
'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function WebPreview() {
  const [html, setHtml] = useState('<h1>Salut !</h1>\n<p>Ceci est un paragraphe.</p>\n<style>\n  h1 { color: orange; }\n  p { font-family: sans-serif; }\n</style>');
  
  return (
    <div className="flex flex-col md:flex-row h-96 border rounded-xl overflow-hidden shadow-lg my-8">
      <div className="w-full md:w-1/2 border-r bg-[#1e1e1e]">
        <div className="bg-[#2d2d2d] text-gray-400 text-xs px-4 py-2 font-mono border-b border-[#3e3e3e]">index.html</div>
        <Editor
          height="100%"
          defaultLanguage="html"
          theme="vs-dark"
          value={html}
          onChange={(val) => setHtml(val || '')}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <div className="w-full md:w-1/2 bg-white flex flex-col">
        <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 font-mono border-b">Résultat</div>
        <iframe
          srcDoc={html}
          className="w-full h-full border-none"
          title="preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
