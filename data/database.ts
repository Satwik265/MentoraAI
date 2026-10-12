import fs from 'fs';
import path from 'path';

export interface CollegeCourse {
  id: string;
  name: string;
  degree: string;
  durationYears: number;
  stream: 'Engineering & Tech' | 'Medical & Healthcare' | 'Pure Sciences' | 'Commerce & Finance' | 'Arts & Humanities' | 'Polytechnic & Vocational';
  totalSeats: number;
  seatsBreakdown: { general: number; obc: number; sc: number; st: number; ews: number; pwd: number };
  annualFee: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  acceptedExams: string[];
  cutoffs: {
    category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
    quota: 'AI' | 'HS' | 'OS';
    closingRank: number;
    minPercentage: number;
  }[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  type: 'IIT' | 'NIT' | 'Central University' | 'State University' | 'Government Polytechnic' | 'Medical College' | 'ITI';
  state: string;
  city: string;
  campusAcres: number;
  establishedYear: number;
  nirfRank: number | null;
  naacRating: string;
  courses: CollegeCourse[];
  hostelAvailable: boolean;
  hostelFeeAnnual: number;
  website: string;
  description: string;
  governmentScholarshipsSupported: string[];
  admissionTimeline: {
    exam: string;
    registrationStart: string;
    registrationEnd: string;
    examDate: string;
    counselingDate: string;
    currentStatus: 'Registration Open' | 'Admit Card Issued' | 'Counseling Active' | 'Round 1 Allotment';
  };
  crowdsourcedRating: {
    overall: number;
    faculty: number;
    placements: number;
    infrastructure: number;
    reviewCount: number;
  };
}

export interface AssessmentQuestion {
  id: string;
  category: 'Aptitude' | 'RIASEC' | 'Interest' | 'Academic' | 'SocioEconomic';
  questionText: string;
  questionHindi: string;
  description?: string;
  options: {
    id: string;
    text: string;
    textHindi: string;
    weights: {
      tech?: number;
      medical?: number;
      commerce?: number;
      arts?: number;
      polytechnic?: number;
      analytical?: number;
      creative?: number;
      social?: number;
      entrepreneurial?: number;
    };
  }[];
}

export interface ApplicationTracker {
  id: string;
  studentId: string;
  collegeId: string;
  collegeName: string;
  courseName: string;
  examName: string;
  applicationNumber: string;
  currentStage: 'Applied' | 'Documents_Verified' | 'Merit_List' | 'Counseling' | 'Seat_Allotted' | 'Admission_Confirmed';
  deadlineDate: string;
  actionRequired: string;
  notes: string;
  updatedAt: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  originRegion: string;
  collegeAttended: string;
  degree: string;
  passoutYear: number;
  currentRole: string;
  currentOrganization: string;
  avatarUrl: string;
  story: string;
  overcomingDropoutRisk: string;
  keyAdvice: string;
  availabilityStatus: 'Available for Mentorship' | 'Reviewing Inquiries';
  mentorshipTopics: string[];
}

export interface ScholarshipScheme {
  id: string;
  title: string;
  provider: string;
  maxAnnualFamilyIncome: number;
  scholarshipAmountAnnual: number;
  targetCategory: string[];
  eligibleCourses: string[];
  applicationDeadline: string;
  portalUrl: string;
  keyBenefits: string;
  requiredDocuments: string[];
}

export interface CrowdsourcedReview {
  id: string;
  collegeId: string;
  studentName: string;
  courseAndYear: string;
  rating: number;
  verifiedStudent: boolean;
  comment: string;
  date: string;
  pros: string[];
  cons: string[];
}

export interface MentorshipRequest {
  id: string;
  alumniId: string;
  studentName: string;
  studentClass: string;
  message: string;
  status: 'Pending' | 'Answered';
  reply?: string;
  createdAt: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  completedAt: string;
  answers: Record<string, string>;
  scores: {
    tech: number;
    medical: number;
    commerce: number;
    arts: number;
    polytechnic: number;
    analytical: number;
    creative: number;
    social: number;
    entrepreneurial: number;
  };
  recommendedStream: string;
  confidenceScore: number;
  topCareers: string[];
  topCourses: string[];
  suggestedColleges: string[];
  skillRoadmap: string[];
}

// Initial Seed Data
const initialColleges: College[] = [
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    type: 'IIT',
    state: 'Delhi',
    city: 'New Delhi',
    campusAcres: 320,
    establishedYear: 1961,
    nirfRank: 2,
    naacRating: 'A++',
    hostelAvailable: true,
    hostelFeeAnnual: 35000,
    website: 'https://home.iitd.ac.in',
    description: 'Premier national institute of technology with world-class faculty, cutting-edge AI and robotics centers, and high placement records.',
    governmentScholarshipsSupported: ['National Scholarship Scheme', 'PMSSS Supernumerary', 'Fee Remission for SC/ST/PwD/EWS'],
    admissionTimeline: {
      exam: 'JEE Advanced 2025',
      registrationStart: '2025-04-20',
      registrationEnd: '2025-05-07',
      examDate: '2025-05-25',
      counselingDate: '2025-06-15',
      currentStatus: 'Counseling Active',
    },
    crowdsourcedRating: {
      overall: 4.9,
      faculty: 4.9,
      placements: 5.0,
      infrastructure: 4.8,
      reviewCount: 342,
    },
    courses: [
      {
        id: 'iitd-cse',
        name: 'B.Tech in Computer Science & Engineering',
        degree: 'B.Tech',
        durationYears: 4,
        stream: 'Engineering & Tech',
        totalSeats: 120,
        seatsBreakdown: { general: 48, obc: 32, sc: 18, st: 9, ews: 12, pwd: 6 },
        annualFee: 215000,
        avgPackageLPA: 25.8,
        highestPackageLPA: 120.0,
        acceptedExams: ['JEE Advanced'],
        cutoffs: [
          { category: 'GEN', quota: 'AI', closingRank: 118, minPercentage: 92 },
          { category: 'OBC', quota: 'AI', closingRank: 55, minPercentage: 88 },
          { category: 'SC', quota: 'AI', closingRank: 32, minPercentage: 80 },
          { category: 'ST', quota: 'AI', closingRank: 16, minPercentage: 75 },
          { category: 'EWS', quota: 'AI', closingRank: 28, minPercentage: 90 },
        ],
      },
      {
        id: 'iitd-ai',
        name: 'B.Tech in Artificial Intelligence & Machine Learning',
        degree: 'B.Tech',
        durationYears: 4,
        stream: 'Engineering & Tech',
        totalSeats: 60,
        seatsBreakdown: { general: 24, obc: 16, sc: 9, st: 5, ews: 6, pwd: 3 },
        annualFee: 215000,
        avgPackageLPA: 28.5,
        highestPackageLPA: 140.0,
        acceptedExams: ['JEE Advanced'],
        cutoffs: [
          { category: 'GEN', quota: 'AI', closingRank: 280, minPercentage: 90 },
          { category: 'OBC', quota: 'AI', closingRank: 110, minPercentage: 86 },
          { category: 'SC', quota: 'AI', closingRank: 70, minPercentage: 78 },
          { category: 'ST', quota: 'AI', closingRank: 35, minPercentage: 72 },
          { category: 'EWS', quota: 'AI', closingRank: 65, minPercentage: 88 },
        ],
      },
    ],
  },
  {
    id: 'nit-srinagar',
    name: 'National Institute of Technology Srinagar',
    shortName: 'NIT Srinagar',
    type: 'NIT',
    state: 'Jammu & Kashmir',
    city: 'Srinagar (Hazratbal)',
    campusAcres: 67,
    establishedYear: 1960,
    nirfRank: 82,
    naacRating: 'A',
    hostelAvailable: true,
    hostelFeeAnnual: 22000,
    website: 'https://nitsri.ac.in',
    description: 'Premier national technical institute nestled along Dal Lake, empowering students from J&K and across India with strong campus placement records.',
    governmentScholarshipsSupported: ['PMSSS J&K Special Scholarship', 'Central Sector Scheme', 'Post-Matric J&K Govt Scheme'],
    admissionTimeline: {
      exam: 'JEE Main 2025 / JoSAA',
      registrationStart: '2025-02-15',
      registrationEnd: '2025-03-31',
      examDate: '2025-04-12',
      counselingDate: '2025-06-20',
      currentStatus: 'Counseling Active',
    },
    crowdsourcedRating: {
      overall: 4.6,
      faculty: 4.5,
      placements: 4.4,
      infrastructure: 4.7,
      reviewCount: 215,
    },
    courses: [
      {
        id: 'nits-cse',
        name: 'B.Tech in Computer Science & Engineering',
        degree: 'B.Tech',
        durationYears: 4,
        stream: 'Engineering & Tech',
        totalSeats: 110,
        seatsBreakdown: { general: 44, obc: 30, sc: 16, st: 9, ews: 11, pwd: 5 },
        annualFee: 145000,
        avgPackageLPA: 12.8,
        highestPackageLPA: 45.0,
        acceptedExams: ['JEE Main'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 34500, minPercentage: 78 },
          { category: 'GEN', quota: 'OS', closingRank: 22800, minPercentage: 86 },
          { category: 'OBC', quota: 'HS', closingRank: 48900, minPercentage: 72 },
          { category: 'SC', quota: 'HS', closingRank: 89000, minPercentage: 65 },
          { category: 'ST', quota: 'HS', closingRank: 95000, minPercentage: 60 },
          { category: 'EWS', quota: 'HS', closingRank: 41200, minPercentage: 75 },
        ],
      },
      {
        id: 'nits-it',
        name: 'B.Tech in Information Technology',
        degree: 'B.Tech',
        durationYears: 4,
        stream: 'Engineering & Tech',
        totalSeats: 90,
        seatsBreakdown: { general: 36, obc: 24, sc: 14, st: 7, ews: 9, pwd: 4 },
        annualFee: 145000,
        avgPackageLPA: 11.2,
        highestPackageLPA: 38.0,
        acceptedExams: ['JEE Main'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 42000, minPercentage: 75 },
          { category: 'GEN', quota: 'OS', closingRank: 28500, minPercentage: 83 },
          { category: 'OBC', quota: 'HS', closingRank: 59000, minPercentage: 70 },
          { category: 'SC', quota: 'HS', closingRank: 105000, minPercentage: 62 },
        ],
      },
    ],
  },
  {
    id: 'gmc-jammu',
    name: 'Government Medical College Jammu',
    shortName: 'GMC Jammu',
    type: 'Medical College',
    state: 'Jammu & Kashmir',
    city: 'Jammu',
    campusAcres: 55,
    establishedYear: 1973,
    nirfRank: 45,
    naacRating: 'A',
    hostelAvailable: true,
    hostelFeeAnnual: 12000,
    website: 'https://gmcjammu.nic.in',
    description: 'Premier tertiary healthcare and medical training government institution catering to northern India with super-specialty hospitals.',
    governmentScholarshipsSupported: ['JKBOPEE Merit Aid', 'PMSSS Medical Quota', 'Central Sector Scholarship'],
    admissionTimeline: {
      exam: 'NEET UG 2025 / JKBOPEE',
      registrationStart: '2025-02-09',
      registrationEnd: '2025-03-16',
      examDate: '2025-05-04',
      counselingDate: '2025-07-10',
      currentStatus: 'Counseling Active',
    },
    crowdsourcedRating: {
      overall: 4.7,
      faculty: 4.8,
      placements: 4.9,
      infrastructure: 4.3,
      reviewCount: 189,
    },
    courses: [
      {
        id: 'gmcj-mbbs',
        name: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
        degree: 'MBBS',
        durationYears: 5.5,
        stream: 'Medical & Healthcare',
        totalSeats: 180,
        seatsBreakdown: { general: 72, obc: 48, sc: 27, st: 15, ews: 18, pwd: 9 },
        annualFee: 26000,
        avgPackageLPA: 14.5,
        highestPackageLPA: 30.0,
        acceptedExams: ['NEET UG'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 16500, minPercentage: 82 },
          { category: 'GEN', quota: 'AI', closingRank: 8400, minPercentage: 90 },
          { category: 'OBC', quota: 'HS', closingRank: 24500, minPercentage: 76 },
          { category: 'SC', quota: 'HS', closingRank: 45000, minPercentage: 70 },
          { category: 'ST', quota: 'HS', closingRank: 62000, minPercentage: 65 },
        ],
      },
    ],
  },
  {
    id: 'govt-polytechnic-srinagar',
    name: 'Government Polytechnic College Srinagar',
    shortName: 'Govt Poly Srinagar',
    type: 'Government Polytechnic',
    state: 'Jammu & Kashmir',
    city: 'Srinagar',
    campusAcres: 24,
    establishedYear: 1958,
    nirfRank: null,
    naacRating: 'B++',
    hostelAvailable: true,
    hostelFeeAnnual: 8000,
    website: 'https://govtpolytechnicsrinagar.edu.in',
    description: 'Premier skill & vocational diploma engineering institute directly tackling post-class 10 dropout with 100% subsidized education and hands-on industrial labs.',
    governmentScholarshipsSupported: ['J&K Skill Development Grant', 'Post-Matric Scholarship', 'Pragati Scholarship for Girls in Technical Education'],
    admissionTimeline: {
      exam: 'JKBOPEE Diploma CET / 10th Merit',
      registrationStart: '2025-04-01',
      registrationEnd: '2025-05-15',
      examDate: '2025-06-01',
      counselingDate: '2025-06-25',
      currentStatus: 'Registration Open',
    },
    crowdsourcedRating: {
      overall: 4.5,
      faculty: 4.4,
      placements: 4.2,
      infrastructure: 4.3,
      reviewCount: 142,
    },
    courses: [
      {
        id: 'gps-civil',
        name: 'Diploma in Civil Engineering (Post-10th)',
        degree: 'Diploma',
        durationYears: 3,
        stream: 'Polytechnic & Vocational',
        totalSeats: 90,
        seatsBreakdown: { general: 36, obc: 24, sc: 14, st: 7, ews: 9, pwd: 4 },
        annualFee: 4800,
        avgPackageLPA: 4.2,
        highestPackageLPA: 7.5,
        acceptedExams: ['Class 10 Board Marks', 'JKBOPEE CET'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 450, minPercentage: 60 },
          { category: 'OBC', quota: 'HS', closingRank: 850, minPercentage: 50 },
          { category: 'SC', quota: 'HS', closingRank: 1200, minPercentage: 45 },
          { category: 'ST', quota: 'HS', closingRank: 1400, minPercentage: 42 },
        ],
      },
      {
        id: 'gps-computer',
        name: 'Diploma in Computer Engineering & Web Technologies',
        degree: 'Diploma',
        durationYears: 3,
        stream: 'Polytechnic & Vocational',
        totalSeats: 60,
        seatsBreakdown: { general: 24, obc: 16, sc: 9, st: 5, ews: 6, pwd: 3 },
        annualFee: 4800,
        avgPackageLPA: 4.8,
        highestPackageLPA: 8.4,
        acceptedExams: ['Class 10 Board Marks', 'JKBOPEE CET'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 320, minPercentage: 65 },
          { category: 'OBC', quota: 'HS', closingRank: 600, minPercentage: 55 },
          { category: 'SC', quota: 'HS', closingRank: 950, minPercentage: 48 },
        ],
      },
    ],
  },
  {
    id: 'du-srcc',
    name: 'Shri Ram College of Commerce, University of Delhi',
    shortName: 'SRCC DU',
    type: 'Central University',
    state: 'Delhi',
    city: 'New Delhi',
    campusAcres: 16,
    establishedYear: 1926,
    nirfRank: 11,
    naacRating: 'A++',
    hostelAvailable: true,
    hostelFeeAnnual: 48000,
    website: 'https://srcc.edu',
    description: 'India’s foremost undergraduate institution for commerce and economics, producing renowned business leaders, economists, and civil servants.',
    governmentScholarshipsSupported: ['Central Sector Scholarship', 'Post-Matric SC/ST Schemes', 'DU Vice Chancellor Student Fund'],
    admissionTimeline: {
      exam: 'CUET UG 2025',
      registrationStart: '2025-02-27',
      registrationEnd: '2025-04-05',
      examDate: '2025-05-15',
      counselingDate: '2025-07-01',
      currentStatus: 'Counseling Active',
    },
    crowdsourcedRating: {
      overall: 4.9,
      faculty: 4.9,
      placements: 4.9,
      infrastructure: 4.7,
      reviewCount: 420,
    },
    courses: [
      {
        id: 'srcc-bcom',
        name: 'B.Com (Honours)',
        degree: 'B.Com (Hons)',
        durationYears: 3,
        stream: 'Commerce & Finance',
        totalSeats: 650,
        seatsBreakdown: { general: 260, obc: 175, sc: 98, st: 49, ews: 68, pwd: 32 },
        annualFee: 32000,
        avgPackageLPA: 10.5,
        highestPackageLPA: 35.0,
        acceptedExams: ['CUET UG'],
        cutoffs: [
          { category: 'GEN', quota: 'AI', closingRank: 250, minPercentage: 98 },
          { category: 'OBC', quota: 'AI', closingRank: 620, minPercentage: 94 },
          { category: 'SC', quota: 'AI', closingRank: 1400, minPercentage: 88 },
          { category: 'ST', quota: 'AI', closingRank: 2100, minPercentage: 82 },
          { category: 'EWS', quota: 'AI', closingRank: 480, minPercentage: 95 },
        ],
      },
    ],
  },
  {
    id: 'coep-pune',
    name: 'COEP Technological University (Government)',
    shortName: 'COEP Pune',
    type: 'State University',
    state: 'Maharashtra',
    city: 'Pune',
    campusAcres: 36,
    establishedYear: 1854,
    nirfRank: 73,
    naacRating: 'A+',
    hostelAvailable: true,
    hostelFeeAnnual: 30000,
    website: 'https://coep.org.in',
    description: 'One of the oldest and most prestigious state government engineering colleges in Asia, known for outstanding technical labs, student satellite projects, and industry ties.',
    governmentScholarshipsSupported: ['MahaDBT Rajarshi Shahu Maharaj Scheme', 'Dr. Ambedkar Post-Matric Scheme', 'PMSSS Supernumerary Quota'],
    admissionTimeline: {
      exam: 'MHT-CET / JEE Main / CAP Rounds',
      registrationStart: '2025-01-16',
      registrationEnd: '2025-03-08',
      examDate: '2025-04-22',
      counselingDate: '2025-06-28',
      currentStatus: 'Counseling Active',
    },
    crowdsourcedRating: {
      overall: 4.8,
      faculty: 4.7,
      placements: 4.8,
      infrastructure: 4.6,
      reviewCount: 310,
    },
    courses: [
      {
        id: 'coep-comp',
        name: 'B.Tech in Computer Engineering',
        degree: 'B.Tech',
        durationYears: 4,
        stream: 'Engineering & Tech',
        totalSeats: 150,
        seatsBreakdown: { general: 60, obc: 40, sc: 23, st: 11, ews: 16, pwd: 7 },
        annualFee: 85000,
        avgPackageLPA: 14.2,
        highestPackageLPA: 50.5,
        acceptedExams: ['MHT-CET', 'JEE Main'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 380, minPercentage: 99.2 },
          { category: 'OBC', quota: 'HS', closingRank: 850, minPercentage: 98.4 },
          { category: 'SC', quota: 'HS', closingRank: 2400, minPercentage: 95.0 },
          { category: 'ST', quota: 'HS', closingRank: 5600, minPercentage: 90.0 },
        ],
      },
    ],
  },
  {
    id: 'gdc-baramulla',
    name: 'Government Degree College Baramulla',
    shortName: 'GDC Baramulla',
    type: 'State University',
    state: 'Jammu & Kashmir',
    city: 'Baramulla',
    campusAcres: 30,
    establishedYear: 1940,
    nirfRank: null,
    naacRating: 'A',
    hostelAvailable: true,
    hostelFeeAnnual: 10000,
    website: 'https://gdcbaramulla.net',
    description: 'Premier multi-disciplinary higher educational institution in North Kashmir offering Arts, Pure Sciences, Computer Applications, and Vocational Skill Programs.',
    governmentScholarshipsSupported: ['PMSSS J&K', 'Post-Matric Scholarship Scheme', 'Kashmir University Merit Aid'],
    admissionTimeline: {
      exam: 'CUET UG / 12th Board Merit SAMARTH Portal',
      registrationStart: '2025-03-01',
      registrationEnd: '2025-04-20',
      examDate: '2025-05-20',
      counselingDate: '2025-07-05',
      currentStatus: 'Registration Open',
    },
    crowdsourcedRating: {
      overall: 4.4,
      faculty: 4.5,
      placements: 4.0,
      infrastructure: 4.3,
      reviewCount: 96,
    },
    courses: [
      {
        id: 'gdcb-bca',
        name: 'Bachelor of Computer Applications (BCA)',
        degree: 'BCA',
        durationYears: 3,
        stream: 'Engineering & Tech',
        totalSeats: 80,
        seatsBreakdown: { general: 32, obc: 22, sc: 12, st: 6, ews: 8, pwd: 4 },
        annualFee: 9500,
        avgPackageLPA: 5.2,
        highestPackageLPA: 12.0,
        acceptedExams: ['CUET UG', 'Class 12 Marks'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 850, minPercentage: 70 },
          { category: 'OBC', quota: 'HS', closingRank: 1400, minPercentage: 62 },
          { category: 'SC', quota: 'HS', closingRank: 1900, minPercentage: 55 },
        ],
      },
      {
        id: 'gdcb-bsc',
        name: 'B.Sc in Biotechnology & Environmental Science',
        degree: 'B.Sc',
        durationYears: 3,
        stream: 'Pure Sciences',
        totalSeats: 120,
        seatsBreakdown: { general: 48, obc: 32, sc: 18, st: 9, ews: 12, pwd: 6 },
        annualFee: 8200,
        avgPackageLPA: 4.5,
        highestPackageLPA: 8.0,
        acceptedExams: ['CUET UG', 'Class 12 Marks'],
        cutoffs: [
          { category: 'GEN', quota: 'HS', closingRank: 1200, minPercentage: 65 },
          { category: 'OBC', quota: 'HS', closingRank: 1800, minPercentage: 58 },
        ],
      },
    ],
  },
];

const initialQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    category: 'Aptitude',
    questionText: 'When faced with a complex problem or gadget that stopped working, what is your natural reaction?',
    questionHindi: 'जब कोई जटिल समस्या या उपकरण काम करना बंद कर देता है, तो आपकी स्वाभाविक प्रतिक्रिया क्या होती है?',
    options: [
      {
        id: 'q1-a',
        text: 'Take it apart step-by-step, inspect circuits/mechanics, and figure out the logical failure point.',
        textHindi: 'इसे चरणबद्ध तरीके से खोलना, सर्किट/पुर्जों की जांच करना और तार्किक खराबी ढूंढना।',
        weights: { tech: 4, polytechnic: 4, analytical: 3 },
      },
      {
        id: 'q1-b',
        text: 'Read biology/chemical facts, diagnose human health symptoms, or understand natural living systems.',
        textHindi: 'जैविक/रासायनिक तथ्यों को समझना, स्वास्थ्य लक्षणों का निदान करना या प्रकृति को समझना।',
        weights: { medical: 4, analytical: 2 },
      },
      {
        id: 'q1-c',
        text: 'Calculate the cost-benefit of repairing it vs buying a new one, or draft an investment plan.',
        textHindi: 'मरम्मत बनाम नए खरीदने के लागत-लाभ की गणना करना या वित्तीय योजना बनाना।',
        weights: { commerce: 4, entrepreneurial: 3 },
      },
      {
        id: 'q1-d',
        text: 'Imagine a creative redesign, write a story about it, or explain the societal impact on communities.',
        textHindi: 'रचनात्मक पुनर्डिज़ाइन की कल्पना करना, कहानी लिखना या समाज पर प्रभाव को समझना।',
        weights: { arts: 4, creative: 4, social: 3 },
      },
    ],
  },
  {
    id: 'q2',
    category: 'RIASEC',
    questionText: 'Which work environment sounds most energizing and fulfilling for your future?',
    questionHindi: 'आपके भविष्य के लिए कौन सा कार्य वातावरण सबसे अधिक उत्साहजनक और संतुष्टिदायक लगता है?',
    options: [
      {
        id: 'q2-a',
        text: 'Software lab / Industrial engineering workshop building tangible devices or coding applications.',
        textHindi: 'सॉफ्टवेयर लैब या इंजीनियरिंग वर्कशॉप में उपकरण बनाना या कोडिंग करना।',
        weights: { tech: 4, polytechnic: 3 },
      },
      {
        id: 'q2-b',
        text: 'Hospital / Clinical diagnostic center helping patients heal and conducting health research.',
        textHindi: 'अस्पताल या क्लिनिक में मरीजों की सेवा करना और स्वास्थ्य अनुसंधान करना।',
        weights: { medical: 4, social: 3 },
      },
      {
        id: 'q2-c',
        text: 'Financial stock exchange, consulting boardroom, or running my own startup enterprise.',
        textHindi: 'स्टॉक एक्सचेंज, वित्तीय परामर्श या अपना खुद का स्टार्टअप चलाना।',
        weights: { commerce: 4, entrepreneurial: 4 },
      },
      {
        id: 'q2-d',
        text: 'Civil services district office, news media studio, NGO, or educational policy think-tank.',
        textHindi: 'प्रशासनिक सेवा कार्यालय, मीडिया स्टूडियो, सामाजिक संस्था या शिक्षा संस्थान।',
        weights: { arts: 4, social: 4 },
      },
    ],
  },
  {
    id: 'q3',
    category: 'Academic',
    questionText: 'Which subject combination gave you the greatest curiosity and satisfaction in school?',
    questionHindi: 'स्कूल में किस विषय संयोजन ने आपको सबसे अधिक संतुष्टि और सीखने की उत्सुकता दी?',
    options: [
      {
        id: 'q3-a',
        text: 'Mathematics and Physics (Solving equations, force dynamics, electricity, algorithms).',
        textHindi: 'गणित और भौतिक विज्ञान (समीकरण, बल यांत्रिकी, बिजली, एल्गोरिदम हल करना)।',
        weights: { tech: 4, analytical: 4 },
      },
      {
        id: 'q3-b',
        text: 'Biology and Chemistry (Genetics, human anatomy, organ systems, organic molecules).',
        textHindi: 'जीव विज्ञान और रसायन शास्त्र (आनुवंशिकी, मानव शरीर रचना, अणु)।',
        weights: { medical: 4, analytical: 3 },
      },
      {
        id: 'q3-c',
        text: 'Accountancy, Business Studies, and Economics (Market demand, profit-loss, trade, taxation).',
        textHindi: 'लेखाशास्त्र, व्यावसायिक अध्ययन और अर्थशास्त्र (बाजार मांग, लाभ-हानि, कर व्यवस्था)।',
        weights: { commerce: 4, analytical: 2 },
      },
      {
        id: 'q3-d',
        text: 'History, Political Science, Literature, and Sociology (Constitution, human rights, storytelling).',
        textHindi: 'इतिहास, राजनीति विज्ञान, साहित्य और समाजशास्त्र (संविधान, मानवाधिकार, भाषा)।',
        weights: { arts: 4, social: 3, creative: 3 },
      },
      {
        id: 'q3-e',
        text: 'Practical hands-on vocational workshops (Machining, carpentry, electrical wiring, coding basics).',
        textHindi: 'व्यावहारिक कार्यशालाएं (मशीनिंग, बिजली वायरिंग, बुनियादी कोडिंग, मोबाइल रिपेयरिंग)।',
        weights: { polytechnic: 5, tech: 2 },
      },
    ],
  },
  {
    id: 'q4',
    category: 'SocioEconomic',
    questionText: 'What is your primary educational priority regarding graduation duration and financial cost?',
    questionHindi: 'स्नातक अवधि और वित्तीय लागत के संबंध में आपकी मुख्य प्राथमिकता क्या है?',
    options: [
      {
        id: 'q4-a',
        text: 'I want a high-ROI 4-year degree from a top government college (IIT/NIT/Central Univ) with high starting salary.',
        textHindi: 'शीर्ष सरकारी कॉलेज (IIT/NIT) से उच्च पैकेज वाली 4-वर्षीय डिग्री प्राप्त करना।',
        weights: { tech: 3, commerce: 3 },
      },
      {
        id: 'q4-b',
        text: 'I need a fast, low-cost 2-3 year vocational diploma (Polytechnic/ITI) to get employed quickly and support family.',
        textHindi: 'परिवार को सहायता देने के लिए कम खर्च वाला 2-3 साल का डिप्लोमा (पॉलिटेक्निक/ITI) जिससे तुरंत रोजगार मिले।',
        weights: { polytechnic: 5 },
      },
      {
        id: 'q4-c',
        text: 'I am passionate about healthcare/medicine and willing to commit 5+ years for MBBS/BDS/Nursing despite rigorous study.',
        textHindi: 'चिकित्सा क्षेत्र में गहरी रुचि है और MBBS/नर्सिंग के लिए 5+ वर्ष समर्पित करने को तैयार हूं।',
        weights: { medical: 5 },
      },
      {
        id: 'q4-d',
        text: 'I want a balanced undergraduate degree (BA / B.Sc / B.Com) while preparing for UPSC / State PSC or defense services.',
        textHindi: 'सरकारी प्रशासनिक परीक्षा (UPSC/PSC/सेना) की तैयारी के साथ 3-वर्षीय स्नातक डिग्री करना।',
        weights: { arts: 4, commerce: 2 },
      },
    ],
  },
];

