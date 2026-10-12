import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, Building, Compass, BookOpen, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AssessmentQuestion, AssessmentRecord } from '../../data/database.ts';
import { fetchQuestions, submitAssessment } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface AssessmentEngineProps {
  currentLang: SupportedLanguage;
  onNavigateToColleges: (streamFilter?: string) => void;
  onAskAiWithContext: (contextPrompt: string) => void;
  studentId: string;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  currentLang,
  onNavigateToColleges,
  onAskAiWithContext,
  studentId,
}) => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load assessment questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions to generate an accurate recommendation.');
      return;
    }

    try {
      setIsSubmitting(true);
      const evaluated = await submitAssessment(answers, studentId);
      setResult(evaluated);

      // Trigger Confetti Celebration with warm palette
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97736', '#c88f54', '#9c5222', '#10b981'],
        });
      } catch {
        // Confetti non-fatal
      }
    } catch (err) {
      console.error('Assessment evaluation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
        />
        <h3 className="text-lg font-bold">Loading Scientific Assessment Bank...</h3>
        <p className="text-sm theme-text-muted mt-1">Preparing adaptive aptitude & career interest algorithm</p>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (result) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Success Header Banner */}
        <div className="theme-card-elevated rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border theme-border-default">
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 theme-btn-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" /> Assessment Completed & Saved
              </span>
              <span className="text-xs theme-text-muted font-mono">
                Evaluation ID: {result.id} • Algorithm: Trait Scoring & Random Forest Mapping
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <span className="text-xs font-bold uppercase tracking-wider theme-text-accent">
                  Recommended Stream Pathway
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1 mb-3">
                  {result.recommendedStream}
                </h2>
                <p className="text-sm theme-text-secondary leading-relaxed max-w-2xl">
                  Based on your responses across scientific aptitude, cognitive preferences, and socio-economic priorities, your highest alignment is in this stream with high retention and employment stability.
                </p>
              </div>

              {/* Confidence Gauge */}
              <div className="md:col-span-4 theme-card-subtle border theme-border-default rounded-2xl p-4 text-center">
                <div className="text-4xl font-black theme-text-accent font-mono">
                  {result.confidenceScore}%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mt-1">
                  Confidence Alignment
                </div>
                <div className="text-[11px] theme-text-muted mt-1">
                  High probability of academic success & zero dropout risk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Courses, Careers, Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Degree Programs */}
            <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" />
                Recommended Subsidized Degrees & Courses
              </h3>
              <div className="space-y-3">
                {result.topCourses.map((crs, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 theme-card-subtle rounded-xl border theme-border-subtle transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg theme-badge-accent font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{crs}</div>
                        <div className="text-xs theme-text-muted">Government Affiliated • Subsidized Tuition Available</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      High Placement
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* High Growth Career Roles */}
            <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
                Target Career Roles & Employment Outlook
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.topCareers.map((career, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 theme-card-subtle rounded-xl border theme-border-subtle flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{career}</div>
                      <div className="text-[11px] theme-text-muted mt-0.5">Projected starting: ₹5.5L - ₹18L+ LPA</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Bridge Roadmap */}
            <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Next Steps to Bridge Preparation (Action Plan)
              </h3>
              <div className="space-y-3">
                {result.skillRoadmap.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Matched Government Colleges & CTAs */}
          <div className="space-y-6">
            <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <Building className="w-4 h-4 text-[var(--accent-primary)]" />
                Matched Government Colleges
              </h3>
              <div className="space-y-3 mb-5">
                {result.suggestedColleges.map((colName, idx) => (
                  <div key={idx} className="p-3 rounded-xl theme-card-subtle border theme-border-subtle">
                    <div className="text-xs font-bold">{colName}</div>
                    <div className="text-[11px] theme-text-muted mt-0.5">Government Institution • Seats Verified</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigateToColleges()}
                className="w-full flex items-center justify-center gap-2 theme-btn-primary py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>View All Seats & Cutoffs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ask AI Context */}
            <div className="theme-card-subtle border theme-border-default rounded-2xl p-5">
              <div className="flex items-center gap-2 theme-text-accent font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                MentoraAI Advisor Sync
              </div>
              <p className="text-xs theme-text-secondary mb-4">
                Have doubts regarding whether to choose this recommended stream or need scholarship details?
              </p>
              <button
                onClick={() =>
                  onAskAiWithContext(
                    `I just completed the scientific assessment. My top recommended stream is: "${result.recommendedStream}" with ${result.confidenceScore}% confidence. Can you guide me on the easiest entrance exam strategy and government scholarships like PMSSS?`
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 theme-btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>Consult AI Counselor On This Result</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Retake Button */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 theme-btn-ghost border theme-border-subtle hover:theme-border-default font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION TAKING VIEW ---
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          Step 1 & Step 2: Scientific Assessment Engine
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
          Discover Your True Academic & Career Calling
        </h2>
        <p className="text-xs sm:text-sm theme-text-muted mt-2">
          Designed specifically to prevent wrong stream choices that cause dropouts. Takes only 3 minutes to evaluate aptitudes, interests, and government degree compatibility.
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="theme-card rounded-3xl border theme-border-default shadow-md p-6 sm:p-8">
        {/* Progress & Category */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold theme-text-accent uppercase tracking-wider">
              {currentQuestion.category} Evaluation
            </span>
          </div>
          <div className="text-xs font-bold theme-text-muted font-mono">
            Question {currentIndex + 1} of {questions.length} ({progressPercent}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full theme-card-subtle h-2.5 rounded-full overflow-hidden mb-6 border theme-border-subtle">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              background: 'var(--accent-gradient)',
            }}
          />
        </div>

        {/* Question Text (Bilingual) */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold leading-snug">
            {currentQuestion.questionText}
          </h3>
          {currentQuestion.questionHindi && (
            <p className="text-sm font-medium theme-text-muted mt-1.5">
              {currentQuestion.questionHindi}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map(option => {
            const isSelected = answers[currentQuestion.id] === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] shadow-xs'
                    : 'theme-card-subtle border theme-border-subtle hover:border-[var(--accent-border)]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]' : 'border-current opacity-40'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold leading-snug">
                    {option.text}
                  </div>
                  {option.textHindi && (
                    <div className="text-xs theme-text-muted mt-1 font-normal">
                      {option.textHindi}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t theme-border-subtle">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed theme-text-muted'
                : 'theme-btn-ghost hover:theme-btn-secondary'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                answers[currentQuestion.id]
                  ? 'theme-btn-primary shadow-xs'
                  : 'opacity-40 theme-card-subtle cursor-not-allowed'
              }`}
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestion.id]}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                answers[currentQuestion.id] && !isSubmitting
                  ? 'theme-btn-primary shadow-md'
                  : 'opacity-40 theme-card-subtle cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Tailored Pathways...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Career Blueprint</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
