/**
 * Mock API Service Layer for AI Academic Project Mentor
 *
 * NOTE: Backend API endpoints are not yet connected.
 * This module simulates network requests with clean Promises and realistic latency,
 * providing the exact contract that will be wired to the backend / AI engine.
 *
 * Backend integration TODO:
 * - Replace mockSaveStudentProfile with: POST /api/v1/students/profile
 * - Replace mockSubmitSkillAssessment with: POST /api/v1/students/skills
 *   (or mapped to ai_engine.skill_assessment.assess_skill_fit)
 */

export const PRESET_SKILLS = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'React',
  'SQL',
  'Machine Learning',
  'AI',
  'Web Development',
  'Data Structures'
];

export const PRESET_INTERESTS = [
  {
    id: 'ai_ml',
    title: 'AI & Machine Learning',
    description: 'Neural networks, LLMs, computer vision, and predictive models',
    iconName: 'Brain'
  },
  {
    id: 'web_dev',
    title: 'Web Development',
    description: 'Full-stack modern web apps, APIs, microservices, and design systems',
    iconName: 'Globe'
  },
  {
    id: 'app_dev',
    title: 'Mobile App Development',
    description: 'Native & cross-platform applications for iOS and Android',
    iconName: 'Smartphone'
  },
  {
    id: 'data_science',
    title: 'Data Science & Analytics',
    description: 'Big data processing, statistical modeling, and insights dashboards',
    iconName: 'BarChart3'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Vulnerability assessment, network defense, cryptography, and audits',
    iconName: 'ShieldCheck'
  },
  {
    id: 'cloud_devops',
    title: 'Cloud & DevOps',
    description: 'Containerization, CI/CD pipelines, AWS/GCP architecture, and Docker',
    iconName: 'Cloud'
  },
  {
    id: 'iot_robotics',
    title: 'IoT & Embedded Systems',
    description: 'Arduino, Raspberry Pi, sensor networks, robotics, and edge computing',
    iconName: 'Cpu'
  },
  {
    id: 'nlp_speech',
    title: 'NLP & Language Tech',
    description: 'Text mining, summarization, sentiment analysis, and conversational agents',
    iconName: 'MessageSquare'
  }
];

export const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology / Biomedical',
  'Other / Interdisciplinary'
];

export const SEMESTERS = [
  'Semester 1 (Year 1)',
  'Semester 2 (Year 1)',
  'Semester 3 (Year 2)',
  'Semester 4 (Year 2)',
  'Semester 5 (Year 3)',
  'Semester 6 (Year 3)',
  'Semester 7 (Final Year)',
  'Semester 8 (Final Year)',
  'Postgraduate / Masters (Year 1)',
  'Postgraduate / Masters (Year 2)'
];

export const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

/**
 * Mock saving student profile (Page One)
 * @param {Object} profileData
 * @returns {Promise<{success: boolean, data: Object, message: string, isBackendConnected: boolean}>}
 */
export async function mockSaveStudentProfile(profileData) {
  // Simulate network latency (400ms - 800ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Basic validation check
  if (!profileData.fullName || !profileData.email || !profileData.institution || !profileData.department) {
    throw new Error('Please fill in all required profile fields.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profileData.email)) {
    throw new Error('Please provide a valid institutional or personal email address.');
  }

  // Developer diagnostic in console only - not shown in student UI
  console.debug('[API Service] mockSaveStudentProfile staged:', profileData);

  return {
    success: true,
    isBackendConnected: false, // Flag indicating whether actual backend API is wired
    data: {
      ...profileData,
      id: `std_${Date.now()}`,
      updatedAt: new Date().toISOString()
    },
    message: 'Profile details saved successfully.'
  };
}

/**
 * Mock submitting skill assessment (Page Two)
 * @param {Object} assessmentData - { skills: Array<{name: string, level: string}>, interests: string[] }
 * @returns {Promise<{success: boolean, data: Object, message: string, isBackendConnected: boolean}>}
 */
export async function mockSubmitSkillAssessment(assessmentData) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!assessmentData.skills || assessmentData.skills.length === 0) {
    throw new Error('Please select or add at least one technical skill.');
  }

  if (!assessmentData.interests || assessmentData.interests.length === 0) {
    throw new Error('Please choose at least one area of interest for your project.');
  }

  // Developer diagnostic in console only - not shown in student UI
  console.debug('[API Service] mockSubmitSkillAssessment received:', assessmentData);

  return {
    success: true,
    isBackendConnected: false, // Flag indicating whether actual backend API is wired
    data: {
      ...assessmentData,
      submittedAt: new Date().toISOString()
    },
    message: 'Skills and project interests saved successfully.'
  };
}