const initialScholarships: ScholarshipScheme[] = [
  {
    id: 'pmsss-jk',
    title: "Prime Minister's Special Scholarship Scheme (PMSSS) for J&K and Ladakh",
    provider: 'AICTE & Ministry of Education, Govt of India',
    maxAnnualFamilyIncome: 800000,
    scholarshipAmountAnnual: 125000,
    targetCategory: ['J&K / Ladakh Domicile', 'All Categories'],
    eligibleCourses: ['B.Tech / Engineering', 'Medical / Nursing / Pharmacy', 'General Degree (BA, B.Sc, B.Com)'],
    applicationDeadline: '2025-07-31',
    portalUrl: 'https://aicte-jk-scholarship-gov.in',
    keyBenefits: '100% academic fee waiver directly reimbursed to college + ₹1,00,000 per year maintenance allowance for hostel & books.',
    requiredDocuments: ['Domicile Certificate of J&K/Ladakh', 'Family Income Certificate (<₹8 Lakh)', '10th & 12th Marksheets', 'Aadhaar Card'],
  },
  {
    id: 'central-sector-scheme',
    title: 'Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Department of Higher Education, Govt of India',
    maxAnnualFamilyIncome: 450000,
    scholarshipAmountAnnual: 20000,
    targetCategory: ['Merit-cum-Means', 'Top 20th Percentile in Board'],
    eligibleCourses: ['All Undergraduate Degrees in Govt Institutions'],
    applicationDeadline: '2025-10-31',
    portalUrl: 'https://scholarships.gov.in',
    keyBenefits: '₹12,000 per year for 1st 3 years of graduation; ₹20,000 per year at PG level directly via DBT into student bank account.',
    requiredDocuments: ['National Scholarship Portal (NSP) Registration', 'Income Certificate', 'Class 12 Board Percentile Certificate'],
  },
  {
    id: 'pragati-girls-tech',
    title: 'AICTE Pragati Scholarship for Girl Students (Technical Degree & Diploma)',
    provider: 'All India Council for Technical Education (AICTE)',
    maxAnnualFamilyIncome: 800000,
    scholarshipAmountAnnual: 50000,
    targetCategory: ['Female Students Only', 'Engineering & Polytechnic'],
    eligibleCourses: ['B.Tech (1st Year / Lateral Entry)', 'Polytechnic Diploma (1st Year)'],
    applicationDeadline: '2025-11-15',
    portalUrl: 'https://www.aicte-pragati-saksham-gov.in',
    keyBenefits: '₹50,000 per annum paid as lump sum for college fees, computer purchase, books and stationery.',
    requiredDocuments: ['Family Income Certificate', 'Admission Letter in AICTE approved college', 'Bank Passbook copy'],
  },
  {
    id: 'post-matric-sc-st',
    title: 'Post-Matric Scholarship Scheme for SC / ST / OBC Students',
    provider: 'Ministry of Social Justice & Empowerment, Govt of India',
    maxAnnualFamilyIncome: 250000,
    scholarshipAmountAnnual: 35000,
    targetCategory: ['SC', 'ST', 'OBC-NCL'],
    eligibleCourses: ['Polytechnic', 'ITI', 'Undergraduate', 'Postgraduate'],
    applicationDeadline: '2025-11-30',
    portalUrl: 'https://scholarships.gov.in',
    keyBenefits: 'Full tuition fee reimbursement + monthly study stipend to eliminate financial dropout risks.',
    requiredDocuments: ['Caste / Category Certificate', 'Income Certificate issued by Tehsildar', 'Fee Receipt from College'],
  },
];

