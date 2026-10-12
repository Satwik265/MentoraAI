import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Wifi, WifiOff, Award, User, Sparkles, BookOpen } from 'lucide-react';
import { SupportedLanguage, translations } from '../translations.ts';
import { synthesizeSpeech } from '../services/api.ts';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  studentProfile: {
    name: string;
    classGrade: string;
    state: string;
    category: string;
    targetStream: string;
  };
  onEditProfile: () => void;
  onOpenResearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  isOffline,
  onToggleOffline,
  studentProfile,
  onEditProfile,
  onOpenResearch,
}) => {
  const t = translations[currentLang] || translations.en;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeAudioObj, setActiveAudioObj] = useState<HTMLAudioElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (activeAudioObj) {
        activeAudioObj.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeAudioObj]);

  const handleReadAloud = async () => {
    if (isPlayingAudio) {
      if (activeAudioObj) {
        activeAudioObj.pause();
        setActiveAudioObj(null);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    // Text to read based on current tab
    const textToRead = `${t.appName}. ${t.tagline}. ${t.heroHeadline}. ${t.heroSubheadline}. Currently viewing ${activeTab} section. MentoraAI assists students across India to discover government colleges, predict cutoffs, and access scholarships to prevent discontinuation of education.`;

    try {
      const res = await synthesizeSpeech(textToRead);
      if (res.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`);
        audio.playbackRate = playbackSpeed;
        audio.onended = () => {
          setIsPlayingAudio(false);
          setActiveAudioObj(null);
        };
        audio.onerror = () => {
          fallbackWebSpeech(textToRead);
        };
        setActiveAudioObj(audio);
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    fallbackWebSpeech(textToRead);
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 theme-header shadow-xs">
      {/* Top Notification Bar for SIH Details */}
      <div className="bg-[var(--bg-page-secondary)] border-b theme-border-subtle text-[var(--text-secondary)] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 theme-btn-primary px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-extrabold shadow-2xs">
              <Award className="w-3 h-3" /> SIH 2025
            </span>
            <span className="font-medium text-xs">
              Problem Statement ID: <strong className="theme-text-accent font-bold">25094</strong> • Team <strong className="font-bold">Code Jesters</strong> (PCU15) • Smart Education
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenResearch}
              className="theme-text-accent hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              View SIH Research & Comparative Matrix
            </button>

            <button
              onClick={onToggleOffline}
              title="Toggle Simulated Offline Mode"
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${
                isOffline
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <span>{isOffline ? 'Offline Mode (Local Cache Active)' : 'Live Connected'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onTabChange('colleges')}>
            <div className="w-10 h-10 rounded-xl theme-btn-primary flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight font-heading">
                  Mentora<span className="theme-text-accent">AI</span>
                </span>
                <span className="hidden md:inline-block theme-badge-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Govt College Advisor
                </span>
              </div>
              <p className="text-xs theme-text-muted font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Tools: Voice Reader, Language, Theme Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Text-to-Speech Accessibility Bar */}
            <div className="flex items-center theme-card-subtle rounded-xl p-1 border theme-border-subtle">
              <button
                onClick={handleReadAloud}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                    : 'theme-btn-ghost hover:theme-text-accent'
                }`}
                title="Accessibility Voice Reader for Visually Impaired Learners"
                aria-label="Toggle text to speech voice reader"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                <span className="hidden lg:inline">
                  {isPlayingAudio ? t.stopAudio : t.heroVoiceReaderToggle}
                </span>
              </button>

              {/* Speed selector */}
              <select
                aria-label="Speech speed"
                value={playbackSpeed}
                onChange={e => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-[11px] font-semibold opacity-80 px-1 py-0.5 focus:outline-hidden cursor-pointer"
              >
                <option value={0.8} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">0.8x</option>
                <option value={1.0} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">1.0x</option>
                <option value={1.2} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">1.2x</option>
              </select>
            </div>

            {/* Language Switcher (7 Indian Languages) */}
            <div className="flex items-center theme-card-subtle rounded-xl px-2.5 py-1 border theme-border-subtle">
              <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)] mr-1.5 shrink-0" />
              <select
                aria-label="Select Language"
                value={currentLang}
                onChange={e => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="en" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">EN (English)</option>
                <option value="hi" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">हिंदी (Hindi)</option>
                <option value="ks" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">कॉशुर / Kashmiri</option>
                <option value="ur" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">اردو (Urdu)</option>
                <option value="pa" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="bn" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">বাংলা (Bengali)</option>
                <option value="mr" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">मराठी (Marathi)</option>
              </select>
            </div>

            {/* VISIBLE THEME SWITCHER */}
            <ThemeSwitcher />

            {/* Student Profile Quick Badge */}
            <button
              onClick={onEditProfile}
              className="flex items-center gap-1.5 theme-btn-secondary px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
              title="Edit Student Profile & Target Stream"
            >
              <User className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="hidden sm:inline font-bold">{studentProfile.name}</span>
              <span className="text-[10px] theme-badge-accent px-1.5 py-0.2 rounded font-mono font-bold">
                {studentProfile.classGrade}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1.5 overflow-x-auto pt-3 pb-1 border-t theme-border-subtle mt-2.5 text-xs scrollbar-none">
          {[
            { id: 'assessment', label: t.navAssessment, icon: '🧠' },
            { id: 'colleges', label: t.navColleges, icon: '🏛️' },
            { id: 'predictor', label: t.navPredictor, icon: '🎯' },
            { id: 'timeline', label: t.navTimeline, icon: '📅' },
            { id: 'chat', label: t.navAiMentor, icon: '💬' },
            { id: 'alumni', label: t.navAlumni, icon: '🌟' },
            { id: 'scholarships', label: t.navScholarships, icon: '💰' },
            { id: 'feedback', label: t.navFeedback, icon: '⭐' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'theme-btn-primary shadow-xs'
                  : 'theme-btn-ghost hover:theme-btn-secondary'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
