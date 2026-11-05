import { loader } from '@monaco-editor/react';
import { MONACO_VS_URL } from '@/lib/vendor-assets';

// À importer avant tout <Editor> : sans cela, @monaco-editor/react télécharge Monaco depuis cdn.jsdelivr.net.
loader.config({ paths: { vs: MONACO_VS_URL } });
