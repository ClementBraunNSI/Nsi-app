"use client";
import { useState } from 'react';
import { Send, Loader2, Globe } from 'lucide-react';

export default function ApiPlayground() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    try {
      const res = await fetch(url, { method });
      setStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg my-6">
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4 md:flex-row items-center">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mr-2">
          <Globe size={16} /> API Tester
        </div>
        <div className="flex rounded-lg shadow-sm w-full">
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 rounded-l-lg font-mono text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="https://api.example.com/data"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-r-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200 dark:shadow-none"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Envoyer
          </button>
        </div>
      </div>
      
      <div className="p-0 bg-[#0d1117] min-h-[300px] relative font-mono text-sm">
        {status !== null && (
          <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-bold border ${
            status >= 200 && status < 300 
              ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
              : 'bg-red-900/30 text-red-400 border-red-800'
          }`}>
            Status: {status}
          </div>
        )}
        <pre className="p-4 text-slate-300 overflow-auto max-h-[400px] leading-relaxed">
          {response || <span className="text-slate-600 italic">// En attente de la requête...</span>}
        </pre>
      </div>
    </div>
  );
}
