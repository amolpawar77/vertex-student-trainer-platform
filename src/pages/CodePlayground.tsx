import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Download, Terminal, Code2 } from 'lucide-react';

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to Vertex IT Hub Code Playground
// Write your JavaScript code here

function greet(name) {
  return "Hello, " + name + "! Welcome to Vertex IT Hub.";
}

console.log(greet("Student"));

// Try some math
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum of numbers:", sum);
`);

  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Mocking execution for now
    setTimeout(() => {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      };

      try {
        // eslint-disable-next-line no-eval
        eval(code);
        setOutput(logs.length > 0 ? logs : ["Code executed successfully (no output)"]);
      } catch (err) {
        setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
      } finally {
        console.log = originalLog;
        setIsRunning(false);
      }
    }, 500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Code2 className="text-primary" />
            Code Playground
          </h1>
          <p className="text-slate-500">Practice your coding skills in a safe environment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCode('')}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
            title="Clear Code"
          >
            <RotateCcw size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Copy Code">
            <Copy size={20} />
          </button>
          <button 
            onClick={runCode}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
              isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
            }`}
          >
            <Play size={18} fill="currentColor" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl">
          <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs font-mono text-slate-400">main.js</span>
            </div>
            <span className="text-xs font-mono text-slate-500">JavaScript</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 p-6 font-mono text-sm focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Terminal size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Console Output</span>
            </div>
            <button 
              onClick={() => setOutput([])}
              className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-slate-50/50">
            {output.length === 0 ? (
              <p className="text-slate-400 italic">No output yet. Click 'Run Code' to see results.</p>
            ) : (
              <div className="space-y-2">
                {output.map((line, i) => (
                  <div key={i} className={`flex gap-3 ${line.startsWith('Error') ? 'text-red-500' : 'text-slate-700'}`}>
                    <span className="text-slate-300 select-none">{'>'}</span>
                    <pre className="whitespace-pre-wrap break-all">{line}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
