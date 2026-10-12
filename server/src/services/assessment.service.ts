import { AssessmentQuestion } from '../models/AssessmentQuestion.ts';
import { Assessment } from '../models/Assessment.ts';
import { Career } from '../models/Career.ts';

export class AssessmentService {
  async getActiveQuestions() {
    return await AssessmentQuestion.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  }

  async evaluateAndSave(data: {
    studentId: string;
    answers: Record<string, string>;
  }) {
    const questions = await AssessmentQuestion.find({ isActive: true }).lean();

    const scores = {
      tech: 0,
      medical: 0,
      commerce: 0,
      arts: 0,
      polytechnic: 0,
      analytical: 0,
      creative: 0,
      social: 0,
      entrepreneurial: 0,
    };

    for (const [qKey, optId] of Object.entries(data.answers)) {
      const q = questions.find(item => item.questionKey === qKey || String(item._id) === qKey);
      if (q) {
        const opt = q.options.find((o: any) => o.optionId === optId || (o as any)._id?.toString() === optId);
        if (opt && opt.weights) {
          for (const [key, val] of Object.entries(opt.weights)) {
            if (key in scores) {
              (scores as any)[key] += Number(val) || 0;
            }
          }
        }
      }
    }

    const streamRankings = [
      { name: 'Engineering & Technology (PCM / Computer Science)', score: scores.tech * 1.2 + scores.analytical },
      { name: 'Medical & Life Sciences (PCB / Healthcare)', score: scores.medical * 1.2 + scores.social * 0.5 },
      { name: 'Commerce, Finance & Entrepreneurship', score: scores.commerce * 1.2 + scores.entrepreneurial },
      { name: 'Arts, Humanities & Public Governance', score: scores.arts * 1.2 + scores.social + scores.creative },
      { name: 'Skill & Polytechnic Engineering (Hands-on Vocational)', score: scores.polytechnic * 1.3 },
    ].sort((a, b) => b.score - a.score);

    const topStream = streamRankings[0].name;

    let topCareers: string[] = [];
    let topCourses: string[] = [];
    let suggestedColleges: string[] = [];
    let skillRoadmap: string[] = [];

    if (topStream.includes('Engineering & Technology')) {
      topCareers = [
        'AI & Machine Learning Engineer',
        'Cloud Infrastructure Architect',
        'Robotics Systems Developer',
        'Cybersecurity Analyst',
      ];
      topCourses = [
        'B.Tech in Artificial Intelligence & ML',
        'B.Tech in Computer Science & Engineering',
        'B.Tech in Information Technology',
      ];
      suggestedColleges = ['IIT Delhi', 'NIT Srinagar', 'COEP Pune'];
      skillRoadmap = [
        'Python & Algorithmic Problem Solving',
        'Calculus & Linear Algebra',
        'Web Full-Stack Basics',
        'Data Structures & Competitive Coding',
      ];
    } else if (topStream.includes('Medical & Life Sciences')) {
      topCareers = [
        'Physician / Medical Specialist (MBBS)',
        'Clinical Pharmacologist',
        'Biomedical Research Scientist',
        'Public Healthcare Epidemiologist',
      ];
      topCourses = [
        'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
        'B.Sc in Biotechnology & Environmental Science',
        'Bachelor of Pharmacy',
      ];
      suggestedColleges = ['GMC Jammu', 'Government Medical College Srinagar', 'AIIMS'];
      skillRoadmap = [
        'NCERT Biology & Human Physiology Mastery',
        'Organic & Physical Chemistry Core Concepts',
        'Clinical Logic & Observational Diagnostics',
        'Medical Ethics & Community Health',
      ];
    } else if (topStream.includes('Skill & Polytechnic Engineering')) {
      topCareers = [
        'Civil Project Quality Inspector',
        'Network Systems Hardware Administrator',
        'CAD / CAM Design Technician',
        'Renewable Energy Technician',
      ];
      topCourses = [
        'Diploma in Civil Engineering (Post-10th)',
        'Diploma in Computer Engineering & Web Technologies',
        'Diploma in Electrical Engineering',
      ];
      suggestedColleges = [
        'Government Polytechnic College Srinagar',
        'Government Polytechnic College Jammu',
      ];
      skillRoadmap = [
        'Workshop Tool Safety & Engineering Drawing',
        'Field Surveying & Total Station Operation',
        'Python & Linux Terminal Basics',
        'Preparation for Direct Lateral Entry (2nd Year B.Tech)',
      ];
    } else if (topStream.includes('Commerce')) {
      topCareers = [
        'Chartered Accountant & Financial Auditor',
        'Investment Banker / Portfolio Analyst',
        'Corporate Strategist & Risk Consultant',
        'FinTech Product Manager',
      ];
      topCourses = [
        'B.Com (Honours)',
        'Bachelor of Business Administration (BBA)',
        'Economics Honours',
      ];
      suggestedColleges = ['SRCC University of Delhi', 'Shri Ram College', 'Delhi University'];
      skillRoadmap = [
        'Financial Accounting Principles',
        'Advanced Microsoft Excel & Financial Modeling',
        'Micro & Macro Economic Analysis',
        'Business Communication & Negotiation',
      ];
    } else {
      topCareers = [
        'Civil Services Administrator (IAS / IPS / JKAS)',
        'Public Policy Analyst & Legislative Researcher',
        'Investigative Journalist & Media Director',
        'Education Policy Consultant',
      ];
      topCourses = [
        'Bachelor of Arts (Honours) in Political Science',
        'BA in Public Policy & Sociology',
        'Bachelor of Journalism & Mass Communication',
      ];
      suggestedColleges = ['GDC Baramulla', 'University of Delhi', 'Kashmir University'];
      skillRoadmap = [
        'Constitution of India & Governance Frameworks',
        'Critical Writing, Essay Drafting & Rhetoric',
        'Social Research Methodologies & Field Surveys',
        'General Studies & Current Affairs Analysis',
      ];
    }

    const confidenceScore = Math.min(
      98,
      Math.max(76, Math.round(78 + (streamRankings[0].score / (streamRankings[1].score + 1)) * 12))
    );

    const assessmentDoc = await Assessment.create({
      studentId: data.studentId,
      assessmentType: 'COMPREHENSIVE_RIASEC_STREAM',
      answers: data.answers,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3 * 60 * 1000),
      completedAt: new Date(),
      scores,
      recommendations: {
        recommendedStream: topStream,
        confidenceScore,
        topCareers,
        topCourses,
        suggestedColleges,
        skillRoadmap,
      },
    });

    return assessmentDoc;
  }

  async getLatestAssessment(studentId: string) {
    return await Assessment.findOne({ studentId }).sort({ createdAt: -1 }).lean();
  }

  async getAssessmentHistory(studentId: string) {
    return await Assessment.find({ studentId }).sort({ createdAt: -1 }).lean();
  }
}

export const assessmentService = new AssessmentService();
