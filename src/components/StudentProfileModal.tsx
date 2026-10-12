import React, { useState } from 'react';
import { User, Check, ShieldCheck } from 'lucide-react';

interface StudentProfileModalProps {
  currentProfile: {
    name: string;
    classGrade: string;
    state: string;
    category: string;
    targetStream: string;
  };
  onSave: (updatedProfile: {
    name: string;
    classGrade: string;
    state: string;
    category: string;
    targetStream: string;
  }) => void;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentProfile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [classGrade, setClassGrade] = useState(currentProfile.classGrade);
  const [state, setState] = useState(currentProfile.state);
  const [category, setCategory] = useState(currentProfile.category);
  const [targetStream, setTargetStream] = useState(currentProfile.targetStream);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, classGrade, state, category, targetStream });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-modal-backdrop)] backdrop-blur-sm flex items-center justify-center p-4">
      <div className="theme-modal-card rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border theme-border-default">
        <div className="flex items-center justify-between pb-3 border-b theme-border-subtle mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg theme-badge-accent flex items-center justify-center font-bold">
              <User className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <h4 className="text-base font-black font-heading">Customize Student Profile</h4>
          </div>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold theme-text-secondary mb-1">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-bold theme-text-secondary mb-1">Current Academic Level</label>
            <select
              aria-label="Current Academic Level"
              value={classGrade}
              onChange={e => setClassGrade(e.target.value)}
              className="w-full theme-input rounded-xl px-3 py-2 font-medium"
            >
              <option value="Class 10 Student" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class 10 Student (Stream Decision Phase)</option>
              <option value="Class 12 (Science PCM)" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class 12 (Science PCM / Engineering)</option>
              <option value="Class 12 (Science PCB)" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class 12 (Science PCB / Medical)</option>
              <option value="Class 12 (Commerce)" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class 12 (Commerce & Economics)</option>
              <option value="Class 12 (Arts/Humanities)" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Class 12 (Arts & Humanities)</option>
              <option value="Polytechnic Diploma Student" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Polytechnic Diploma Student</option>
              <option value="College Undergraduate" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">College Undergraduate</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold theme-text-secondary mb-1">State / Domicile</label>
              <select
                aria-label="State or Domicile"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full theme-input rounded-xl px-3 py-2 font-medium"
              >
                <option value="Jammu & Kashmir" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Jammu & Kashmir (PMSSS)</option>
                <option value="Delhi" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Delhi (NCR)</option>
                <option value="Maharashtra" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Maharashtra</option>
                <option value="Uttar Pradesh" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Uttar Pradesh</option>
                <option value="Bihar" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Bihar</option>
                <option value="West Bengal" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">West Bengal</option>
                <option value="Punjab" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Punjab</option>
                <option value="Other States" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Other States / UTs</option>
              </select>
            </div>

            <div>
              <label className="block font-bold theme-text-secondary mb-1">Quota Category</label>
              <select
                aria-label="Quota Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full theme-input rounded-xl px-3 py-2 font-medium"
              >
                <option value="GEN" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">General (UR)</option>
                <option value="OBC" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">OBC-NCL</option>
                <option value="SC" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">SC (Scheduled Caste)</option>
                <option value="ST" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">ST (Scheduled Tribe)</option>
                <option value="EWS" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">EWS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold theme-text-secondary mb-1">Aspired Interest</label>
            <input
              type="text"
              value={targetStream}
              onChange={e => setTargetStream(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Civil Diploma, MBBS, CA..."
              className="w-full theme-input rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl theme-btn-ghost cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 theme-btn-primary font-bold rounded-xl cursor-pointer shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
