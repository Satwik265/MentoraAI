import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroStats } from './components/HeroStats.tsx';
import { AssessmentEngine } from './components/AssessmentEngine.tsx';
import { CollegeDirectory } from './components/CollegeDirectory.tsx';
import { CutoffPredictorModal } from './components/CutoffPredictorModal.tsx';
import { AdmissionTrackerView } from './components/AdmissionTrackerView.tsx';
import { AiCounselorChat } from './components/AiCounselorChat.tsx';
import { AlumniNetworkView } from './components/AlumniNetworkView.tsx';
import { ScholarshipsView } from './components/ScholarshipsView.tsx';
import { FeedbackSurveysView } from './components/FeedbackSurveysView.tsx';
import { ResearchMatrixModal } from './components/ResearchMatrixModal.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { SupportedLanguage } from './translations.ts';
import { College } from '../data/database.ts';
import { Award, BookOpen, Heart, ShieldCheck, Download, WifiOff } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<string>('colleges');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Profile
  const [studentProfile, setStudentProfile] = useState({
    name: 'Aamir Lone',
    classGrade: 'Class 10 Student',
    state: 'Jammu & Kashmir',
    category: 'GEN',
    targetStream: 'Artificial Intelligence & Engineering',
  });

  // Modals
  const [showResearchModal, setShowResearchModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPredictorModal, setShowPredictorModal] = useState<boolean>(false);
  const [selectedCollegeForPredictor, setSelectedCollegeForPredictor] = useState<College | null>(null);
  const [selectedCourseIdForPredictor, setSelectedCourseIdForPredictor] = useState<string | undefined>(undefined);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [initialStreamFilter, setInitialStreamFilter] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Offline cache initialization
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mentora_student_profile');
      if (savedProfile) {
        setStudentProfile(JSON.parse(savedProfile));
      }
    } catch {
      // LocalStorage non-fatal
    }
  }, []);

  const handleSaveProfile = (updated: typeof studentProfile) => {
    setStudentProfile(updated);
    try {
      localStorage.setItem('mentora_student_profile', JSON.stringify(updated));
    } catch {}
    showToast('Student profile updated successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPredictor = (college?: College, courseId?: string) => {
    setSelectedCollegeForPredictor(college || null);
    setSelectedCourseIdForPredictor(courseId);
    setShowPredictorModal(true);
  };

  const handleAskAiWithContext = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const handleNavigateToCollegesWithStream = (stream?: string) => {
    setInitialStreamFilter(stream);
    setActiveTab('colleges');
  };

  // Download complete offline guide (USP for remote areas)
  const handleDownloadOfflineGuide = () => {
    const offlineGuideContent = `=====================================================
MENTORAAI: ONE-STOP PERSONALIZED CAREER & EDUCATION ADVISOR
Smart India Hackathon 2025 | Problem Statement ID: 25094
Team: Code Jesters (PCU15) | Theme: Smart Education
=====================================================

1. PROBLEM FACED (UDISE+ & UGC REPORT 2024-25):
- 11.5% national dropout rate after class 10 (approx 42.7 lakh students discontinued).
- 68% of government colleges face enrollment challenges due to lack of awareness.
- Wrong stream selection is the primary cause of dropouts.

2. GOVERNMENT SUBSIDIZED PATHWAYS:
A. Polytechnic 3-Year Diplomas (After Class 10):
   - Annual fees: ₹4,800 to ₹10,000 / year.
   - Immediate technical employment or Direct Lateral Entry to 2nd year B.Tech!
   - Top Colleges: Govt Polytechnic Srinagar, Govt Polytechnic Jammu.

B. Engineering (B.Tech):
   - IIT Delhi, NIT Srinagar, COEP Pune.
   - Admission via JEE Main / JoSAA.

C. Medical & Healthcare:
   - GMC Jammu, AIIMS.
   - Highly subsidized government medical fees (<₹30,000/yr).

3. KEY GOVERNMENT SCHOLARSHIPS:
A. PMSSS (Prime Minister's Special Scholarship Scheme for J&K/Ladakh):
   - 100% academic fees reimbursed to college + ₹1,00,000/year hostel/maintenance allowance.
   - Income ceiling: < ₹8.00 Lakhs / annum.
   - Portal: https://aicte-jk-scholarship-gov.in

B. Central Sector Scheme of Scholarship:
   - Direct DBT into bank account for top 20th percentile students.
   - Portal: https://scholarships.gov.in

C. AICTE Pragati Scholarship for Girls:
   - ₹50,000/year for girls in engineering or polytechnic diplomas.

Report Generated for: ${studentProfile.name} (${studentProfile.classGrade})
Location: ${studentProfile.state}
Date: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([offlineGuideContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MentoraAI_Career_Guide_${studentProfile.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Offline Career & College Guide downloaded!');
  };

  return (
    <div className="min-h-screen theme-page-bg flex flex-col font-sans transition-colors">
      {/* Header with TTS & Multi-language & Theme Switcher */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOffline={isOffline}
        onToggleOffline={() => {
          setIsOffline(prev => !prev);
          showToast(!isOffline ? 'Switched to Simulated Offline Cache Mode' : 'Connected to Live Server Mode');
        }}
        studentProfile={studentProfile}
        onEditProfile={() => setShowProfileModal(true)}
        onOpenResearch={() => setShowResearchModal(true)}
      />

      {/* Hero Stats (SIH Problem Statement 25094) */}
      <HeroStats
        currentLang={currentLang}
        onStartAssessment={() => setActiveTab('assessment')}
        onExploreColleges={() => setActiveTab('colleges')}
        onOpenPredictor={() => handleOpenPredictor()}
        onOpenChat={() => setActiveTab('chat')}
        onDownloadGuide={handleDownloadOfflineGuide}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 pb-16">
        {activeTab === 'assessment' && (
          <AssessmentEngine
            currentLang={currentLang}
            onNavigateToColleges={handleNavigateToCollegesWithStream}
            onAskAiWithContext={handleAskAiWithContext}
            studentId="demo-student"
          />
        )}

        {activeTab === 'colleges' && (
          <CollegeDirectory
            currentLang={currentLang}
            onOpenPredictor={handleOpenPredictor}
            onApplicationAdded={() => showToast('Application added to your Admission Tracker!')}
            initialStreamFilter={initialStreamFilter}
          />
        )}

        {activeTab === 'predictor' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <CutoffPredictorModal
              initialCollege={null}
              onClose={() => setActiveTab('colleges')}
              onApplicationTracked={() => {
                showToast('Admission application saved to tracker!');
                setActiveTab('timeline');
              }}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <AdmissionTrackerView
            currentLang={currentLang}
            studentId="demo-student"
          />
        )}

        {activeTab === 'chat' && (
          <AiCounselorChat
            currentLang={currentLang}
            studentProfile={studentProfile}
            initialPrompt={chatInitialPrompt}
          />
        )}

        {activeTab === 'alumni' && (
          <AlumniNetworkView currentLang={currentLang} />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsView currentLang={currentLang} />
        )}

        {activeTab === 'feedback' && (
          <FeedbackSurveysView currentLang={currentLang} />
        )}
      </main>

      {/* Predictor Modal (when opened from college card) */}
      {showPredictorModal && (
        <CutoffPredictorModal
          initialCollege={selectedCollegeForPredictor}
          initialCourseId={selectedCourseIdForPredictor}
          onClose={() => {
            setShowPredictorModal(false);
            setSelectedCollegeForPredictor(null);
          }}
          onApplicationTracked={() => {
            setShowPredictorModal(false);
            showToast('Application successfully added to Admission Tracker!');
            setActiveTab('timeline');
          }}
        />
      )}

      {/* Research & NEP 2020 Modal */}
      {showResearchModal && (
        <ResearchMatrixModal onClose={() => setShowResearchModal(false)} />
      )}

      {/* Student Profile Switcher Modal */}
      {showProfileModal && (
        <StudentProfileModal
          currentProfile={studentProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 theme-modal-card text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border theme-border-default animate-in fade-in slide-in-from-bottom-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[var(--bg-footer)] border-t theme-border-subtle py-12 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-base font-heading">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span>Mentora<span className="theme-text-accent">AI</span>: Because Every Student Deserves a Mentor</span>
            </div>
            <p className="theme-text-secondary leading-relaxed max-w-lg text-[11px]">
              Developed for <strong>Smart India Hackathon 2025</strong> • Problem Statement ID: <strong>25094</strong> (One-Stop Personalized Career & Education Advisor).
              Built by Team <strong>Code Jesters</strong> (Team ID: PCU15) under the theme <em>Smart Education</em>.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="theme-badge-subtle px-2.5 py-1 rounded-md font-semibold">NEP 2020 Compliant</span>
              <span className="theme-badge-subtle px-2.5 py-1 rounded-md font-semibold">UDISE+ 2024-25 Calibrated</span>
              <span className="theme-badge-subtle px-2.5 py-1 rounded-md font-semibold">PMSSS J&K Verified</span>
            </div>
          </div>

          <div>
            <div className="font-bold mb-3 text-xs uppercase tracking-wider theme-text-accent">
              Advisory Ecosystem
            </div>
            <ul className="space-y-2 text-[11px] theme-text-secondary">
              <li>
                <button onClick={() => setActiveTab('assessment')} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • Scientific Aptitude Assessment
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('colleges')} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • Government College Seat Tracker
                </button>
              </li>
              <li>
                <button onClick={() => handleOpenPredictor()} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • Cutoff & Rank Probability Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('timeline')} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • JoSAA, NEET & State Counseling Timelines
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold mb-3 text-xs uppercase tracking-wider theme-text-accent">
              Inclusivity & Citations
            </div>
            <ul className="space-y-2 text-[11px] theme-text-secondary">
              <li>
                <button onClick={() => setShowResearchModal(true)} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • Shiksha & Mindler Comparative Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('scholarships')} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • PMSSS & Central Sector Aid Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('alumni')} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer">
                  • Rural J&K Alumni Network
                </button>
              </li>
              <li>
                <button onClick={handleDownloadOfflineGuide} className="hover:text-[var(--text-primary)] hover:translate-x-0.5 transition-all cursor-pointer flex items-center gap-1.5 font-bold">
                  <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Download Offline Guide (TXT)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t theme-border-subtle flex flex-wrap items-center justify-between gap-3 text-[11px] theme-text-muted">
          <div>
            &copy; 2025 MentoraAI • Code Jesters (PCU15) • Smart India Hackathon. Dedicated to reducing student dropout rates.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> Real-time Subsidized Government Data
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
