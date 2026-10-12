import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, Filter, DollarSign, Calendar, FileText, CheckCircle } from 'lucide-react';
import { ScholarshipScheme } from '../../data/database.ts';
import { fetchScholarships } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface ScholarshipsViewProps {
  currentLang: SupportedLanguage;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({ currentLang }) => {
  const [scholarships, setScholarships] = useState<ScholarshipScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [familyIncomeInput, setFamilyIncomeInput] = useState<number>(350000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
  }, [selectedCategory]);

  const loadScholarships = async () => {
    try {
      setIsLoading(true);
      const data = await fetchScholarships(selectedCategory !== 'All' ? selectedCategory : undefined);
      setScholarships(data);
    } catch (err) {
      console.error('Failed to load scholarships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="theme-card-elevated rounded-3xl p-6 sm:p-8 mb-8 border theme-border-default shadow-xl relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Zero Financial Dropouts Mission (SIH 2025)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Government Scholarships & Financial Aid Hub
          </h2>
          <p className="theme-text-secondary text-xs sm:text-sm mt-2 leading-relaxed">
            Financial hardship is the #1 cause behind 42.7 lakh students discontinuing education. Discover 100% subsidized government schemes including PMSSS for J&K, Central Sector, and Pragati Girls Aid.
          </p>
        </div>
      </div>

      {/* Filter and Income Checker Bar */}
      <div className="theme-card rounded-2xl p-5 border theme-border-subtle shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
              Filter by Target Group
            </label>
            <select
              aria-label="Filter by scholarship target group"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
            >
              <option value="All" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All Categories & Schemes</option>
              <option value="J&K" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">J&K / Ladakh Domicile (PMSSS)</option>
              <option value="Girls" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Girls in STEM / Polytechnic</option>
              <option value="SC" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">SC / ST / OBC Affirmative Action</option>
              <option value="Merit" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Merit-cum-Means Top Percentile</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
              Your Annual Family Income (₹{familyIncomeInput.toLocaleString()})
            </label>
            <input
              type="range"
              min={50000}
              max={1000000}
              step={25000}
              value={familyIncomeInput}
              onChange={e => setFamilyIncomeInput(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            <div className="flex justify-between text-[11px] theme-text-muted mt-0.5 font-mono">
              <span>₹50,000/yr</span>
              <span>₹4.5 Lakh</span>
              <span>₹8 Lakh (PMSSS Ceiling)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs theme-text-muted">
          Loading verified government scholarship schemes...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scholarships.map(sch => {
            const isIncomeEligible = familyIncomeInput <= sch.maxAnnualFamilyIncome;

            return (
              <div
                key={sch.id}
                className="theme-card rounded-3xl p-6 border theme-border-subtle shadow-xs hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider theme-badge-accent px-2.5 py-0.5 rounded-full">
                      {sch.provider}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isIncomeEligible
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isIncomeEligible ? '✓ Income Eligible' : 'Above Income Limit'}
                    </span>
                  </div>

                  <h3 className="text-base font-black font-heading leading-snug mb-2">
                    {sch.title}
                  </h3>

                  {/* Financial Coverage Metric */}
                  <div className="theme-card-subtle border theme-border-default rounded-xl p-3.5 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase theme-text-accent">
                        Annual Financial Aid
                      </div>
                      <div className="text-lg font-black font-mono">
                        Up to ₹{sch.scholarshipAmountAnnual.toLocaleString()} / year
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] theme-text-muted">Income Limit:</div>
                      <div className="text-xs font-bold font-mono">
                        &lt; ₹{(sch.maxAnnualFamilyIncome / 100000).toFixed(1)} Lakh/yr
                      </div>
                    </div>
                  </div>

                  <p className="text-xs theme-text-secondary mb-4 leading-relaxed">
                    {sch.keyBenefits}
                  </p>

                  {/* Documents Required */}
                  <div className="space-y-1.5 mb-5 text-[11px] theme-text-secondary">
                    <div className="font-bold flex items-center gap-1.5 theme-text-accent">
                      <FileText className="w-3.5 h-3.5" />
                      Required Verification Documents:
                    </div>
                    {sch.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t theme-border-subtle">
                  <div className="text-[11px] theme-text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Apply before: <strong className="font-mono">{sch.applicationDeadline}</strong></span>
                  </div>

                  <a
                    href={sch.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 theme-btn-primary font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
