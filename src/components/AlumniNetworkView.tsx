import React, { useState, useEffect } from 'react';
import { Award, Briefcase, GraduationCap, MapPin, MessageSquare, Send, Check, Sparkles } from 'lucide-react';
import { AlumniProfile } from '../../data/database.ts';
import { fetchAlumni, sendAlumniInquiry } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface AlumniNetworkViewProps {
  currentLang: SupportedLanguage;
}

export const AlumniNetworkView: React.FC<AlumniNetworkViewProps> = ({ currentLang }) => {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAlumniForModal, setActiveAlumniForModal] = useState<AlumniProfile | null>(null);
  const [studentName, setStudentName] = useState('Aamir Lone');
  const [studentClass, setStudentClass] = useState('Class 10 Student');
  const [studentMessage, setStudentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAlumni();
      setAlumniList(data);
    } catch (err) {
      console.error('Failed to load alumni stories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlumniForModal || !studentMessage) return;

    try {
      setIsSubmitting(true);
      await sendAlumniInquiry(activeAlumniForModal.id, studentName, studentClass, studentMessage);
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setActiveAlumniForModal(null);
        setStudentMessage('');
      }, 2500);
    } catch (err) {
      console.error('Failed to send inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Intro Header */}
      <div className="theme-card-elevated rounded-3xl p-6 sm:p-8 mb-8 border theme-border-default shadow-xl relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Positive Role Models & Community Inspiration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Alumni Success Stories: From Dropout Risk to Industry Leaders
          </h2>
          <p className="theme-text-secondary text-xs sm:text-sm mt-2 leading-relaxed">
            Real stories of students from rural J&K and tier-3 towns who faced financial hurdles, utilized government colleges and scholarships, and built fulfilling careers. Connect with them for direct advice.
          </p>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs theme-text-muted">
          Loading alumni role models...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alumniList.map(alumni => (
            <div
              key={alumni.id}
              className="theme-card rounded-3xl p-6 border theme-border-subtle shadow-xs hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={alumni.avatarUrl}
                    alt={alumni.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 shadow-xs shrink-0"
                    style={{ borderColor: 'var(--accent-primary)' }}
                  />
                  <div>
                    <h3 className="text-base font-black font-heading">
                      {alumni.name}
                    </h3>
                    <div className="text-xs font-bold theme-text-accent flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {alumni.currentRole} • {alumni.currentOrganization}
                    </div>
                    <div className="text-[11px] theme-text-muted flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                      <span>From: {alumni.originRegion}</span>
                    </div>
                  </div>
                </div>

                {/* College & Degree Badge */}
                <div className="theme-card-subtle border theme-border-subtle rounded-xl p-3 text-xs mb-4">
                  <div className="theme-text-muted text-[10px]">Alma Mater:</div>
                  <div className="font-bold">
                    {alumni.collegeAttended} — {alumni.degree} (Class of {alumni.passoutYear})
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-3 mb-5 text-xs theme-text-secondary leading-relaxed">
                  <p>
                    <strong className="text-[var(--text-primary)] font-bold">The Journey:</strong> {alumni.story}
                  </p>

                  <div className="p-3 theme-card-subtle border border-amber-500/30 rounded-xl">
                    <strong className="text-amber-500 font-bold block mb-0.5">
                      How Dropout Risk Was Overcome:
                    </strong>
                    {alumni.overcomingDropoutRisk}
                  </div>

                  <div className="p-3 theme-card-subtle border-l-4 rounded-xl italic" style={{ borderLeftColor: 'var(--accent-primary)' }}>
                    "{alumni.keyAdvice}"
                  </div>
                </div>

                {/* Mentorship Topics */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {alumni.mentorshipTopics.map((topic: string, i: number) => (
                    <span
                      key={i}
                      className="theme-badge-subtle font-semibold text-[10px] px-2 py-0.5 rounded-md"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveAlumniForModal(alumni)}
                className="w-full theme-btn-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask {alumni.name.split(' ')[0]} a Question</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      {activeAlumniForModal && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-modal-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border theme-border-default">
            <div className="flex items-center justify-between pb-3 border-b theme-border-subtle mb-4">
              <div>
                <span className="text-xs font-bold uppercase theme-text-accent">Alumni Mentorship</span>
                <h4 className="text-base font-black font-heading mt-0.5">
                  Message {activeAlumniForModal.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveAlumniForModal(null)}
                className="opacity-60 hover:opacity-100 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center text-emerald-500 space-y-2">
                <Check className="w-10 h-10 mx-auto text-emerald-500 bg-emerald-500/15 p-2 rounded-full border border-emerald-500/30" />
                <div className="font-bold text-base">Inquiry Submitted Successfully!</div>
                <p className="text-xs theme-text-muted">
                  {activeAlumniForModal.name} has been notified and will reply to your student inbox within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold theme-text-secondary mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      className="w-full theme-input rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold theme-text-secondary mb-1">Current Class / Degree</label>
                    <input
                      type="text"
                      required
                      value={studentClass}
                      onChange={e => setStudentClass(e.target.value)}
                      className="w-full theme-input rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold theme-text-secondary mb-1">
                    Your Question or Career Dilemma
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about exam preparation, hostel life, how they managed fees with PMSSS, or tips for cracking interviews..."
                    value={studentMessage}
                    onChange={e => setStudentMessage(e.target.value)}
                    className="w-full theme-input rounded-xl p-3 focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveAlumniForModal(null)}
                    className="px-4 py-2 rounded-xl theme-btn-ghost cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 theme-btn-primary font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Mentorship Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
