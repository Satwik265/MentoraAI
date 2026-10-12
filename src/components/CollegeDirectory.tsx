import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Building, Award, GraduationCap, DollarSign, ExternalLink, ShieldCheck, Check, Sparkles, PlusCircle } from 'lucide-react';
import { College } from '../../data/database.ts';
import { fetchColleges, createApplication } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface CollegeDirectoryProps {
  currentLang: SupportedLanguage;
  onOpenPredictor: (college: College, courseId?: string) => void;
  onApplicationAdded: () => void;
  initialStreamFilter?: string;
}

export const CollegeDirectory: React.FC<CollegeDirectoryProps> = ({
  currentLang,
  onOpenPredictor,
  onApplicationAdded,
  initialStreamFilter,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStream, setSelectedStream] = useState(initialStreamFilter || 'All');
  const [maxFee, setMaxFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollegeForModal, setSelectedCollegeForModal] = useState<College | null>(null);
  const [trackingSuccessId, setTrackingSuccessId] = useState<string | null>(null);

  useEffect(() => {
    loadColleges();
  }, [searchQuery, selectedState, selectedType, selectedStream, maxFee]);

  const loadColleges = async () => {
    try {
      setIsLoading(true);
      const data = await fetchColleges({
        query: searchQuery || undefined,
        state: selectedState !== 'All' ? selectedState : undefined,
        type: selectedType !== 'All' ? selectedType : undefined,
        stream: selectedStream !== 'All' ? selectedStream : undefined,
        maxFee: maxFee > 0 ? maxFee : undefined,
      });
      setColleges(data);
    } catch (err) {
      console.error('Error loading colleges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackAdmission = async (college: College, courseName: string, examName: string) => {
    try {
      await createApplication({
        studentId: 'demo-student',
        collegeId: college.id,
        collegeName: college.name,
        courseName,
        examName,
        currentStage: 'Applied',
        deadlineDate: college.admissionTimeline.registrationEnd,
        actionRequired: 'Verify documents and track merit cutoff list',
        notes: `Subsidized govt fee: ₹${college.courses[0]?.annualFee?.toLocaleString()}/yr. Scholarships supported: ${college.governmentScholarshipsSupported.join(', ')}`,
      });

      setTrackingSuccessId(college.id);
      onApplicationAdded();
      setTimeout(() => setTrackingSuccessId(null), 3000);
    } catch (err) {
      console.error('Failed to track application:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Banner */}
      <div className="theme-card-elevated rounded-3xl p-6 sm:p-8 mb-8 border theme-border-default shadow-xl relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Government College Empowerment & Real-Time Seat Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Find Your Ideal Government College
          </h2>
          <p className="theme-text-secondary text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time data from Indian government universities, IITs, NITs, Medical colleges, and subsidized state polytechnics. Track real seat availability (GEN/OBC/SC/ST/EWS), annual fees, and cutoff predictions.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="theme-card rounded-2xl p-4 sm:p-5 border theme-border-subtle shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 opacity-50 absolute left-3 top-3.5 text-[var(--accent-primary)]" />
            <input
              type="text"
              placeholder="Search by college, city, or course (e.g. NIT, CSE, Civil)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full theme-input rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-hidden transition-all"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              aria-label="Filter by state or UT"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden transition-all cursor-pointer"
            >
              <option value="All" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All States / UTs</option>
              <option value="Jammu & Kashmir" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Jammu & Kashmir (J&K)</option>
              <option value="Delhi" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Delhi (NCR)</option>
              <option value="Maharashtra" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Maharashtra</option>
            </select>
          </div>

          {/* College Type */}
          <div>
            <select
              aria-label="Filter by college type"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden transition-all cursor-pointer"
            >
              <option value="All" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All Institution Types</option>
              <option value="IIT" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">IIT (Institute of Technology)</option>
              <option value="NIT" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">NIT (National Institute)</option>
              <option value="Central University" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Central University</option>
              <option value="State University" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">State University</option>
              <option value="Government Polytechnic" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Govt Polytechnic (Affordable)</option>
              <option value="Medical College" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Govt Medical College</option>
            </select>
          </div>

          {/* Stream */}
          <div>
            <select
              aria-label="Filter by academic stream"
              value={selectedStream}
              onChange={e => setSelectedStream(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden transition-all cursor-pointer"
            >
              <option value="All" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">All Streams</option>
              <option value="Engineering & Tech" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Engineering & Tech</option>
              <option value="Medical & Healthcare" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Medical & Healthcare</option>
              <option value="Commerce & Finance" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Commerce & Finance</option>
              <option value="Pure Sciences" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Pure Sciences</option>
              <option value="Polytechnic & Vocational" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Polytechnic & Vocational</option>
            </select>
          </div>
        </div>

        {/* Quick Tags / Subsidized filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t theme-border-subtle text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold theme-text-secondary text-xs">Quick Filters:</span>
            <button
              onClick={() => {
                setSelectedState('Jammu & Kashmir');
                setSelectedType('All');
              }}
              className="px-2.5 py-1 rounded-lg theme-badge-accent font-semibold transition-all cursor-pointer"
            >
              J&K Beneficiaries (PMSSS)
            </button>
            <button
              onClick={() => {
                setSelectedType('Government Polytechnic');
                setSelectedState('All');
              }}
              className="px-2.5 py-1 rounded-lg theme-badge-subtle hover:theme-border-default font-semibold transition-all cursor-pointer"
            >
              Under ₹5,000/yr Polytechnic
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All');
                setSelectedType('All');
                setSelectedStream('All');
                setMaxFee(0);
              }}
              className="theme-text-muted hover:theme-text-accent underline cursor-pointer ml-1 text-xs"
            >
              Reset Filters
            </button>
          </div>

          <div className="font-medium theme-text-secondary">
            Showing <strong className="theme-text-accent font-bold">{colleges.length}</strong> Government Colleges
          </div>
        </div>
      </div>

      {/* College Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-xs theme-text-muted font-medium">Fetching real-time seat matrices and cutoffs...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="theme-card rounded-3xl p-12 text-center border theme-border-subtle">
          <Building className="w-12 h-12 opacity-40 mx-auto mb-3 text-[var(--accent-primary)]" />
          <h3 className="text-base font-bold">No Government Colleges Match Your Filters</h3>
          <p className="text-xs theme-text-secondary mt-1 max-w-sm mx-auto">
            Try resetting your search query or broadening state/stream criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedState('All');
              setSelectedType('All');
              setSelectedStream('All');
            }}
            className="mt-4 px-4 py-2 theme-btn-primary rounded-xl text-xs font-bold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {colleges.map(college => {
            const primaryCourse = college.courses[0];
            return (
              <div
                key={college.id}
                className="theme-card theme-card-hover rounded-3xl border theme-border-subtle overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Bar: Badges & Rating */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="theme-btn-primary font-bold text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        {college.type}
                      </span>
                      {college.nirfRank && (
                        <span className="theme-card-subtle border theme-border-default font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3 text-[var(--accent-primary)]" /> NIRF #{college.nirfRank}
                        </span>
                      )}
                      <span className="theme-badge-subtle text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        NAAC {college.naacRating}
                      </span>
                      <span className="text-xs theme-text-muted font-medium">Est. {college.establishedYear}</span>
                    </div>

                    <div className="flex items-center gap-1.5 theme-card-subtle border theme-border-subtle px-2.5 py-1 rounded-xl text-xs font-bold text-amber-500">
                      <span>★</span>
                      <span>{college.crowdsourcedRating.overall}</span>
                      <span className="text-[10px] theme-text-muted font-normal">
                        ({college.crowdsourcedRating.reviewCount} student reviews)
                      </span>
                    </div>
                  </div>

                  {/* College Name & Location */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-black font-heading tracking-tight">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs theme-text-secondary mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        <span>
                          {college.city}, {college.state}
                        </span>
                        <span className="opacity-40">•</span>
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-text-accent hover:underline flex items-center gap-1 font-semibold"
                        >
                          Official Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Timeline Status Badge */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {college.admissionTimeline.currentStatus}
                      </span>
                      <div className="text-[11px] theme-text-muted mt-1 font-mono">
                        Exam: {college.admissionTimeline.exam}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs theme-text-secondary mb-5 leading-relaxed max-w-4xl">
                    {college.description}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 theme-card-subtle rounded-2xl p-4 border theme-border-subtle mb-5">
                    <div>
                      <div className="text-base sm:text-lg font-black theme-text-accent font-mono">
                        98.4%
                      </div>
                      <div className="text-[11px] theme-text-muted font-medium">
                        Seat Accessibility Score
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black font-mono">
                        ₹{primaryCourse ? (primaryCourse.annualFee < 10000 ? `${primaryCourse.annualFee}/yr` : `${(primaryCourse.annualFee / 100000).toFixed(1)}L/yr`) : 'Subsidized'}
                      </div>
                      <div className="text-[11px] theme-text-muted font-medium">
                        Annual Government Fee
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black text-emerald-500 font-mono">
                        ₹{primaryCourse ? `${primaryCourse.avgPackageLPA} LPA` : '6.5 LPA'}
                      </div>
                      <div className="text-[11px] theme-text-muted font-medium">
                        Avg Placement CTC
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black font-mono">
                        {college.campusAcres} Acres
                      </div>
                      <div className="text-[11px] theme-text-muted font-medium">
                        Campus Area {college.hostelAvailable ? '• Hostels Yes' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Courses & Seat Matrix Preview */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-extrabold uppercase tracking-wider theme-text-secondary">
                      Available Courses & Verified Seats:
                    </div>
                    {college.courses.map(course => (
                      <div
                        key={course.id}
                        className="theme-card-subtle rounded-2xl p-3.5 border theme-border-subtle flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <div className="text-xs sm:text-sm font-bold">
                            {course.name}
                          </div>
                          <div className="text-[11px] theme-text-secondary mt-0.5">
                            {course.degree} • {course.durationYears} Years • Total Seats: <strong className="font-bold">{course.totalSeats}</strong> (Gen: {course.seatsBreakdown.general}, OBC: {course.seatsBreakdown.obc}, SC: {course.seatsBreakdown.sc}, ST: {course.seatsBreakdown.st}, EWS: {course.seatsBreakdown.ews})
                          </div>
                        </div>

                        {/* Direct Actions per course */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenPredictor(college, course.id)}
                            className="theme-badge-accent hover:border-[var(--accent-primary)] font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Predict Cutoff Chance
                          </button>

                          <button
                            onClick={() => handleTrackAdmission(college, course.name, course.acceptedExams[0] || 'State Counseling')}
                            className="theme-btn-primary font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            {trackingSuccessId === college.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Tracked!</span>
                              </>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Track Admission</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Scholarships */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t theme-border-subtle">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] theme-text-secondary">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold">Supported Scholarships:</span>
                      {college.governmentScholarshipsSupported.map((sch, i) => (
                        <span key={i} className="theme-badge-subtle px-2 py-0.5 rounded-md font-semibold">
                          {sch}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedCollegeForModal(college)}
                      className="text-xs font-bold theme-text-accent hover:underline cursor-pointer"
                    >
                      View Campus Facilities & Reviews &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* College Details Modal */}
      {selectedCollegeForModal && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-modal-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border theme-border-default">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b theme-border-subtle">
              <div>
                <span className="text-xs font-extrabold uppercase theme-text-accent tracking-wider">
                  {selectedCollegeForModal.type} • {selectedCollegeForModal.state}
                </span>
                <h3 className="text-xl font-black font-heading mt-1">
                  {selectedCollegeForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCollegeForModal(null)}
                className="opacity-60 hover:opacity-100 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="font-bold mb-1">Campus & Infrastructure</div>
                <p className="theme-text-secondary leading-relaxed">
                  Spans {selectedCollegeForModal.campusAcres} acres with specialized digital laboratories, high-speed campus broadband, central libraries with free book bank schemes for reserved categories, and subsidized hostels at ₹{selectedCollegeForModal.hostelFeeAnnual?.toLocaleString()}/year.
                </p>
              </div>

              <div>
                <div className="font-bold mb-1">Student Ratings Breakdown</div>
                <div className="grid grid-cols-3 gap-3 p-3 theme-card-subtle rounded-xl border theme-border-subtle">
                  <div>
                    <span className="theme-text-muted">Faculty:</span>{' '}
                    <strong className="text-amber-500 font-bold">
                      ★ {selectedCollegeForModal.crowdsourcedRating.faculty}/5
                    </strong>
                  </div>
                  <div>
                    <span className="theme-text-muted">Placements:</span>{' '}
                    <strong className="text-amber-500 font-bold">
                      ★ {selectedCollegeForModal.crowdsourcedRating.placements}/5
                    </strong>
                  </div>
                  <div>
                    <span className="theme-text-muted">Infrastructure:</span>{' '}
                    <strong className="text-amber-500 font-bold">
                      ★ {selectedCollegeForModal.crowdsourcedRating.infrastructure}/5
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold mb-1">Admission Counseling Timeline</div>
                <div className="p-3 theme-card-subtle border theme-border-default rounded-xl space-y-1">
                  <div>Exam: <strong className="theme-text-accent font-bold">{selectedCollegeForModal.admissionTimeline.exam}</strong></div>
                  <div>Application Window: {selectedCollegeForModal.admissionTimeline.registrationStart} to {selectedCollegeForModal.admissionTimeline.registrationEnd}</div>
                  <div>Expected Counseling: {selectedCollegeForModal.admissionTimeline.counselingDate}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t theme-border-subtle">
              <button
                onClick={() => {
                  const c = selectedCollegeForModal;
                  setSelectedCollegeForModal(null);
                  onOpenPredictor(c);
                }}
                className="px-4 py-2 theme-btn-primary font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Predict Admission Cutoff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
