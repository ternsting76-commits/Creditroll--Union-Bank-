import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'red' | 'glass' | 'light';
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'red',
}) => {
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);

  const getButtonStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20';
      case 'light':
        return 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200';
      case 'red':
      default:
        return 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-md shadow-rose-900/20';
    }
  };

  return (
    <div className={`relative inline-block text-left z-40 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${getButtonStyles()}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{selected.flag}</span>
        <span>{selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-40 py-1.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Select Language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelected(lang);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                  selected.code === lang.code
                    ? 'bg-rose-50 text-rose-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {selected.code === lang.code && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