const initialAlumni: AlumniProfile[] = [
  {
    id: 'alumni-1',
    name: 'Er. Tariq Ahmad Mir',
    originRegion: 'Kulgam, South Kashmir',
    collegeAttended: 'NIT Srinagar',
    degree: 'B.Tech in Computer Science',
    passoutYear: 2021,
    currentRole: 'Senior Cloud Systems Engineer',
    currentOrganization: 'Oracle India (Bengaluru)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    story: 'Coming from a small apple-farming family in rural Kulgam with limited internet access during shutdowns, I almost dropped out after Class 10 due to financial strain. With guidance on PMSSS scholarship and focused JEE prep through government libraries, I cracked NIT Srinagar.',
    overcomingDropoutRisk: 'Utilized state government free digital library and took PMSSS scholarship which covered 100% of my college expenses and boarding.',
    keyAdvice: 'Do not let geographical remoteness stop you. Government colleges have world-class research facilities and equal recruitment packages if you master foundational coding.',
    availabilityStatus: 'Available for Mentorship',
    mentorshipTopics: ['PMSSS Scholarship Guidance', 'Crack Tech Interviews from NIT/Govt Colleges', 'Coding for Beginners'],
  },
  {
    id: 'alumni-2',
    name: 'Dr. Sunita Sharma',
    originRegion: 'Udhampur, Jammu',
    collegeAttended: 'GMC Jammu',
    degree: 'MBBS & MD Pediatrics',
    passoutYear: 2019,
    currentRole: 'Medical Officer & Pediatric Specialist',
    currentOrganization: 'Government District Hospital Udhampur',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813589-fb341be92d47?auto=format&fit=crop&w=400&q=80',
    story: 'My parents were school teachers. Medical coaching felt unaffordable until our district education office introduced NCERT-focused test banks. GMC Jammu provided subsidized top-tier medical education at less than ₹30,000 per year.',
    overcomingDropoutRisk: 'Leveraged state merit scholarships and subsidized government hostel facilities to complete MBBS without any loans.',
    keyAdvice: 'Medical entrance needs NCERT mastery rather than expensive coaching institutes. Believe in your daily discipline.',
    availabilityStatus: 'Available for Mentorship',
    mentorshipTopics: ['NEET UG Strategy for Govt Colleges', 'Affordable Medical Education', 'Balancing Stress in High School'],
  },
  {
    id: 'alumni-3',
    name: 'Irfan Rashid Lone',
    originRegion: 'Baramulla, J&K',
    collegeAttended: 'Govt Polytechnic College Srinagar',
    degree: 'Diploma in Civil & Infrastructure',
    passoutYear: 2020,
    currentRole: 'Assistant Project Engineer & Entrepreneur',
    currentOrganization: 'Kashmir Smart City Infrastructure Project',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    story: 'After scoring 68% in 10th, society told me I had no future. I chose a 3-year Government Polytechnic diploma with an annual fee of only ₹4,800. Today, I lead highway quality assurance teams and founded my own surveying consultancy.',
    overcomingDropoutRisk: 'Polytechnic gave me immediate industrial skills and job security at age 19 without burdening my parents.',
    keyAdvice: 'Polytechnic diplomas are the most underrated gateway. You can start earning at 19 or enter 2nd year B.Tech directly via Lateral Entry!',
    availabilityStatus: 'Available for Mentorship',
    mentorshipTopics: ['Polytechnic Career Advantages', 'Lateral Entry to B.Tech', 'Starting Local Tech Enterprises'],
  },
  {
    id: 'alumni-4',
    name: 'Priyanka Verma',
    originRegion: 'Kanpur, Uttar Pradesh',
    collegeAttended: 'SRCC, University of Delhi',
    degree: 'B.Com (Hons)',
    passoutYear: 2022,
    currentRole: 'Financial Risk Analyst',
    currentOrganization: 'Goldman Sachs',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    story: 'First woman in my extended family to pursue university outside our village. The CUET entrance format allowed me to compete fairly without paying donation seats.',
    overcomingDropoutRisk: 'Received Central Sector Scholarship and stayed in the government subsidized DU hostel.',
    keyAdvice: 'Commerce with analytics opens doors to global financial institutes. Keep building your excel and financial modeling skills.',
    availabilityStatus: 'Available for Mentorship',
    mentorshipTopics: ['CUET Preparation Plan', 'Finance & Consulting Careers', 'Hostel Life in Delhi University'],
  },
];

