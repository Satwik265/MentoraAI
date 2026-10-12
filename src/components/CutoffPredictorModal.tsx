import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, DollarSign, Building } from 'lucide-react';
import { College } from '../../data/database.ts';
import { predictCutoff, createApplication, fetchColleges } from '../services/api.ts';

interface CutoffPredictorModalProps {
  initialCollege?: College | null;
  initialCourseId?: string;
  onClose: () => void;
  onApplicationTracked: () => void;
}

export const CutoffPredictorModal: React.FC<CutoffPredictorModalProps> = ({
  initialCollege,
  initialCourseId,
  onClose,
  onApplicationTracked,
}) => {
  const [collegesList, setCollegesList] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(initialCollege?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || '');
  const [scoreType, setScoreType] = useState<'percentage' | 'rank'>('rank');
  const [studentScore, setStudentScore] = useState<number>(32000);
  const [category, setCategory] = useState<'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS'>('GEN');
  const [quota, setQuota] = useState<'AI' | 'HS' | 'OS'>('HS');
  const [isCalculating, setIsCalculating] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  useEffect(() => {
    loadAllColleges();
  }, []);

  const loadAllColleges = async () => {
    try {
      const data = await fetchColleges();
      setCollegesList(data);
      if (!selectedCollegeId && data.length > 0) {
        setSelectedCollegeId(data[0].id);
        setSelectedCourseId(data[0].courses[0]?.id || '');
      }
    } catch (err) {
      console.error('Error fetching colleges for predictor:', err);
    }
  };

  const currentCollege = collegesList.find(c => c.id === selectedCollegeId) || initialCollege;
  const currentCourse = currentCollege?.courses.find(c => c.id === selectedCourseId) || currentCollege?.courses[0];

  useEffect(() => {
    if (currentCollege && (!selectedCourseId || !currentCollege.courses.some(c => c.id === selectedCourseId))) {
      setSelectedCourseId(currentCollege.courses[0]?.id || '');
    }
  }, [selectedCollegeId, currentCollege]);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCollegeId || !selectedCourseId || !studentScore) return;

    try {
      setIsCalculating(true);
      const res = await predictCutoff({
        collegeId: selectedCollegeId,
        courseId: selectedCourseId,
        studentScore: Number(studentScore),
        scoreType,
        category,
        quota,
      });
      setPredictionResult(res);
    } catch (err) {
      console.error('Prediction calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveToTracker = async () => {
    if (!currentCollege || !currentCourse) return;
    try {
      await createApplication({
        studentId: 'demo-student',
        collegeId: currentCollege.id,
        collegeName: currentCollege.name,
        courseName: currentCourse.name,
        examName: currentCourse.acceptedExams[0] || 'Entrance Exam',
        currentStage: 'Applied',
        deadlineDate: currentCollege.admissionTimeline.registrationEnd,
        actionRequired: `Predicted ${predictionResult?.chancePercentage}% chance under ${category} quota. Submit form before deadline.`,
        notes: `Predicted admission via MentoraAI Cutoff Engine.`,
      });
      onApplicationTracked();
      onClose();
    } catch (err) {
      console.error('Tracker error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="theme-modal-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border theme-border-default">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b theme-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl theme-badge-accent flex items-center justify-center">
              <Target className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-black font-heading">
                AI Cutoff & Admission Chance Predictor
              </h3>
              <p className="text-xs theme-text-muted mt-0.5">
                Scientific multi-variable algorithm benchmarking historical opening & closing ranks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 p-1 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Prediction Input Form */}
        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target College */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                Target Government College
              </label>
              <select
                aria-label="Select Target Government College"
                value={selectedCollegeId}
                onChange={e => {
                  setSelectedCollegeId(e.target.value);
                  setPredictionResult(null);
                }}
                className="w-full theme-input rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
              >
                {collegesList.map(c => (
                  <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Course */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                Target Course / Degree
              </label>
              <select
                aria-label="Select Target Course"
                value={selectedCourseId}
                onChange={e => {
                  setSelectedCourseId(e.target.value);
                  setPredictionResult(null);
                }}
                className="w-full theme-input rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
              >
                {currentCollege?.courses.map(crs => (
                  <option key={crs.id} value={crs.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {crs.name} ({crs.degree})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Score Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                Score Metric
              </label>
              <div className="flex theme-card-subtle rounded-xl p-1 border theme-border-subtle">
                <button
                  type="button"
                  onClick={() => {
                    setScoreType('rank');
                    setStudentScore(32000);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    scoreType === 'rank' ? 'theme-btn-primary shadow-2xs' : 'theme-text-muted hover:text-[var(--text-primary)]'
                  }`}
                >
                  Rank (#)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScoreType('percentage');
                    setStudentScore(82);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    scoreType === 'percentage' ? 'theme-btn-primary shadow-2xs' : 'theme-text-muted hover:text-[var(--text-primary)]'
                  }`}
                >
                  Marks (%)
                </button>
              </div>
            </div>

            {/* Student Score / Rank Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                {scoreType === 'rank' ? 'Your Entrance Rank' : 'Board Percentage (%)'}
              </label>
              <input
                type="number"
                value={studentScore}
                onChange={e => setStudentScore(Number(e.target.value))}
                min={1}
                max={scoreType === 'percentage' ? 100 : 1500000}
                className="w-full theme-input rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden"
                placeholder={scoreType === 'rank' ? 'e.g. 24000' : 'e.g. 85'}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                Reservation Category
              </label>
              <select
                aria-label="Select Reservation Category"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full theme-input rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
              >
                <option value="GEN" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">General / Open (UR)</option>
                <option value="OBC" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">OBC-NCL (Non-Creamy)</option>
                <option value="SC" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">SC (Scheduled Caste)</option>
                <option value="ST" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">ST (Scheduled Tribe)</option>
                <option value="EWS" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">EWS (Economically Weaker)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quota */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-text-secondary mb-1">
                Domicile Quota
              </label>
              <select
                aria-label="Select Domicile Quota"
                value={quota}
                onChange={e => setQuota(e.target.value as any)}
                className="w-full theme-input rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
              >
                <option value="HS" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Home State Quota (State Domicile / 50% reservation)</option>
                <option value="AI" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All India Quota (Open for all states)</option>
                <option value="OS" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Other State Quota (JoSAA / CSAB)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full theme-btn-primary py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {isCalculating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Cutoff Trends...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Calculate Cutoff Probability</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Prediction Results Display */}
        {predictionResult && (
          <div className="mt-6 pt-6 border-t theme-border-subtle">
            <div
              className={`rounded-2xl p-5 border ${
                predictionResult.chancePercentage >= 75
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : predictionResult.chancePercentage >= 50
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider theme-text-secondary">
                  Admission Probability Result
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                    predictionResult.chancePercentage >= 75
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : predictionResult.chancePercentage >= 50
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {predictionResult.probability} Chance ({predictionResult.chancePercentage}%)
                </span>
              </div>

              <div className="text-sm font-bold mb-1">
                {predictionResult.collegeName} — {predictionResult.courseName}
              </div>

              <p className="text-xs theme-text-secondary leading-relaxed mb-4">
                {predictionResult.reasoning}
              </p>

              {/* Data points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 theme-card-subtle p-3 rounded-xl border theme-border-subtle text-xs mb-4">
                <div>
                  <div className="theme-text-muted text-[10px]">Benchmark Cutoff:</div>
                  <div className="font-mono font-bold">
                    {scoreType === 'rank' ? `#${predictionResult.historicalClosing?.closingRank}` : `${predictionResult.historicalClosing?.minPercentage}%`}
                  </div>
                </div>
                <div>
                  <div className="theme-text-muted text-[10px]">Annual Fee:</div>
                  <div className="font-mono font-bold">
                    ₹{predictionResult.annualFee?.toLocaleString()}/yr
                  </div>
                </div>
                <div>
                  <div className="theme-text-muted text-[10px]">Avg Placement CTC:</div>
                  <div className="font-mono font-bold text-emerald-500">
                    ₹{predictionResult.avgPackageLPA} LPA
                  </div>
                </div>
                <div>
                  <div className="theme-text-muted text-[10px]">Category Seats:</div>
                  <div className="font-mono font-bold">
                    {predictionResult.seatAvailability ? `${predictionResult.seatAvailability[category.toLowerCase()] || 12} Seats` : 'Verified'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveToTracker}
                className="w-full theme-btn-primary py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save to My Admission Tracker</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
