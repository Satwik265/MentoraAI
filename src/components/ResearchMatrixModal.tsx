import React from 'react';
import { Award, BookOpen, Check, X, ShieldCheck, ExternalLink, BarChart3 } from 'lucide-react';

interface ResearchMatrixModalProps {
  onClose: () => void;
}

export const ResearchMatrixModal: React.FC<ResearchMatrixModalProps> = ({ onClose }) => {
  const comparisonData = [
    { feature: 'Smart Dynamic Assessments', mentora: true, shiksha: false, career360: false, mindler: true, collegedisha: true },
    { feature: 'AI-Powered Analysis (Career Suggestions)', mentora: true, shiksha: false, career360: false, mindler: true, collegedisha: false },
    { feature: 'Personalized College Suggestions', mentora: true, shiksha: true, career360: true, mindler: true, collegedisha: true },
    { feature: 'Admission Tracking & Timeline Portal', mentora: true, shiksha: false, career360: false, mindler: false, collegedisha: false },
    { feature: 'Cost Efficient (Free / Zero Paywall)', mentora: true, shiksha: true, career360: true, mindler: false, collegedisha: false, notes: 'Mindler is ₹5,000-₹20,000 per student' },
    { feature: 'Alumni Network & Success Stories', mentora: true, shiksha: true, career360: true, mindler: false, collegedisha: false },
    { feature: 'Multi-lingual Interface (7 Indian Languages)', mentora: true, shiksha: false, career360: false, mindler: false, collegedisha: false },
    { feature: 'Text to Speech for Visually Impaired Learners', mentora: true, shiksha: false, career360: false, mindler: false, collegedisha: false },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="theme-modal-card rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border theme-border-default">
        <div className="flex items-center justify-between pb-4 border-b theme-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl theme-badge-accent font-bold flex items-center justify-center">
              <Award className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider theme-text-accent">
                Smart India Hackathon 2025 • Slide 6 Architecture
              </span>
              <h3 className="text-xl font-black font-heading">
                Research, References & Competitive Matrix
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 p-1 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Comparison Table */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 theme-text-secondary">
            <BarChart3 className="w-4 h-4 text-[var(--accent-primary)]" />
            Comparison with Existing Educational Advisory Systems:
          </div>

          <div className="overflow-x-auto rounded-2xl border theme-border-subtle">
            <table className="w-full text-xs text-left">
              <thead className="theme-card-elevated text-[11px] uppercase tracking-wider border-b theme-border-subtle">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3 text-center font-bold theme-badge-accent">MentoraAI</th>
                  <th className="p-3 text-center theme-text-muted">Shiksha</th>
                  <th className="p-3 text-center theme-text-muted">Career360</th>
                  <th className="p-3 text-center theme-text-muted">Mindler</th>
                  <th className="p-3 text-center theme-text-muted">Collegedisha</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-subtle">
                {comparisonData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-transparent' : 'theme-card-subtle'}>
                    <td className="p-3 font-semibold">{row.feature}</td>
                    <td className="p-3 text-center bg-[var(--accent-subtle)] font-bold">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px]">
                        ✓
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {row.shiksha ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="text-rose-400 font-bold">✕</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.career360 ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="text-rose-400 font-bold">✕</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.mindler ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="text-rose-400 font-bold">✕</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.collegedisha ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="text-rose-400 font-bold">✕</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* References & NEP 2020 Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl theme-card-subtle border theme-border-subtle">
            <h4 className="font-bold mb-2 flex items-center gap-1.5 theme-text-accent">
              <BookOpen className="w-4 h-4" />
              National Education Policy (NEP 2020)
            </h4>
            <p className="leading-relaxed theme-text-secondary">
              Aligns directly with Sections <strong>23.3 & 23.5</strong> on digital education and career guidance emphasis. Provides multi-disciplinary credit flexibility, recognition of polytechnic lateral entry, and native language instruction.
            </p>
          </div>

          <div className="p-4 rounded-2xl theme-card-subtle border theme-border-subtle">
            <h4 className="font-bold mb-2 flex items-center gap-1.5 text-amber-500">
              <ShieldCheck className="w-4 h-4" />
              Government Data Source Citations
            </h4>
            <ul className="space-y-1.5 theme-text-secondary">
              <li>• <strong>UDISE+ 2024-25:</strong> 11.5% post-class 10 dropout (42.7 Lakh students).</li>
              <li>• <strong>UGC Report 2024 (pg 22-28):</strong> 68% of government colleges face enrollment challenges.</li>
              <li>• <strong>Market Valuation:</strong> Career counselling market at ₹5,000 Cr to reach ₹14,000 Cr by 2035.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 theme-btn-primary font-bold rounded-xl text-xs cursor-pointer shadow-xs"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
