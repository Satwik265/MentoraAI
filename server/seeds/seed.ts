import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.ts';
import { StudentProfile } from '../src/models/StudentProfile.ts';
import { College } from '../src/models/College.ts';
import { Course } from '../src/models/Course.ts';
import { Cutoff } from '../src/models/Cutoff.ts';
import { Scholarship } from '../src/models/Scholarship.ts';
import { Alumni } from '../src/models/Alumni.ts';
import { Feedback } from '../src/models/Feedback.ts';
import { AssessmentQuestion } from '../src/models/AssessmentQuestion.ts';
import { logger } from '../src/config/logger.ts';

export async function seedDatabase() {
  const collegeCount = await College.countDocuments();
  if (collegeCount > 0) {
    logger.info('Database already has seeded data. Skipping re-seed.');
    return;
  }

  logger.info('Seeding database with realistic DEMO institutions and records...');

  // 1. Create Default Users (Demo Student and Admin)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Mentora@2025', salt);

  const studentUser = await User.create({
    email: 'student@mentora.ai',
    passwordHash,
    role: 'student',
    isVerified: true,
  });

  const demoProfile = await StudentProfile.create({
    userId: studentUser._id,
    fullName: 'Aamir Lone',
    dateOfBirth: '2008-04-12',
    gender: 'Male',
    state: 'Jammu & Kashmir',
    district: 'Baramulla',
    city: 'Baramulla',
    language: 'en',
    category: 'GEN',
    annualFamilyIncome: 350000,
    ruralOrUrban: 'Rural',
    disabilityStatus: false,
    phone: '+91 94190 00000',
    classGrade: 'Class 10 Student',
    targetStream: 'Artificial Intelligence & Engineering',
    profileCompletion: 90,
  });

  await User.create({
    email: 'admin@mentora.ai',
    passwordHash,
    role: 'admin',
    isVerified: true,
  });

  // 2. Assessment Questions (WITHOUT EMOJIS)
  await AssessmentQuestion.insertMany([
    {
      questionKey: 'q1',
      category: 'Aptitude',
      questionText: 'When faced with a complex problem or technical machine that stopped functioning, what is your natural instinct?',
      questionHindi: 'jab koi jatil samasya ya upkaran kaam karna band kar deta hai, to aapki swabhavik pratikriya kya hoti hai?',
      options: [
        {
          optionId: 'q1-a',
          text: 'Take it apart systematically, inspect circuits or mechanical parts, and determine the logical root cause.',
          textHindi: 'ise charanbaddh tareeqe se kholna, circuit ya purzo ki jaanch karna aur taarkik kharabi dhoondna.',
          weights: { tech: 4, polytechnic: 4, analytical: 3 },
        },
        {
          optionId: 'q1-b',
          text: 'Examine biological and clinical factors, understand natural organ systems, or study healthcare diagnostics.',
          textHindi: 'jaivik aur rasayanik tathyo ko samajhna, swasthya lakshano ka nidan karna.',
          weights: { medical: 4, analytical: 2 },
        },
        {
          optionId: 'q1-c',
          text: 'Calculate the cost-benefit analysis of repairs versus replacement, or draft a budget plan.',
          textHindi: 'marammat banam naye khareedne ke laagat-laabh ki ganana karna ya vittiya yojana banana.',
          weights: { commerce: 4, entrepreneurial: 3 },
        },
        {
          optionId: 'q1-d',
          text: 'Envision a creative redesign, articulate its societal impact on local communities, or author an essay.',
          textHindi: 'rachnatmak punardesign ki kalpana karna, kahani likhna ya samaj par prabhav ko samajhna.',
          weights: { arts: 4, creative: 4, social: 3 },
        },
      ],
      isActive: true,
    },
    {
      questionKey: 'q2',
      category: 'RIASEC',
      questionText: 'Which workplace atmosphere sounds most motivating and aligned with your long-term vision?',
      questionHindi: 'aapke bhavishya ke liye kaun sa karya vatavaran sabse adhik utsahvardhak lagta hai?',
      options: [
        {
          optionId: 'q2-a',
          text: 'Software engineering laboratory or industrial technical workshop designing tangible systems and software.',
          textHindi: 'software lab ya engineering workshop me upkaran banana ya coding karna.',
          weights: { tech: 4, polytechnic: 3 },
        },
        {
          optionId: 'q2-b',
          text: 'Hospital clinic or biomedical research laboratory assisting patient healing and clinical pathology.',
          textHindi: 'aspatal ya clinic me mareezo ki sewa karna aur swasthya anusandhan karna.',
          weights: { medical: 4, social: 3 },
        },
        {
          optionId: 'q2-c',
          text: 'Financial enterprise, investment advisory boardroom, or launching an entrepreneurial startup venture.',
          textHindi: 'stock exchange, vittiya paramarsh ya apna khud ka startup chalana.',
          weights: { commerce: 4, entrepreneurial: 4 },
        },
        {
          optionId: 'q2-d',
          text: 'District civil administrative office, public policy think-tank, or legal governance commission.',
          textHindi: 'prashasnik sewa karyalaya, samajik sanstha ya shiksha sansthan.',
          weights: { arts: 4, social: 4 },
        },
      ],
      isActive: true,
    },
    {
      questionKey: 'q3',
      category: 'Academic',
      questionText: 'Which academic subject disciplines provided you with the strongest intellectual satisfaction in school?',
      questionHindi: 'school me kis vishay sanyojan ne aapko sabse adhik santushti di?',
      options: [
        {
          optionId: 'q3-a',
          text: 'Mathematics and Physical Sciences (equations, dynamics, electricity, algorithmic logic).',
          textHindi: 'ganit aur bhautik vigyan (samikaran, bal yaantriki, bijli, algorithm hal karna).',
          weights: { tech: 4, analytical: 4 },
        },
        {
          optionId: 'q3-b',
          text: 'Biological and Chemical Sciences (genetics, human physiology, organic molecules, medicine).',
          textHindi: 'jeev vigyan aur rasayan shastra (aanuvanshiki, manav sharir rachna).',
          weights: { medical: 4, analytical: 3 },
        },
        {
          optionId: 'q3-c',
          text: 'Accountancy, Business Administration, and Economics (fiscal balance, market economics, taxation).',
          textHindi: 'lekhashastra, vyavsayik adhyayan aur arthashastra.',
          weights: { commerce: 4, analytical: 2 },
        },
        {
          optionId: 'q3-d',
          text: 'History, Political Philosophy, and Social Sciences (constitutional law, sociology, governance).',
          textHindi: 'itihas, rajneeti vigyan, sahitya aur samajshastra.',
          weights: { arts: 4, social: 3, creative: 3 },
        },
        {
          optionId: 'q3-e',
          text: 'Applied Hands-on Vocational Skills (electrical wiring, mechanical servicing, carpentry, digital tech).',
          textHindi: 'vyavaharik karyashalaen (machining, bijli wiring, buniyadi coding).',
          weights: { polytechnic: 5, tech: 2 },
        },
      ],
      isActive: true,
    },
    {
      questionKey: 'q4',
      category: 'SocioEconomic',
      questionText: 'What is your primary educational priority regarding graduation duration and family financial constraints?',
      questionHindi: 'snatak avadhi aur vittiya laagat ke sambandh me aapki mukhya prathmikta kya hai?',
      options: [
        {
          optionId: 'q4-a',
          text: 'Pursue a high-return 4-year degree from a premier government institution (IIT or NIT) with top placements.',
          textHindi: 'sheersh sarkari college se ucch package wali 4-varshiya degree prapt karna.',
          weights: { tech: 3, commerce: 3 },
        },
        {
          optionId: 'q4-b',
          text: 'Enroll in an affordable 3-year vocational polytechnic diploma to secure fast employment and support family income.',
          textHindi: 'parivar ko sahayata dene ke liye kam kharch wala 2-3 saal ka diploma.',
          weights: { polytechnic: 5 },
        },
        {
          optionId: 'q4-c',
          text: 'Devote 5 or more years to rigorous clinical medicine (MBBS) through a subsidized government medical college.',
          textHindi: 'chikitsa kshetra me gehari ruchi aur MBBS ke liye 5+ varsh samarpit karna.',
          weights: { medical: 5 },
        },
        {
          optionId: 'q4-d',
          text: 'Complete an undergraduate degree in arts or commerce while actively preparing for UPSC or state administrative exams.',
          textHindi: 'sarkari prashasnik pariksha ki taiyari ke sath 3-varshiya snatak degree karna.',
          weights: { arts: 4, commerce: 2 },
        },
      ],
      isActive: true,
    },
  ]);

  // 3. Government Colleges & Courses
  const iitDelhi = await College.create({
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    slug: 'iit-delhi',
    type: 'IIT',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Hauz Khas, New Delhi 110016',
    website: 'https://home.iitd.ac.in',
    establishedYear: 1961,
    nirfRank: 2,
    naacGrade: 'A++',
    campusAreaAcres: 320,
    annualFeesAvg: 215000,
    description: 'Premier national institute of technology with world-class technical faculty, advanced computing clusters, and industry placement standards.',
    governmentVerified: true,
    hostelAvailable: true,
    hostelFeeAnnual: 35000,
    placementInfo: {
      avgPackageLPA: 25.8,
      highestPackageLPA: 120.0,
      topRecruiters: ['Microsoft', 'Google', 'ISRO', 'Texas Instruments'],
    },
    admissionTimeline: {
      exam: 'JEE Advanced 2025',
      registrationStart: '2025-04-20',
      registrationEnd: '2025-05-07',
      examDate: '2025-05-25',
      counselingDate: '2025-06-15',
      currentStatus: 'Counseling Active',
    },
    governmentScholarshipsSupported: ['National Scholarship Scheme', 'Fee Remission for SC/ST/PwD/EWS', 'PMSSS Quota'],
    crowdsourcedRating: { overall: 4.9, faculty: 4.9, placements: 5.0, infrastructure: 4.8, reviewCount: 342 },
    source: 'National Institutional Ranking Framework (NIRF) & Ministry of Education DEMO',
    sourceUrl: 'https://www.nirfindia.org',
    verificationStatus: 'Verified',
  });

  const cseIITD = await Course.create({
    collegeId: iitDelhi._id,
    name: 'B.Tech in Computer Science & Engineering',
    degree: 'B.Tech',
    stream: 'Engineering & Tech',
    durationYears: 4,
    annualFee: 215000,
    eligibility: 'Class 12 with Physics, Chemistry, Math and JEE Advanced ranking',
    totalSeats: 120,
    seatsBreakdown: { general: 48, obc: 32, sc: 18, st: 9, ews: 12, pwd: 6 },
    acceptedExams: ['JEE Advanced'],
    avgPackageLPA: 25.8,
    highestPackageLPA: 120.0,
    description: 'Flagship undergraduate program focusing on algorithms, theoretical computer science, and systems engineering.',
    source: 'JoSAA Business Rules DEMO',
    sourceUrl: 'https://josaa.nic.in',
    verificationStatus: 'Verified',
  });

  await Cutoff.create({
    collegeId: iitDelhi._id,
    courseId: cseIITD._id,
    exam: 'JEE Advanced',
    academicYear: 2024,
    category: 'GEN',
    quota: 'AI',
    round: 1,
    closingRank: 118,
    minPercentage: 92,
    source: 'JoSAA Official Cutoff Archive DEMO',
    sourceUrl: 'https://josaa.nic.in',
    verificationStatus: 'Verified',
  });

  const nitSrinagar = await College.create({
    name: 'National Institute of Technology Srinagar',
    shortName: 'NIT Srinagar',
    slug: 'nit-srinagar',
    type: 'NIT',
    state: 'Jammu & Kashmir',
    city: 'Srinagar',
    address: 'Hazratbal, Srinagar, Jammu & Kashmir 190006',
    website: 'https://nitsri.ac.in',
    establishedYear: 1960,
    nirfRank: 82,
    naacGrade: 'A',
    campusAreaAcres: 67,
    annualFeesAvg: 145000,
    description: 'Premier national technical institute nestled along Dal Lake, empowering students from Jammu & Kashmir and across India with high campus placement records.',
    governmentVerified: true,
    hostelAvailable: true,
    hostelFeeAnnual: 22000,
    placementInfo: {
      avgPackageLPA: 12.8,
      highestPackageLPA: 45.0,
      topRecruiters: ['Samsung', 'Oracle', 'Bharat Electronics', 'L&T'],
    },
    admissionTimeline: {
      exam: 'JEE Main 2025 / JoSAA',
      registrationStart: '2025-02-15',
      registrationEnd: '2025-03-31',
      examDate: '2025-04-12',
      counselingDate: '2025-06-20',
      currentStatus: 'Counseling Active',
    },
    governmentScholarshipsSupported: ['PMSSS J&K Special Scholarship', 'Central Sector Scheme', 'Post-Matric J&K Govt Scheme'],
    crowdsourcedRating: { overall: 4.6, faculty: 4.5, placements: 4.4, infrastructure: 4.7, reviewCount: 215 },
    source: 'JoSAA / NIT Council Records DEMO',
    sourceUrl: 'https://nitsri.ac.in',
    verificationStatus: 'Verified',
  });

  const cseNITS = await Course.create({
    collegeId: nitSrinagar._id,
    name: 'B.Tech in Computer Science & Engineering',
    degree: 'B.Tech',
    stream: 'Engineering & Tech',
    durationYears: 4,
    annualFee: 145000,
    eligibility: 'Class 12 with PCM and JEE Main valid percentile',
    totalSeats: 110,
    seatsBreakdown: { general: 44, obc: 30, sc: 16, st: 9, ews: 11, pwd: 5 },
    acceptedExams: ['JEE Main'],
    avgPackageLPA: 12.8,
    highestPackageLPA: 45.0,
    description: 'Comprehensive software and network engineering curriculum with strong campus recruitment.',
    source: 'JoSAA Allotment Matrix DEMO',
    sourceUrl: 'https://josaa.nic.in',
    verificationStatus: 'Verified',
  });

  await Cutoff.create({
    collegeId: nitSrinagar._id,
    courseId: cseNITS._id,
    exam: 'JEE Main',
    academicYear: 2024,
    category: 'GEN',
    quota: 'HS',
    round: 1,
    closingRank: 34500,
    minPercentage: 78,
    source: 'JoSAA Official Cutoff Archive DEMO',
    sourceUrl: 'https://josaa.nic.in',
    verificationStatus: 'Verified',
  });

  const govtPolySrinagar = await College.create({
    name: 'Government Polytechnic College Srinagar',
    shortName: 'Govt Poly Srinagar',
    slug: 'govt-polytechnic-srinagar',
    type: 'Government Polytechnic',
    state: 'Jammu & Kashmir',
    city: 'Srinagar',
    address: 'Gogji Bagh, Srinagar, Jammu and Kashmir 190008',
    website: 'https://govtpolytechnicsrinagar.edu.in',
    establishedYear: 1958,
    nirfRank: null,
    naacGrade: 'B++',
    campusAreaAcres: 24,
    annualFeesAvg: 4800,
    description: 'Premier skill and vocational diploma engineering institute directly tackling post-class 10 dropout with subsidized education and hands-on industrial workshops.',
    governmentVerified: true,
    hostelAvailable: true,
    hostelFeeAnnual: 8000,
    placementInfo: {
      avgPackageLPA: 4.5,
      highestPackageLPA: 8.4,
      topRecruiters: ['PHE Dept', 'PWD J&K', 'Local Telecom & Infrastructure Firms'],
    },
    admissionTimeline: {
      exam: 'JKBOPEE Diploma CET / 10th Merit',
      registrationStart: '2025-04-01',
      registrationEnd: '2025-05-15',
      examDate: '2025-06-01',
      counselingDate: '2025-06-25',
      currentStatus: 'Registration Open',
    },
    governmentScholarshipsSupported: ['J&K Skill Development Grant', 'Post-Matric Scholarship', 'Pragati Scholarship for Girls'],
    crowdsourcedRating: { overall: 4.5, faculty: 4.4, placements: 4.2, infrastructure: 4.3, reviewCount: 142 },
    source: 'J&K Board of Professional Entrance Examinations (JKBOPEE) DEMO',
    sourceUrl: 'https://jkbopee.gov.in',
    verificationStatus: 'Verified',
  });

  const polyCivil = await Course.create({
    collegeId: govtPolySrinagar._id,
    name: 'Diploma in Civil Engineering (Post-10th)',
    degree: 'Diploma',
    stream: 'Polytechnic & Vocational',
    durationYears: 3,
    annualFee: 4800,
    eligibility: 'Passed Class 10 with Math and Science',
    totalSeats: 90,
    seatsBreakdown: { general: 36, obc: 24, sc: 14, st: 7, ews: 9, pwd: 4 },
    acceptedExams: ['Class 10 Board Marks', 'JKBOPEE CET'],
    avgPackageLPA: 4.2,
    highestPackageLPA: 7.5,
    description: 'Practical infrastructure, surveying, and construction technology diploma with lateral entry access to 2nd year B.Tech.',
    source: 'JKBOPEE Official Seat Matrix DEMO',
    sourceUrl: 'https://jkbopee.gov.in',
    verificationStatus: 'Verified',
  });

  await Cutoff.create({
    collegeId: govtPolySrinagar._id,
    courseId: polyCivil._id,
    exam: 'JKBOPEE CET / 10th Board',
    academicYear: 2024,
    category: 'GEN',
    quota: 'HS',
    round: 1,
    closingRank: 450,
    minPercentage: 60,
    source: 'JKBOPEE Archive DEMO',
    sourceUrl: 'https://jkbopee.gov.in',
    verificationStatus: 'Verified',
  });

  const gmcJammu = await College.create({
    name: 'Government Medical College Jammu',
    shortName: 'GMC Jammu',
    slug: 'gmc-jammu',
    type: 'Medical College',
    state: 'Jammu & Kashmir',
    city: 'Jammu',
    address: 'Bakshi Nagar, Jammu, Jammu and Kashmir 180001',
    website: 'https://gmcjammu.nic.in',
    establishedYear: 1973,
    nirfRank: 45,
    naacGrade: 'A',
    campusAreaAcres: 55,
    annualFeesAvg: 26000,
    description: 'Premier tertiary healthcare and medical training government institution catering to northern India with super-specialty hospitals.',
    governmentVerified: true,
    hostelAvailable: true,
    hostelFeeAnnual: 12000,
    placementInfo: {
      avgPackageLPA: 14.5,
      highestPackageLPA: 30.0,
      topRecruiters: ['Government Health Services', 'AIIMS', 'Fortis Health'],
    },
    admissionTimeline: {
      exam: 'NEET UG 2025 / JKBOPEE',
      registrationStart: '2025-02-09',
      registrationEnd: '2025-03-16',
      examDate: '2025-05-04',
      counselingDate: '2025-07-10',
      currentStatus: 'Counseling Active',
    },
    governmentScholarshipsSupported: ['JKBOPEE Merit Aid', 'PMSSS Medical Quota', 'Central Sector Scholarship'],
    crowdsourcedRating: { overall: 4.7, faculty: 4.8, placements: 4.9, infrastructure: 4.3, reviewCount: 189 },
    source: 'National Medical Commission (NMC) & MCC DEMO',
    sourceUrl: 'https://mcc.nic.in',
    verificationStatus: 'Verified',
  });

  const mbbsGMC = await Course.create({
    collegeId: gmcJammu._id,
    name: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
    degree: 'MBBS',
    stream: 'Medical & Healthcare',
    durationYears: 5.5,
    annualFee: 26000,
    eligibility: 'Class 12 with PCB and qualified NEET UG rank',
    totalSeats: 180,
    seatsBreakdown: { general: 72, obc: 48, sc: 27, st: 15, ews: 18, pwd: 9 },
    acceptedExams: ['NEET UG'],
    avgPackageLPA: 14.5,
    highestPackageLPA: 30.0,
    description: 'Comprehensive medical education with clinical internship in government hospitals.',
    source: 'MCC / JKBOPEE Medical Allotment DEMO',
    sourceUrl: 'https://mcc.nic.in',
    verificationStatus: 'Verified',
  });

  await Cutoff.create({
    collegeId: gmcJammu._id,
    courseId: mbbsGMC._id,
    exam: 'NEET UG',
    academicYear: 2024,
    category: 'GEN',
    quota: 'HS',
    round: 1,
    closingRank: 16500,
    minPercentage: 82,
    source: 'MCC Archive DEMO',
    sourceUrl: 'https://mcc.nic.in',
    verificationStatus: 'Verified',
  });

  // 4. Government Scholarships
  await Scholarship.insertMany([
    {
      name: "Prime Minister's Special Scholarship Scheme (PMSSS) for J&K and Ladakh",
      provider: 'AICTE & Ministry of Education, Govt of India',
      description: 'Full academic fee waiver directly reimbursed to college plus 1,00,000 rupees per year maintenance allowance for hostel and study expenses.',
      eligibility: ['Domicile of J&K or Ladakh', 'Passed 10+2 from recognized board in J&K', 'Family income under 8.00 Lakhs per annum'],
      incomeLimit: 800000,
      category: ['J&K Domicile', 'All Categories'],
      state: 'Jammu & Kashmir',
      academicLevel: ['Undergraduate', 'Engineering', 'Medical', 'General Degree'],
      amountAnnual: 125000,
      deadline: '2025-07-31',
      officialUrl: 'https://aicte-jk-scholarship-gov.in',
      keyBenefits: '100% academic tuition fee waiver paid directly to college plus 1,00,000 rupees annual maintenance allowance directly into student account via DBT.',
      requiredDocuments: ['Domicile Certificate of J&K/Ladakh', 'Family Income Certificate signed by Tehsildar', '10th & 12th Marksheets', 'Aadhaar Card'],
      active: true,
      source: 'AICTE Official Portal DEMO',
      sourceUrl: 'https://aicte-jk-scholarship-gov.in',
      verificationStatus: 'Verified',
    },
    {
      name: 'Central Sector Scheme of Scholarships for College and University Students',
      provider: 'Department of Higher Education, Govt of India',
      description: 'Merit-cum-means financial assistance for scholars scoring above the 80th percentile in board examinations.',
      eligibility: ['Scored above 80th percentile in Class 12 board', 'Pursuing regular undergraduate course', 'Family income under 4.5 Lakhs per annum'],
      incomeLimit: 450000,
      category: ['Merit-cum-Means', 'General', 'OBC', 'SC', 'ST'],
      state: 'All India',
      academicLevel: ['Undergraduate', 'Postgraduate'],
      amountAnnual: 20000,
      deadline: '2025-10-31',
      officialUrl: 'https://scholarships.gov.in',
      keyBenefits: '12,000 rupees per annum for initial 3 years of undergraduate study and 20,000 rupees per annum at postgraduate level via DBT.',
      requiredDocuments: ['National Scholarship Portal (NSP) Application', 'Income Certificate', 'Class 12 Board Percentile Certificate'],
      active: true,
      source: 'National Scholarship Portal (NSP) DEMO',
      sourceUrl: 'https://scholarships.gov.in',
      verificationStatus: 'Verified',
    },
    {
      name: 'AICTE Pragati Scholarship for Girl Students (Technical Degree & Diploma)',
      provider: 'All India Council for Technical Education (AICTE)',
      description: 'Dedicated financial grant empowering young women scholars admitted to first-year AICTE-approved technical degree or polytechnic programs.',
      eligibility: ['Female student admitted to AICTE approved institution', 'Family income under 8.00 Lakhs per annum', 'Max 2 girls per family'],
      incomeLimit: 800000,
      category: ['Female Students', 'Engineering', 'Polytechnic'],
      state: 'All India',
      academicLevel: ['B.Tech', 'Polytechnic Diploma'],
      amountAnnual: 50000,
      deadline: '2025-11-15',
      officialUrl: 'https://www.aicte-pragati-saksham-gov.in',
      keyBenefits: '50,000 rupees per year lump sum towards college fees, computer purchase, books, and stationeries.',
      requiredDocuments: ['Income Certificate', 'Admission Letter in AICTE approved college', 'Bank Passbook copy'],
      active: true,
      source: 'AICTE Official Portal DEMO',
      sourceUrl: 'https://www.aicte-pragati-saksham-gov.in',
      verificationStatus: 'Verified',
    },
  ]);

  // 5. Alumni Role Models (WITHOUT EMOJIS)
  await Alumni.insertMany([
    {
      name: 'Er. Tariq Ahmad Mir',
      college: 'NIT Srinagar',
      degree: 'B.Tech in Computer Science',
      graduationYear: 2021,
      career: 'Senior Cloud Systems Engineer',
      company: 'Oracle India (Bengaluru)',
      location: 'Bengaluru / Srinagar',
      originRegion: 'Kulgam, South Kashmir',
      bio: 'Cloud architecture specialist and community educator who completed B.Tech with PMSSS scholarship aid.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verified: true,
      story: 'Coming from an agricultural household in rural Kulgam with limited internet access during connectivity disruptions, I almost discontinued education after Class 10 due to financial constraints. Guidance regarding the PMSSS scholarship and focused preparation through government libraries enabled me to crack NIT Srinagar.',
      overcomingDropoutRisk: 'Utilized state government free digital library and took PMSSS scholarship which covered 100% of college expenses and boarding.',
      skills: ['Distributed Systems', 'Linux Kernel', 'Database Reliability', 'Technical Mentorship'],
      advice: 'Do not let geographical remoteness hold you back. Government colleges provide rigorous research facilities and equal recruitment packages if you master foundational coding.',
      mentorshipTopics: ['PMSSS Scholarship Guidance', 'Crack Tech Interviews from NIT/Govt Colleges', 'Coding for Beginners'],
      availabilityStatus: 'Available for Mentorship',
    },
    {
      name: 'Dr. Sunita Sharma',
      college: 'GMC Jammu',
      degree: 'MBBS & MD Pediatrics',
      graduationYear: 2019,
      career: 'Medical Officer & Pediatric Specialist',
      company: 'Government District Hospital Udhampur',
      location: 'Udhampur, Jammu',
      originRegion: 'Udhampur, Jammu',
      bio: 'Public health advocate dedicated to serving regional district hospitals across Jammu and Kashmir.',
      profileImage: 'https://images.unsplash.com/photo-1594824813589-fb341be92d47?auto=format&fit=crop&w=400&q=80',
      verified: true,
      story: 'My parents were school teachers. Medical coaching felt unaffordable until our district education office introduced NCERT-focused test banks. GMC Jammu provided subsidized top-tier medical education at less than 30,000 rupees per year.',
      overcomingDropoutRisk: 'Leveraged state merit scholarships and subsidized government hostel facilities to complete MBBS without educational debt.',
      skills: ['Clinical Diagnostics', 'Pediatric Intensive Care', 'Community Health', 'NEET Strategy'],
      advice: 'Medical entrance needs NCERT mastery rather than expensive coaching institutes. Believe in daily disciplined revision.',
      mentorshipTopics: ['NEET UG Strategy for Govt Colleges', 'Affordable Medical Education', 'Stress Management'],
      availabilityStatus: 'Available for Mentorship',
    },
    {
      name: 'Irfan Rashid Lone',
      college: 'Govt Polytechnic College Srinagar',
      degree: 'Diploma in Civil & Infrastructure',
      graduationYear: 2020,
      career: 'Assistant Project Engineer & Entrepreneur',
      company: 'Kashmir Smart City Infrastructure Project',
      location: 'Srinagar, J&K',
      originRegion: 'Baramulla, J&K',
      bio: 'Infrastructure engineer and surveyor who started his career at age 19 through polytechnic vocational education.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verified: true,
      story: 'After scoring 68% in 10th, I chose a 3-year Government Polytechnic diploma with an annual fee of only 4,800 rupees. Today, I lead highway quality assurance teams and founded my own surveying consultancy.',
      overcomingDropoutRisk: 'Polytechnic gave me immediate industrial skills and job security at age 19 without burdening my family financially.',
      skills: ['Total Station Surveying', 'CAD Design', 'Civil QA/QC', 'Government Contracting'],
      advice: 'Polytechnic diplomas are the most underrated gateway. You can start earning at 19 or enter 2nd year B.Tech directly via Lateral Entry.',
      mentorshipTopics: ['Polytechnic Career Advantages', 'Lateral Entry to B.Tech', 'Starting Local Enterprises'],
      availabilityStatus: 'Available for Mentorship',
    },
  ]);

  // 6. Verified Student Reviews
  await Feedback.insertMany([
    {
      collegeId: nitSrinagar._id,
      studentName: 'Zubair Wani',
      courseAndYear: 'B.Tech CSE, 3rd Year',
      rating: 5,
      category: 'campus',
      comment: 'The coding culture and newly established computing laboratories on campus are strong. Campus placement drives featured reputable national software firms.',
      pros: ['Scenic campus near Dal Lake', 'Active student coding community', 'Affordable fees with PMSSS'],
      cons: ['Winter months require proactive schedule management'],
      verified: true,
      moderationStatus: 'APPROVED',
      date: '2025-08-14',
    },
    {
      collegeId: govtPolySrinagar._id,
      studentName: 'Aaliya Jan',
      courseAndYear: 'Civil Engineering Diploma, Alumna 2024',
      rating: 5,
      category: 'fees',
      comment: 'Best decision for students who want high quality technical skills after Class 10 without spending lakhs. Professors are supportive of first-generation learners.',
      pros: ['Extremely low tuition fee (under 5,000 per year)', 'Hands-on surveying gear', 'Direct campus placements'],
      cons: ['Additional hostel capacity needed for outstation scholars'],
      verified: true,
      moderationStatus: 'APPROVED',
      date: '2025-06-10',
    },
  ]);

  logger.info('Database seeding completed successfully.');
}
