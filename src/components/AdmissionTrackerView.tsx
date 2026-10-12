import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle, Trash2, Plus, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { ApplicationTracker } from '../../data/database.ts';
import { fetchApplications, updateApplicationStage, deleteApplication, createApplication } from '../services/api.ts';
import { SupportedLanguage } from '../translations.ts';

interface AdmissionTrackerViewProps {
  currentLang: SupportedLanguage;
  studentId: string;
}

const STAGES: Array<{ id: ApplicationTracker['currentStage']; label: string; desc: string }> = [
  { id: 'Applied', label: '1. Applied', desc: 'Online application submitted' },
  { id: 'Documents_Verified', label: '2. Doc Verified', desc: 'Nodal verification cleared' },
  { id: 'Merit_List', label: '3. Merit List', desc: 'State/National rank published' },
  { id: 'Counseling', label: '4. Counseling', desc: 'Choice filling & locking active' },
  { id: 'Seat_Allotted', label: '5. Seat Allotted', desc: 'Provisional allotment letter' },
  { id: 'Admission_Confirmed', label: '6. Confirmed', desc: 'Fee deposited, seat frozen' },
];

export const AdmissionTrackerView: React.FC<AdmissionTrackerViewProps> = ({
  currentLang,
  studentId,
}) => {
  const [applications, setApplications] = useState<ApplicationTracker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newExamName, setNewExamName] = useState('CUET UG 2025');
  const [newDeadline, setNewDeadline] = useState('2025-07-20');
  const [newNotes, setNewNotes] = useState('');

  // Document checklist state
  const [docs, setDocs] = useState([
    { id: 'doc1', title: 'Class 10 Board Marksheet & Certificate', required: true, checked: true },
    { id: 'doc2', title: 'Class 12 Board / Provisional Marksheet', required: true, checked: true },
    { id: 'doc3', title: 'Domicile Certificate (J&K / State)', required: true, checked: true },
    { id: 'doc4', title: 'Family Income Certificate (Tehsildar signed <₹8 Lakh for PMSSS)', required: true, checked: false },
    { id: 'doc5', title: 'Category Certificate (SC/ST/OBC-NCL/EWS if applicable)', required: false, checked: true },
    { id: 'doc6', title: 'Aadhaar Card linked to Bank Account (for DBT Scholarships)', required: true, checked: true },
  ]);

  useEffect(() => {
    loadApplications();
  }, [studentId]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApplications(studentId);
      setApplications(data);
    } catch (err) {
      console.error('Failed to load tracked applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageChange = async (appId: string, newStage: ApplicationTracker['currentStage']) => {
    try {
      await updateApplicationStage(appId, newStage, `Advanced to ${newStage.replace('_', ' ')} stage on ${new Date().toLocaleDateString()}`);
      loadApplications();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Remove this application from tracking?')) return;
    try {
      await deleteApplication(appId);
      loadApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName || !newCourseName) return;

    try {
      await createApplication({
        studentId,
        collegeId: 'custom-' + Date.now(),
        collegeName: newCollegeName,
        courseName: newCourseName,
        examName: newExamName,
        currentStage: 'Applied',
        deadlineDate: newDeadline,
        actionRequired: 'Check official counseling notifications',
        notes: newNotes || 'Manually added application tracking',
      });
      setShowAddModal(false);
      setNewCollegeName('');
      setNewCourseName('');
      loadApplications();
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };

  const toggleDoc = (id: string) => {
    setDocs(prev => prev.map(d => (d.id === id ? { ...d, checked: !d.checked } : d)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 theme-card rounded-3xl p-6 sm:p-8 border theme-border-subtle shadow-xs mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 theme-badge-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Step 5: Centralized Admission & Timeline Tracker
          </span>
          <h2 className="text-2xl font-black font-heading tracking-tight">
            Live College Applications & Counseling Monitor
          </h2>
          <p className="text-xs sm:text-sm theme-text-secondary mt-1 max-w-2xl">
            Never miss a merit list release, counseling deadline, or document verification date. Track your government college seats step-by-step.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 theme-btn-primary font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Application</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tracked Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">
              Active College Applications ({applications.length})
            </h3>
            <span className="text-xs theme-text-muted font-mono font-medium">Synced with Database</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs theme-text-muted">
              Loading your admissions tracker...
            </div>
          ) : applications.length === 0 ? (
            <div className="theme-card rounded-2xl p-8 text-center border theme-border-subtle">
              <Calendar className="w-10 h-10 opacity-40 mx-auto mb-2 text-[var(--accent-primary)]" />
              <div className="text-sm font-bold">No Applications Tracked Yet</div>
              <p className="text-xs theme-text-secondary mt-1">
                Browse government colleges and click "Track Admission" to monitor your status here.
              </p>
            </div>
          ) : (
            applications.map(app => {
              const currentStageIndex = STAGES.findIndex(s => s.id === app.currentStage);

              return (
                <div
                  key={app.id}
                  className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs space-y-5"
                >
                  {/* College & Stage Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold theme-badge-subtle px-2 py-0.5 rounded">
                          {app.applicationNumber}
                        </span>
                        <span className="text-xs theme-text-muted font-medium">
                          Exam: {app.examName}
                        </span>
                      </div>
                      <h4 className="text-base font-black font-heading mt-1">
                        {app.collegeName}
                      </h4>
                      <div className="text-xs font-semibold theme-text-accent">
                        {app.courseName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[11px] theme-text-muted font-medium">Next Deadline:</div>
                        <div className="text-xs font-bold text-rose-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {app.deadlineDate}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="opacity-50 hover:opacity-100 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Step Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center">
                      {STAGES.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div
                            key={stage.id}
                            onClick={() => handleStageChange(app.id, stage.id)}
                            className={`p-2 rounded-xl border text-[11px] cursor-pointer transition-all ${
                              isCurrent
                                ? 'theme-btn-primary shadow-xs font-bold border-transparent'
                                : isCompleted
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold'
                                : 'theme-card-subtle opacity-60 border theme-border-subtle hover:opacity-100'
                            }`}
                            title={`Click to mark stage: ${stage.label}`}
                          >
                            <div className="truncate">{stage.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Required Box */}
                  <div className="theme-card-subtle border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-500">Immediate Action Required:</div>
                      <div className="text-xs theme-text-secondary mt-0.5 leading-relaxed">{app.actionRequired}</div>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="text-[11px] theme-text-muted italic">
                      Notes: {app.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Document Readiness Checklist & Deadlines */}
        <div className="space-y-6">
          {/* Document Verification Checklist */}
          <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-sm font-bold">
                Mandatory Government Admission Documents
              </h3>
            </div>
            <p className="text-xs theme-text-muted mb-4 leading-relaxed">
              Failure to present these documents at counseling is a primary cause of seat forfeiture. Keep verified scans ready:
            </p>

            <div className="space-y-2.5">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    doc.checked
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'theme-card-subtle border theme-border-subtle opacity-80'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      doc.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-current opacity-40'
                    }`}
                  >
                    {doc.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="text-xs leading-snug">
                    <span className={doc.checked ? 'font-semibold line-through opacity-70' : 'font-medium'}>
                      {doc.title}
                    </span>
                    {doc.required && (
                      <span className="text-[10px] text-rose-500 font-bold ml-1.5">*Req</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* National & State Counseling Portals */}
          <div className="theme-card rounded-2xl p-6 border theme-border-subtle shadow-xs">
            <h3 className="text-sm font-bold mb-3">
              Official Government Counseling Gateways
            </h3>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://josaa.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl theme-card-subtle hover:border-[var(--accent-primary)] border theme-border-subtle transition-all"
              >
                <div className="font-bold flex items-center justify-between">
                  <span>JoSAA / CSAB 2025</span>
                  <span className="theme-text-accent text-[11px]">&rarr;</span>
                </div>
                <div className="text-[11px] theme-text-muted mt-0.5">IITs, NITs, IIITs & GFTIs Central Counseling</div>
              </a>
              <a
                href="https://mcc.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl theme-card-subtle hover:border-[var(--accent-primary)] border theme-border-subtle transition-all"
              >
                <div className="font-bold flex items-center justify-between">
                  <span>MCC Medical Counseling</span>
                  <span className="theme-text-accent text-[11px]">&rarr;</span>
                </div>
                <div className="text-[11px] theme-text-muted mt-0.5">15% All India Quota MBBS / BDS Seats</div>
              </a>
              <a
                href="https://jkbopee.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl theme-card-subtle hover:border-[var(--accent-primary)] border theme-border-subtle transition-all"
              >
                <div className="font-bold flex items-center justify-between">
                  <span>JKBOPEE (Jammu & Kashmir)</span>
                  <span className="theme-text-accent text-[11px]">&rarr;</span>
                </div>
                <div className="text-[11px] theme-text-muted mt-0.5">State Engineering, Medical, & Polytechnic Admissions</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-modal-card rounded-3xl max-w-md w-full p-6 shadow-2xl border theme-border-default">
            <div className="flex items-center justify-between pb-3 border-b theme-border-subtle mb-4">
              <h4 className="text-base font-bold font-heading">Track New Application</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="opacity-60 hover:opacity-100 p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold theme-text-secondary mb-1">Government College Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIT Srinagar, GMC Jammu, COEP..."
                  value={newCollegeName}
                  onChange={e => setNewCollegeName(e.target.value)}
                  className="w-full theme-input rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold theme-text-secondary mb-1">Course & Branch</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science, MBBS, Diploma Civil..."
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  className="w-full theme-input rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Entrance Exam</label>
                  <input
                    type="text"
                    value={newExamName}
                    onChange={e => setNewExamName(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold theme-text-secondary mb-1">Next Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="w-full theme-input rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold theme-text-secondary mb-1">Important Notes</label>
                <textarea
                  placeholder="Any quota details or documents submitted..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full theme-input rounded-xl p-3"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl theme-btn-ghost cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 theme-btn-primary font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
