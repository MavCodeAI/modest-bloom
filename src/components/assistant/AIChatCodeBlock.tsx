import React, { useState } from 'react';
import Prism from 'prismjs';
// Import common languages for Prism syntax highlighting
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Check } from 'lucide-react';

interface AIChatCodeBlockProps {
  language?: string;
  code: string;
}

export const AIChatCodeBlock: React.FC<AIChatCodeBlockProps> = ({
  language = 'text',
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Resolve Prism language grammar
  const langKey = language.toLowerCase();
  const grammar =
    Prism.languages[langKey] ||
    (langKey === 'js' ? Prism.languages.javascript : null) ||
    (langKey === 'ts' ? Prism.languages.typescript : null) ||
    (langKey === 'sh' || langKey === 'shell' ? Prism.languages.bash : null) ||
    (langKey === 'py' ? Prism.languages.python : null) ||
    Prism.languages.text;

  const highlightedHtml = grammar
    ? Prism.highlight(code, grammar, langKey)
    : code;

  const displayLang = language ? language.toUpperCase() : 'CODE';

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border/80 bg-[#1e1e1e] text-stone-200 shadow-md font-mono text-xs">
      {/* Code Block Header with Language Badge & Copy Button */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-stone-800 text-stone-400 select-none">
        <span className="text-[11px] font-semibold tracking-wider text-amber-300/90 font-mono">
          {displayLang}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-stone-300 hover:text-white hover:bg-stone-700/70 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-3.5 max-h-96">
        <pre className="!bg-transparent !p-0 !m-0 font-mono text-[12px] leading-relaxed">
          <code
            className={`language-${langKey} !bg-transparent !p-0 !m-0`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};