const initialApplications: ApplicationTracker[] = [
  {
    id: 'app-1',
    studentId: 'demo-student',
    collegeId: 'nit-srinagar',
    collegeName: 'NIT Srinagar',
    courseName: 'B.Tech in Computer Science & Engineering',
    examName: 'JEE Main 2025',
    applicationNumber: 'JEE25-8834912',
    currentStage: 'Counseling',
    deadlineDate: '2025-07-15',
    actionRequired: 'Verify Choice Filling Order for JoSAA Round 3 Counseling',
    notes: 'Submitted PMSSS document verification token at the nodal facilitation center.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    studentId: 'demo-student',
    collegeId: 'govt-polytechnic-srinagar',
    collegeName: 'Govt Polytechnic College Srinagar',
    courseName: 'Diploma in Computer Engineering & Web Technologies',
    examName: 'JKBOPEE CET / 10th Merit',
    applicationNumber: 'POLY25-004128',
    currentStage: 'Documents_Verified',
    deadlineDate: '2025-07-28',
    actionRequired: 'Download Merit Rank Card from JKBOPEE portal',
    notes: 'Seat predicted with 98% probability under Home State General quota.',
    updatedAt: new Date().toISOString(),
  },
];

const initialReviews: CrowdsourcedReview[] = [
  {
    id: 'rev-1',
    collegeId: 'nit-srinagar',
    studentName: 'Zubair Wani',
    courseAndYear: 'B.Tech CSE, 3rd Year',
    rating: 5,
    verifiedStudent: true,
    comment: 'The coding culture and newly inaugurated AI lab on campus are exceptional. Placement drive had Google, Microsoft, and public sector units.',
    date: '2025-08-14',
    pros: ['Scenic campus near Dal Lake', 'Strong coding community', 'Affordable government fees with PMSSS'],
    cons: ['Cold winter months require campus schedule adjustments'],
  },
  {
    id: 'rev-2',
    collegeId: 'govt-polytechnic-srinagar',
    studentName: 'Aaliya Jan',
    courseAndYear: 'Civil Engineering Diploma, Passed Out 2024',
    rating: 5,
    verifiedStudent: true,
    comment: 'Best decision for students who want high quality technical skills after Class 10 without spending lakhs. Teachers are very patient with first-generation learners.',
    date: '2025-06-10',
    pros: ['Extremely low fee (<₹5,000/year)', 'State-of-the-art surveying gear', 'Direct campus placements'],
    cons: ['More hostel rooms needed for outstation students'],
  },
  {
    id: 'rev-3',
    collegeId: 'iit-delhi',
    studentName: 'Aditya Gupta',
    courseAndYear: 'B.Tech AI & Data Science, 2nd Year',
    rating: 5,
    verifiedStudent: true,
    comment: 'Unmatched research opportunities and student startup incubators. The entrepreneurship development cell gives seed grants up to ₹10 Lakhs.',
    date: '2025-05-19',
    pros: ['World class professors', 'Top recruiters in India & abroad', 'Vibrant student clubs'],
    cons: ['Fast-paced academic curriculum requires good time management'],
  },
];

