import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockSaveStudentProfile, mockSubmitSkillAssessment } from '../services/api';
import { getStoredSession, saveSession, clearSession } from '../services/auth';

const OnboardingContext = createContext(null);

const getInitialStep = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = new URLSearchParams(window.location.search);

    // Direct access to Student Onboarding
    if (path === '/onboarding' || hash === '#onboarding' || search.get('page') === 'onboarding') {
      return 1;
    }
    // Direct access to Forgot Password
    if (path === '/forgot-password' || hash === '#forgot-password' || search.get('page') === 'forgot-password') {
      return 'forgot-password';
    }
    // Direct access to Dashboard
    if (path === '/dashboard' || hash === '#dashboard' || search.get('page') === 'dashboard') {
      return 'dashboard';
    }
    // Explicit login route or root route ('/')
    if (path === '/login' || hash === '#login' || search.get('page') === 'login') {
      return 'login';
    }
  }
  // Root route ('/') and default fallback is the Login/Auth screen
  return 'login';
};


const INITIAL_PROFILE = {
  fullName: '',
  email: '',
  institution: '',
  department: '',
  semester: '',
  graduationYear: ''
};

const INITIAL_SKILLS = [];

const INITIAL_INTERESTS = [];

export function OnboardingProvider({ children }) {
  // Navigation step: 1 = Profile, 2 = Skills, 3 = Completion Summary, 'dashboard', 'login'
  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [currentUser, setCurrentUser] = useState(() => getStoredSession().user);

  // Form State
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [selectedSkills, setSelectedSkills] = useState(INITIAL_SKILLS);
  const [selectedInterests, setSelectedInterests] = useState(INITIAL_INTERESTS);

  // Validation Errors
  const [profileErrors, setProfileErrors] = useState({});
  const [skillsErrors, setSkillsErrors] = useState({});

  // Loading & Global Status Banner
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isBackendSaved, setIsBackendSaved] = useState(false);

  // Profile Field Handlers
  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error upon typing
    if (profileErrors[field]) {
      setProfileErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Profile Validation
  const validateProfile = () => {
    const errors = {};
    if (!profile.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    } else if (profile.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters.';
    }

    if (!profile.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email.trim())) {
        errors.email = 'Please enter a valid email address (e.g. name@college.edu).';
      }
    }

    if (!profile.institution.trim()) {
      errors.institution = 'College / Institution name is required.';
    }

    if (!profile.department.trim()) {
      errors.department = 'Department / Major is required.';
    }

    if (!profile.semester) {
      errors.semester = 'Please select your current semester.';
    }

    if (!profile.graduationYear) {
      errors.graduationYear = 'Please select your expected graduation year.';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Profile (Step 1 -> Step 2)
  const handleSaveProfile = async () => {
    if (isLoading) return false; // Prevent duplicate submissions
    setStatusMessage(null);
    if (!validateProfile()) {
      setStatusMessage({
        type: 'error',
        text: 'Please correct the highlighted fields before proceeding.'
      });
      return false;
    }

    setIsLoading(true);
    try {
      const response = await mockSaveStudentProfile(profile);
      setIsBackendSaved(response.isBackendConnected || false);
      setStatusMessage({
        type: 'success',
        text: 'Profile details saved. Now let’s assess your technical skills!'
      });
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save profile. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Skills Handlers
  const addSkill = (skillName, level = 'Intermediate', isCustom = false) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    // Check if skill already exists
    const exists = selectedSkills.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setSkillsErrors({
        skill: `"${trimmed}" is already added to your skills list.`
      });
      return;
    }

    setSelectedSkills((prev) => [
      ...prev,
      { name: trimmed, level, isCustom }
    ]);

    setSkillsErrors({});
  };

  const removeSkill = (skillName) => {
    setSelectedSkills((prev) =>
      prev.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase())
    );
  };

  const updateSkillLevel = (skillName, newLevel) => {
    setSelectedSkills((prev) =>
      prev.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase()
          ? { ...s, level: newLevel }
          : s
      )
    );
  };

  // Interest Selection Handler
  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
    if (skillsErrors.interests) {
      setSkillsErrors((prev) => {
        const next = { ...prev };
        delete next.interests;
        return next;
      });
    }
  };

  // Skills Validation
  const validateSkills = () => {
    const errors = {};
    if (selectedSkills.length === 0) {
      errors.skills = 'Please select or add at least one technical skill.';
    }
    if (selectedInterests.length === 0) {
      errors.interests = 'Please select at least one project interest area.';
    }
    setSkillsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Skills (Step 2 -> Step 3)
  const handleSubmitSkills = async () => {
    if (isLoading) return false; // Prevent duplicate submissions
    setStatusMessage(null);
    if (!validateSkills()) {
      setStatusMessage({
        type: 'error',
        text: 'Please select at least one skill and one interest area to continue.'
      });
      return false;
    }

    setIsLoading(true);
    try {
      const response = await mockSubmitSkillAssessment({
        skills: selectedSkills,
        interests: selectedInterests
      });
      setIsBackendSaved(response.isBackendConnected || false);
      setStatusMessage({
        type: 'success',
        text: 'Skill assessment completed successfully!'
      });
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit skill assessment.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize route on browser history events (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentStep(getInitialStep());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize document title with active view
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentStep === 'login') {
        document.title = 'AI Project Mentor | Log in';
      } else if (currentStep === 'forgot-password') {
        document.title = 'AI Project Mentor | Reset Password';
      } else if (currentStep === 'dashboard') {
        document.title = 'AI Project Mentor | Student Dashboard';
      } else {
        document.title = 'AI Project Mentor | Student Onboarding';
      }
    }
  }, [currentStep]);

  // Navigation Helpers
  const goToStep = (step) => {
    if (step === 'login') {
      setStatusMessage(null);
      setCurrentStep('login');
      if (typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.history?.pushState?.(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If trying to go to step 2, 3 or dashboard without valid profile and not logged in, validate first
    if ((step > 1 || step === 'dashboard') && !currentUser && !validateProfile()) {
      setStatusMessage({
        type: 'error',
        text: 'Please complete the required profile details first.'
      });
      setCurrentStep(1);
      if (typeof window !== 'undefined' && window.location.pathname !== '/onboarding') {
        window.history?.pushState?.(null, '', '/onboarding');
      }
      return;
    }

    setStatusMessage(null);
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      let targetPath = '/onboarding';
      if (step === 'dashboard') {
        targetPath = '/dashboard';
      } else if (step === 'forgot-password') {
        targetPath = '/forgot-password';
      } else if (step === 'login') {
        targetPath = '/';
      }
      if (window.location.pathname !== targetPath) {
        window.history?.pushState?.(null, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLogin = () => {
    goToStep('login');
  };

  const goToOnboarding = () => {
    goToStep(1);
  };

  const goToForgotPassword = () => {
    setStatusMessage(null);
    setCurrentStep('forgot-password');
    if (typeof window !== 'undefined' && window.location.pathname !== '/forgot-password') {
      window.history?.pushState?.(null, '', '/forgot-password');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDashboard = () => {
    setStatusMessage(null);
    setCurrentStep('dashboard');
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history?.pushState?.(null, '', '/dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (tokenResponse) => {
    const { access_token, user } = tokenResponse;
    saveSession(access_token, user);
    setCurrentUser(user);

    if (user?.name) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email || prev.email
      }));
    }

    setStatusMessage({
      type: 'success',
      text: `Welcome back, ${user?.name || 'Student'}!`
    });

    goToDashboard();
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setStatusMessage({
      type: 'info',
      text: 'You have been signed out.'
    });
    goToStep('login');
  };

  const goBack = () => {
    setStatusMessage(null);
    if (currentStep === 'dashboard') {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Quick Sample Fill for reviewers
  const fillSampleData = () => {
    setProfile({
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@institution.edu',
      institution: 'National Institute of Technology',
      department: 'Computer Science & Engineering (CSE)',
      semester: 'Semester 6 (Year 3)',
      graduationYear: '2026'
    });
    setSelectedSkills([
      { name: 'Python', level: 'Advanced' },
      { name: 'React', level: 'Intermediate' },
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'Data Structures', level: 'Advanced' }
    ]);
    setSelectedInterests(['ai_ml', 'web_dev', 'data_science']);
    setProfileErrors({});
    setSkillsErrors({});
    setStatusMessage({
      type: 'info',
      text: 'Sample student profile loaded! You can test editing or proceed to the next step.'
    });
  };

  // Check if any form inputs have been filled
  const hasEnteredData = () => {
    return Boolean(
      profile.fullName?.trim() ||
      profile.email?.trim() ||
      profile.institution?.trim() ||
      profile.department?.trim() ||
      profile.semester ||
      profile.graduationYear ||
      selectedSkills.length > 0 ||
      selectedInterests.length > 0
    );
  };

  // Reset the current onboarding form to its initial clean state
  const resetForm = () => {
    if (hasEnteredData()) {
      const confirmed = window.confirm(
        'Are you sure you want to reset the onboarding form? Any unsaved inputs will be cleared.'
      );
      if (!confirmed) {
        return;
      }
    }

    setProfile(INITIAL_PROFILE);
    setSelectedSkills([]);
    setSelectedInterests([]);
    setProfileErrors({});
    setSkillsErrors({});
    setStatusMessage(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = {
    currentStep,
    goToStep,
    goBack,
    profile,
    updateProfileField,
    profileErrors,
    handleSaveProfile,
    selectedSkills,
    addSkill,
    removeSkill,
    updateSkillLevel,
    selectedInterests,
    toggleInterest,
    skillsErrors,
    handleSubmitSkills,
    isLoading,
    statusMessage,
    setStatusMessage,
    isBackendSaved,
    goToDashboard,
    goToLogin,
    goToOnboarding,
    goToForgotPassword,
    currentUser,
    handleLoginSuccess,
    handleLogout,
    fillSampleData,
    resetForm,
    resetAll: resetForm
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
