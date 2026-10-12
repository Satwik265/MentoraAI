import React from 'react';
import { ArrowRight, Sparkles, TrendingDown, Users, Building, ShieldCheck, Download, HelpCircle, Compass, Target } from 'lucide-react';
import { SupportedLanguage, translations } from '../translations.ts';

interface HeroStatsProps {
  currentLang: SupportedLanguage;
  onStartAssessment: () => void;
  onExploreColleges: () => void;
  onOpenPredictor: () => void;
  onOpenChat: () => void;
  onDownloadGuide: () => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  currentLang,
  onStartAssessment,
  onExploreColleges,
  onOpenPredictor,
  onOpenChat,
  onDownloadGuide,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div
      className="relative overflow-hidden border-b theme-border-subtle pt-8 pb-14 px-4 sm:px-6 transition-colors"
      style={{
        background: 'linear-gradient(180deg, var(--bg-hero-start) 0%, var(--bg-hero-end) 100%)',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        className="absolute top-0 right-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />
      <div
        className="absolute bottom-0 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Tag & SIH Context */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Empowering 2.5M+ Youth in J&K & Underserved Regions Across India
          </span>
          <span className="text-xs theme-text-muted font-medium">
            National Education Policy (NEP 2020) Calibrated Digital Framework
          </span>
        </div>

        {/* Main Headline & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight mb-4">
              Mentora<span className="theme-text-accent">AI</span>: {t.heroHeadline}
            </h1>
            <p className="text-base sm:text-lg theme-text-secondary font-normal leading-relaxed max-w-3xl mb-7">
              {t.heroSubheadline}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onStartAssessment}
                className="flex items-center gap-2 theme-btn-primary px-5 py-3 rounded-xl text-sm transition-all cursor-pointer font-bold"
              >
                <span>{t.heroTakeAssessmentBtn}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onExploreColleges}
                className="flex items-center gap-2 theme-btn-secondary px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <Building className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{t.heroFindCollegesBtn}</span>
              </button>

              <button
                onClick={onOpenPredictor}
                className="flex items-center gap-2 theme-btn-secondary px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Cutoff Predictor</span>
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 theme-card-subtle hover:border-[var(--accent-border)] border theme-border-default px-3.5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Ask AI Advisor</span>
              </button>

              <button
                onClick={onDownloadGuide}
                title="Download offline-compatible Career & Government College Guide"
                className="flex items-center gap-1.5 text-xs theme-text-muted hover:text-[var(--text-primary)] px-3 py-2.5 rounded-xl border theme-border-subtle hover:theme-border-default transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{t.downloadOfflineReport}</span>
              </button>
            </div>
          </div>

          {/* Right Card: Critical Problem Faced (SIH Slide 2) */}
          <div className="lg:col-span-4 theme-card-elevated rounded-3xl p-6 border theme-border-default shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b theme-border-subtle pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider theme-text-accent flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                The Problem Faced
              </span>
              <span className="text-[11px] theme-text-muted font-mono font-medium">UDISE+ & UGC 2024</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-black text-sm">
                  11.5%
                </div>
                <div>
                  <div className="text-xs font-bold">National Dropout Rate</div>
                  <div className="text-[11px] theme-text-secondary mt-0.5 leading-snug">
                    Stands at ~11.5% after Class 10 alone for academic year 2024-25.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-black text-xs">
                  42.7L
                </div>
                <div>
                  <div className="text-xs font-bold">Youth Discontinued Education</div>
                  <div className="text-[11px] theme-text-secondary mt-0.5 leading-snug">
                    Smart students drop out due to misinformed stream selection and zero career counseling.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 theme-card-subtle border theme-border-default rounded-2xl p-3.5">
                <div className="w-9 h-9 rounded-xl theme-btn-primary flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                  68%
                </div>
                <div>
                  <div className="text-xs font-bold">Govt Colleges Face Vacancies</div>
                  <div className="text-[11px] theme-text-secondary mt-0.5 leading-snug">
                    UGC audit revealed 68% subsidized seats remain unfilled due to awareness gap.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t theme-border-subtle flex items-center justify-between text-[11px] theme-text-muted">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> MentoraAI Solution Ready
              </span>
              <span className="font-medium">100% Subsidized Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