// Persistent Database Handler
interface DatabaseSchema {
  colleges: College[];
  questions: AssessmentQuestion[];
  scholarships: ScholarshipScheme[];
  alumni: AlumniProfile[];
  applications: ApplicationTracker[];
  reviews: CrowdsourcedReview[];
  mentorshipRequests: MentorshipRequest[];
  assessments: AssessmentRecord[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'mentora_db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Error reading db file, reinitializing default data:', err);
    }

    const defaultData: DatabaseSchema = {
      colleges: initialColleges,
      questions: initialQuestions,
      scholarships: initialScholarships,
      alumni: initialAlumni,
      applications: initialApplications,
      reviews: initialReviews,
      mentorshipRequests: [],
      assessments: [],
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Colleges
  getColleges(filters?: { query?: string; state?: string; stream?: string; maxFee?: number; type?: string }) {
    let list = [...this.data.colleges];
    if (!filters) return list;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.courses.some(crs => crs.name.toLowerCase().includes(q) || crs.degree.toLowerCase().includes(q))
      );
    }

    if (filters.state && filters.state !== 'All') {
      list = list.filter(c => c.state.toLowerCase() === filters.state?.toLowerCase());
    }

    if (filters.type && filters.type !== 'All') {
      list = list.filter(c => c.type === filters.type);
    }

    if (filters.stream && filters.stream !== 'All') {
      list = list.filter(c => c.courses.some(crs => crs.stream === filters.stream));
    }

    if (filters.maxFee && filters.maxFee > 0) {
      list = list.filter(c => c.courses.some(crs => crs.annualFee <= filters.maxFee!));
    }

    return list;
  }

  getCollegeById(id: string) {
    return this.data.colleges.find(c => c.id === id);
  }

  // Predict Cutoff
  predictAdmission(input: {
    collegeId: string;
    courseId: string;
    studentScore: number; // percentage or rank
    scoreType: 'rank' | 'percentage';
    category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
    quota: 'AI' | 'HS' | 'OS';
  }) {
    const college = this.getCollegeById(input.collegeId);
    if (!college) return { success: false, message: 'College not found' };

    const course = college.courses.find(c => c.id === input.courseId);
    if (!course) return { success: false, message: 'Course not found' };

    // Find closest cutoff
    const cutoffRule =
      course.cutoffs.find(c => c.category === input.category && c.quota === input.quota) ||
      course.cutoffs.find(c => c.category === input.category) ||
      course.cutoffs[0];

    let chancePercentage = 50;
    let probability: 'High' | 'Moderate' | 'Reach' | 'Low' = 'Moderate';
    let reasoning = '';

    if (input.scoreType === 'percentage') {
      const minP = cutoffRule.minPercentage;
      if (input.studentScore >= minP + 5) {
        chancePercentage = 95;
        probability = 'High';
        reasoning = `Your score (${input.studentScore}%) exceeds the closing cutoff benchmark (${minP}%) comfortably for ${input.category} quota.`;
      } else if (input.studentScore >= minP) {
        chancePercentage = 78;
        probability = 'High';
        reasoning = `Your score (${input.studentScore}%) is above the historical cutoff threshold (${minP}%). High probability in Round 1 or 2.`;
      } else if (input.studentScore >= minP - 6) {
        chancePercentage = 54;
        probability = 'Moderate';
        reasoning = `Your score (${input.studentScore}%) is within 6% of the cut-off mark (${minP}%). Likely to clear in subsequent rounds or mop-up.`;
      } else {
        chancePercentage = 22;
        probability = 'Reach';
        reasoning = `Score is slightly below typical historical closing bounds (${minP}%). Recommend keeping backup options or applying via specialized state domicile quota.`;
      }
    } else {
      // rank (lower rank number is better)
      const closingR = cutoffRule.closingRank;
      if (input.studentScore <= closingR * 0.7) {
        chancePercentage = 98;
        probability = 'High';
        reasoning = `Your rank (#${input.studentScore}) is well within the closing rank (#${closingR}) for ${input.category} candidates.`;
      } else if (input.studentScore <= closingR) {
        chancePercentage = 84;
        probability = 'High';
        reasoning = `Your rank (#${input.studentScore}) clears historical round cutoffs (#${closingR}).`;
      } else if (input.studentScore <= closingR * 1.35) {
        chancePercentage = 52;
        probability = 'Moderate';
        reasoning = `Your rank (#${input.studentScore}) is competitive for Round 3 or CSAB special vacant seats.`;
      } else {
        chancePercentage = 18;
        probability = 'Reach';
        reasoning = `Rank (#${input.studentScore}) is above typical closing rank (#${closingR}). Consider other government colleges or polytechnic degree tracks.`;
      }
    }

    return {
      success: true,
      collegeName: college.name,
      courseName: course.name,
      chancePercentage,
      probability,
      reasoning,
      historicalClosing: cutoffRule,
      seatAvailability: course.seatsBreakdown,
      annualFee: course.annualFee,
      avgPackageLPA: course.avgPackageLPA,
      timeline: college.admissionTimeline,
    };
  }

  // Assessments
  getQuestions() {
    return this.data.questions;
  }

  evaluateAndSaveAssessment(input: {
    studentId: string;
    answers: Record<string, string>;
  }): AssessmentRecord {
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

    // Accumulative scoring algorithm
    for (const [qId, optId] of Object.entries(input.answers)) {
      const q = this.data.questions.find(item => item.id === qId);
      if (q) {
        const opt = q.options.find(o => o.id === optId);
        if (opt && opt.weights) {
          for (const [key, val] of Object.entries(opt.weights)) {
            if (key in scores) {
              (scores as any)[key] += val || 0;
            }
          }
        }
      }
    }

    // Determine highest scoring stream
    const streamRankings = [
      { name: 'Engineering & Technology (PCM / Computer Science)', score: scores.tech * 1.2 + scores.analytical },
      { name: 'Medical & Life Sciences (PCB / Healthcare)', score: scores.medical * 1.2 + scores.social * 0.5 },
      { name: 'Commerce, Finance & Entrepreneurship', score: scores.commerce * 1.2 + scores.entrepreneurial },
      { name: 'Arts, Humanities & Public Governance', score: scores.arts * 1.2 + scores.social + scores.creative },
      { name: 'Skill & Polytechnic Engineering (Hands-on Vocational)', score: scores.polytechnic * 1.3 },
    ].sort((a, b) => b.score - a.score);

    const topStream = streamRankings[0].name;

    // Tailor careers & degrees
    let topCareers: string[] = [];
    let topCourses: string[] = [];
    let suggestedColleges: string[] = [];
    let skillRoadmap: string[] = [];

    if (topStream.includes('Engineering & Technology')) {
      topCareers = ['AI & Machine Learning Engineer', 'Cloud Infrastructure Architect', 'Robotics Systems Developer', 'Cybersecurity Analyst'];
      topCourses = ['B.Tech in Artificial Intelligence & ML', 'B.Tech in Computer Science & Engineering', 'B.Tech in Information Technology'];
      suggestedColleges = ['IIT Delhi', 'NIT Srinagar', 'COEP Pune'];
      skillRoadmap = ['Python & Algorithmic Problem Solving', 'Calculus & Linear Algebra', 'Web Full-Stack Basics', 'Data Structures & System Design'];
    } else if (topStream.includes('Medical')) {
      topCareers = ['Physician / Surgeon (MBBS)', 'Clinical Research Scientist', 'Biotechnologist', 'Public Health Epidemiologist'];
      topCourses = ['Bachelor of Medicine, Bachelor of Surgery (MBBS)', 'B.Sc in Biotechnology', 'Bachelor of Pharmacy (B.Pharm)'];
      suggestedColleges = ['GMC Jammu', 'AIIMS New Delhi', 'GDC Baramulla'];
      skillRoadmap = ['NCERT Biology In-Depth Mastery', 'Organic Reaction Mechanisms', 'Clinical Diagnosis Protocols', 'Biochemical Lab Analysis'];
    } else if (topStream.includes('Commerce')) {
      topCareers = ['Investment Banker / Financial Analyst', 'Chartered Accountant (CA)', 'E-Commerce Growth Founder', 'Actuarial Scientist'];
      topCourses = ['B.Com (Honours)', 'Bachelor of Business Administration (BBA)', 'BA in Economics (Hons)'];
      suggestedColleges = ['SRCC DU', 'Delhi University', 'COEP Pune'];
      skillRoadmap = ['Financial Modeling & Excel', 'Macroeconomics & Trade Dynamics', 'Corporate Taxation Laws', 'Data-Driven Business Analytics'];
    } else if (topStream.includes('Arts')) {
      topCareers = ['Civil Services Officer (IAS/IPS/KAS)', 'Investigative Journalist / Media Analyst', 'Policy Researcher', 'Content Architect & UX Writer'];
      topCourses = ['BA in Political Science & Governance', 'BA in Journalism & Mass Media', 'Bachelor of Social Work'];
      suggestedColleges = ['Delhi University', 'GDC Baramulla', 'Jamia Millia Islamia'];
      skillRoadmap = ['Indian Constitution & Public Policy', 'Critical Analytical Writing', 'Modern Indian History', 'Qualitative Research Methodology'];
    } else {
      topCareers = ['Civil Infrastructure Supervisor', 'Network Hardware & Cloud Technician', 'Automobile Maintenance Lead', 'Renewable Solar Grid Tech'];
      topCourses = ['Diploma in Civil Engineering (Post-10th)', 'Diploma in Computer Engineering', 'Vocational ITI Certified Specialist'];
      suggestedColleges = ['Govt Polytechnic College Srinagar', 'Govt Poly Jammu', 'State Technical Board'];
      skillRoadmap = ['AutoCAD & Drafting', 'Industrial Workshop Safety', 'Electronics Circuit Diagnostics', 'Practical Quality Surveying'];
    }

    const confidenceScore = Math.min(97, Math.max(76, Math.round(75 + streamRankings[0].score * 2.2)));

    const record: AssessmentRecord = {
      id: 'asmt-' + Date.now(),
      studentId: input.studentId,
      completedAt: new Date().toISOString(),
      answers: input.answers,
      scores,
      recommendedStream: topStream,
      confidenceScore,
      topCareers,
      topCourses,
      suggestedColleges,
      skillRoadmap,
    };

    this.data.assessments.unshift(record);
    this.saveData(this.data);
    return record;
  }

  getStudentAssessments(studentId: string) {
    return this.data.assessments.filter(a => a.studentId === studentId);
  }

  // Applications Tracker
  getApplications(studentId: string) {
    return this.data.applications.filter(a => a.studentId === studentId || a.studentId === 'demo-student');
  }

  addApplication(app: Omit<ApplicationTracker, 'id' | 'updatedAt'>) {
    const newApp: ApplicationTracker = {
      ...app,
      id: 'app-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    this.data.applications.unshift(newApp);
    this.saveData(this.data);
    return newApp;
  }

  updateApplicationStage(id: string, stage: ApplicationTracker['currentStage'], actionRequired?: string) {
    const item = this.data.applications.find(a => a.id === id);
    if (item) {
      item.currentStage = stage;
      if (actionRequired) item.actionRequired = actionRequired;
      item.updatedAt = new Date().toISOString();
      this.saveData(this.data);
      return item;
    }
    return null;
  }

  deleteApplication(id: string) {
    this.data.applications = this.data.applications.filter(a => a.id !== id);
    this.saveData(this.data);
    return true;
  }

  // Scholarships
  getScholarships(categoryFilter?: string) {
    if (!categoryFilter || categoryFilter === 'All') return this.data.scholarships;
    return this.data.scholarships.filter(s =>
      s.targetCategory.some(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))
    );
  }

  // Alumni & Mentorship
  getAlumni() {
    return this.data.alumni;
  }

  submitMentorshipRequest(req: { alumniId: string; studentName: string; studentClass: string; message: string }) {
    const newReq: MentorshipRequest = {
      id: 'req-' + Date.now(),
      ...req,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      reply: 'Hi ' + req.studentName + '! Thanks for reaching out. Er. Tariq Ahmad Mir will review your inquiry within 24 hours. Keep preparing consistently!',
    };
    this.data.mentorshipRequests.unshift(newReq);
    this.saveData(this.data);
    return newReq;
  }

  // Feedback & Crowdsourced Reviews
  getReviews(collegeId?: string) {
    if (collegeId) {
      return this.data.reviews.filter(r => r.collegeId === collegeId);
    }
    return this.data.reviews;
  }

  addReview(review: Omit<CrowdsourcedReview, 'id' | 'date'>) {
    const newRev: CrowdsourcedReview = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    this.data.reviews.unshift(newRev);

    // Update college average rating
    const college = this.getCollegeById(review.collegeId);
    if (college) {
      const collegeReviews = this.data.reviews.filter(r => r.collegeId === review.collegeId);
      const avg = collegeReviews.reduce((acc, cur) => acc + cur.rating, 0) / collegeReviews.length;
      college.crowdsourcedRating.overall = parseFloat(avg.toFixed(1));
      college.crowdsourcedRating.reviewCount = collegeReviews.length;
    }

    this.saveData(this.data);
    return newRev;
  }

  getPlatformStats() {
    return {
      nationalDropoutRate: '11.5%',
      studentsDiscontinuedUDISE: '42.7 Lakh',
      govtCollegesEnrolledChallenges: '68%',
      careerMarketValuation: '₹5,000 Cr to ₹14,000 Cr',
      targetBeneficiariesJK: '2.5+ Million',
      verifiedCollegesCount: this.data.colleges.length,
      alumniMentorsCount: this.data.alumni.length,
      scholarshipsTrackedValue: '₹45+ Crores',
      studentsGuidedOnPlatform: 12480,
    };
  }
}

export const db = new DatabaseManager();
