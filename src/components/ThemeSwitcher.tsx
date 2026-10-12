import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme, ThemeMode, THEME_CONFIGS } from '../context/ThemeContext.tsx';

interface ThemeSwitcherProps {
  compact?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const { theme, setTheme, config, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Change theme. Current theme is ${config.name}`}
        title={`Change visual theme (Currently: ${config.name})`}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer theme-btn-secondary"
      >
        <span className="flex items-center gap-1.5">
          {/* Swatch indicator */}
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0 flex items-center justify-center text-[8px]"
            style={{
              backgroundColor: config.primaryColor,
              boxShadow: `0 0 8px ${config.primaryColor}55`,
            }}
          />
          <span className="hidden sm:inline font-bold">{config.name}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 theme-dropdown-menu shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b theme-border-subtle mb-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-[var(--accent-primary)]" />
              Theme Selection
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              Instant styling across all tools & dashboards
            </div>
          </div>

          <div className="space-y-1">
            {availableThemes.map(t => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'theme-selected-item font-bold shadow-xs'
                      : 'theme-menu-item'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Visual Color Swatch */}
                    <div
                      className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden"
                      style={{
                        backgroundColor: t.bgColor,
                        borderColor: t.borderColor,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                    </div>

                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{t.icon}</span>
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[10px] opacity-70">
                        {t.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: t.primaryColor }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t theme-border-subtle px-2 text-[10px] opacity-60 text-center">
            Persisted in localStorage • 100% Contrast Verified
          </div>
        </div>
      )}
    </div>
  );
};
