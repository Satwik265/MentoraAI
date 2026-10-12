import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, Plus, ThumbsUp, Building, User } from 'lucide-react';
import { CrowdsourcedReview, College } from '../../data/database.ts';
import { fetchReviews, submitReview, fetchColleges } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface FeedbackSurveysViewProps {
  currentLang: SupportedLanguage;
}

export const FeedbackSurveysView: React.FC<FeedbackSurveysViewProps> = ({ currentLang }) => {
  const [reviews, setReviews] = useState<CrowdsourcedReview[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New review form
  const [newCollegeId, setNewCollegeId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newCourseAndYear, setNewCourseAndYear] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPros, setNewPros] = useState('Subsidized hostel fees, supportive professors');
  const [newCons, setNewCons] = useState('Need more transport buses for rural scholars');

  useEffect(() => {
    loadData();
  }, [selectedCollegeFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [revs, cols] = await Promise.all([
        fetchReviews(selectedCollegeFilter !== 'All' ? selectedCollegeFilter : undefined),
        fetchColleges(),
      ]);
      setReviews(revs);
      setColleges(cols);
      if (cols.length > 0 && !newCollegeId) {
        setNewCollegeId(cols[0].id);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeId || !newComment) return;

    try {
      await submitReview({
        collegeId: newCollegeId,
        studentName: newStudentName || 'Anonymous Student',
        courseAndYear: newCourseAndYear || 'Student',
        rating: newRating,
        comment: newComment,
        pros: newPros.split(',').map(s => s.trim()).filter(Boolean),
        cons: newCons.split(',').map(s => s.trim()).filter(Boolean),
      });

      setShowAddReviewModal(false);
      setNewComment('');
      loadData();
    } catch (err) {
      console.error('Review submit error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="theme-card-elevated rounded-3xl p-6 sm:p-8 mb-8 border theme-border-default shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider block mb-1 theme-text-accent">
            Crowdsourced Campus Verification System
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Student Feedback, Surveys & College Audits
          </h2>
          <p className="theme-text-secondary text-xs sm:text-sm mt-1 leading-relaxed">
            Integrating peer feedback from current students with government data to maintain accuracy, transparency on hostel conditions, and true placement outcomes.
          </p>
        </div>

        <button
          onClick={() => setShowAddReviewModal(true)}
          className="relative z-10 flex items-center gap-2 theme-btn-primary font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Student Review</span>
        </button>
      </div>

      {/* Filter by College */}
      <div className="theme-card rounded-2xl p-4 border theme-border-subtle shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold theme-text-secondary">Filter College Reviews:</span>
          <select
            aria-label="Filter reviews by college"
            value={selectedCollegeFilter}
            onChange={e => setSelectedCollegeFilter(e.target.value)}
            className="theme-input rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="All" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All Government Colleges</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs theme-text-muted font-medium">
          Total Reviews: <strong className="theme-text-accent font-bold">{reviews.length}</strong>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs theme-text-muted">
          Loading student survey feedback...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(rev => {
            const college = colleges.find(c => c.id === rev.collegeId);

            return (
              <div
                key={rev.id}
                className="theme-card rounded-2xl p-5 border theme-border-subtle shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold theme-text-accent block">
                        {college?.name || rev.collegeId}
                      </span>
                      <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[var(--accent-primary)]" />
                        {rev.studentName}
                        {rev.verifiedStudent && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] theme-text-muted">{rev.courseAndYear}</div>
                    </div>

                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>

                  <p className="text-xs theme-text-secondary leading-relaxed my-3 italic">
                    "{rev.comment}"
                  </p>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="theme-card-subtle p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400">
                      <strong className="block font-bold mb-0.5">Pros:</strong>
                      {rev.pros.join(' • ')}
                    </div>
                    {rev.cons && rev.cons.length > 0 && (
                      <div className="theme-card-subtle p-2.5 rounded-xl border border-amber-500/30 text-amber-400">
                        <strong className="block font-bold mb-0.5">To Improve:</strong>
                        {rev.cons.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] theme-text-muted pt-3 mt-3 border-t theme-border-subtle flex items-center justify-between">
                  <span>Reviewed on {rev.date}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <ThumbsUp className="w-3 h-3 text-[var(--accent-primary)]" /> Helpful
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-modal-card rounded-3xl max-w-lg w-full p-6 shadow-2xl border theme-border-default">
            <div className="flex items-center justify-between pb-3 border-b theme-border-subtle mb-4">
              <h4 className="text-base font-bold font-heading">Submit College Peer Review</h4>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="opacity-60 hover:opacity-100 p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold theme-text-secondary mb-1">Select College</label>
                <select
                  aria-label="Select College to Review"
                  value={newCollegeId}
                  onChange={e => setNewCollegeId(e.target.value)}
                  className="w-full theme-input rounded-xl px-3 py-2"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farooq Lone"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Branch & Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech 2nd Year"
                    value={newCourseAndYear}
                    onChange={e => setNewCourseAndYear(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold theme-text-secondary mb-1">Rating (1 to 5 Stars)</label>
                <select
                  aria-label="Rating"
                  value={newRating}
                  onChange={e => setNewRating(Number(e.target.value))}
                  className="w-full theme-input rounded-xl px-3 py-2"
                >
                  <option value={5} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">★★★★★ (5 Stars - Outstanding)</option>
                  <option value={4} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">★★★☆☆ (3 Stars - Average)</option>
                  <option value={2} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">★★☆☆☆ (2 Stars - Needs Improvement)</option>
                  <option value={1} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold theme-text-secondary mb-1">Your Honest Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details on faculty, hostel fees, labs, and scholarship support..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full theme-input rounded-xl p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Key Pros (Comma separated)</label>
                  <input
                    type="text"
                    value={newPros}
                    onChange={e => setNewPros(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Areas to Improve</label>
                  <input
                    type="text"
                    value={newCons}
                    onChange={e => setNewCons(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 rounded-xl theme-btn-ghost cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 theme-btn-primary font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
