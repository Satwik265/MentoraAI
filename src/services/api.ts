import { College, AssessmentQuestion, ApplicationTracker, AlumniProfile, ScholarshipScheme, CrowdsourcedReview, AssessmentRecord } from '../../data/database.ts';

const TOKEN_KEY = 'mentora_access_token';
const REFRESH_KEY = 'mentora_refresh_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Platform Statistics
export async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const json = await res.json();
    return json.stats || json.data?.stats || json.data;
  } catch (err) {
    console.error('Failed to fetch platform stats:', err);
    return null;
  }
}

// Colleges Directory
export async function fetchColleges(filters?: { query?: string; state?: string; stream?: string; maxFee?: number; type?: string }) {
  try {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.stream) params.append('stream', filters.stream);
    if (filters?.maxFee) params.append('maxFee', String(filters.maxFee));
    if (filters?.type) params.append('type', filters.type);

    const res = await fetch(`/api/colleges?${params.toString()}`);
    const json = await res.json();
    const collegesList = json.colleges || json.data?.colleges || json.data || [];
    return collegesList as College[];
  } catch (err) {
    console.error('Failed to fetch colleges:', err);
    return [];
  }
}

export async function fetchCollegeById(id: string) {
  try {
    const res = await fetch(`/api/colleges/${id}`);
    const json = await res.json();
    const payload = json.data || json;
    return {
      college: (payload.college || payload) as College,
      reviews: (payload.reviews || json.reviews || []) as CrowdsourcedReview[],
    };
  } catch (err) {
    console.error('Failed to fetch college details:', err);
    return { college: null as any, reviews: [] };
  }
}

// Admission Prediction
export async function predictCutoff(payload: {
  collegeId: string;
  courseId: string;
  studentScore: number;
  scoreType: 'rank' | 'percentage';
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  quota: 'AI' | 'HS' | 'OS';
}) {
  const res = await fetch('/api/colleges/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data || json;
}

// Assessment Questions & Evaluation
export async function fetchQuestions() {
  try {
    const res = await fetch('/api/assessments/questions');
    const json = await res.json();
    return (json.questions || json.data?.questions || json.data || []) as AssessmentQuestion[];
  } catch (err) {
    console.error('Failed to fetch assessment questions:', err);
    return [];
  }
}

export async function submitAssessment(answers: Record<string, string>, studentId: string = 'demo-student') {
  const res = await fetch('/api/assessments/evaluate', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers, studentId }),
  });
  const json = await res.json();
  return (json.result || json.data?.result || json.data) as AssessmentRecord;
}

// Application Tracking
export async function fetchApplications(studentId: string = 'demo-student') {
  try {
    const res = await fetch(`/api/applications`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return (json.applications || json.data?.applications || json.data || []) as ApplicationTracker[];
  } catch (err) {
    console.error('Failed to fetch applications:', err);
    return [];
  }
}

export async function createApplication(payload: Partial<ApplicationTracker>) {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return (json.application || json.data?.admission || json.data) as ApplicationTracker;
}

export async function updateApplicationStage(id: string, stage: ApplicationTracker['currentStage'], actionRequired?: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ stage, status: stage, actionRequired }),
  });
  const json = await res.json();
  return (json.application || json.data?.admission || json.data) as ApplicationTracker;
}

export async function deleteApplication(id: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await res.json();
}

// Scholarships
export async function fetchScholarships(category?: string) {
  try {
    const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`/api/scholarships${params}`);
    const json = await res.json();
    return (json.scholarships || json.data?.scholarships || json.data || []) as ScholarshipScheme[];
  } catch (err) {
    console.error('Failed to fetch scholarships:', err);
    return [];
  }
}

// Alumni Mentors
export async function fetchAlumni() {
  try {
    const res = await fetch('/api/alumni');
    const json = await res.json();
    return (json.alumni || json.data?.alumni || json.data || []) as AlumniProfile[];
  } catch (err) {
    console.error('Failed to fetch alumni mentors:', err);
    return [];
  }
}

export async function submitMentorshipQuestion(payload: {
  alumniId: string;
  studentName: string;
  studentClass: string;
  message: string;
}) {
  const res = await fetch(`/api/alumni/${payload.alumniId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data || json;
}

export async function sendAlumniInquiry(alumniId: string, studentName: string, studentClass: string, message: string) {
  return submitMentorshipQuestion({ alumniId, studentName, studentClass, message });
}

// Feedback & Verified Reviews
export async function fetchReviews(collegeId?: string) {
  try {
    const params = collegeId ? `?collegeId=${collegeId}` : '';
    const res = await fetch(`/api/feedback${params}`);
    const json = await res.json();
    return (json.reviews || json.data?.reviews || json.data || []) as CrowdsourcedReview[];
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return [];
  }
}

export async function submitReview(payload: {
  collegeId: string;
  studentName: string;
  courseAndYear: string;
  rating: number;
  comment: string;
  pros: string[];
  cons: string[];
}) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data || json;
}

// AI Career Advisor
export async function sendChatMessage(message: string, history: Array<{ role: string; content: string }>, studentProfile?: any) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, studentProfile }),
  });
  const json = await res.json();
  return (json.reply || json.data?.reply || 'Advisory service unavailable') as string;
}

// Text-to-Speech
export async function synthesizeSpeech(text: string): Promise<{ audioBase64?: string; useWebSpeech?: boolean }> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    return json.data || json;
  } catch {
    return { useWebSpeech: true };
  }
}

// Authentication APIs
export async function apiLogin(credentials: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const json = await res.json();
  if (json.success && json.data?.tokens) {
    setAuthTokens(json.data.tokens.accessToken, json.data.tokens.refreshToken);
  }
  return json;
}

export async function apiRegister(userData: {
  email: string;
  password: string;
  role?: string;
  fullName?: string;
  state?: string;
  classGrade?: string;
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (json.success && json.data?.tokens) {
    setAuthTokens(json.data.tokens.accessToken, json.data.tokens.refreshToken);
  }
  return json;
}

export async function apiGetMe() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } finally {
    clearAuthTokens();
  }
}
