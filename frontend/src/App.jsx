import React from 'react';
import './App.css';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import AcadHeader from './components/common/AcadHeader';
import AcadSidebar from './components/common/AcadSidebar';
import RightPanel from './components/common/RightPanel';
import Alert from './components/common/Alert';
import StudentOnboardingPage from './pages/StudentOnboardingPage';
import SkillAssessmentPage from './pages/SkillAssessmentPage';
import CompletionPage from './pages/CompletionPage';
import StudentDashboard from './pages/StudentDashboard';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function OnboardingContent() {
  const { currentStep, statusMessage, setStatusMessage } = useOnboarding();

  // Login view has its own centered auth shell
  if (currentStep === 'login') {
    return <LoginPage />;
  }

  // Forgot-password view — same auth shell
  if (currentStep === 'forgot-password') {
    return <ForgotPasswordPage />;
  }

  // Dashboard has its own full-viewport shell — don't wrap it
  if (currentStep === 'dashboard') {
    return <StudentDashboard />;
  }

  return (
    <div className="acad-viewport">
      <AcadHeader />

      <div className="acad-body">
        {/* Left step-progress sidebar */}
        <AcadSidebar />

        {/* Main scrollable content */}
        <main className="acad-main" id="main-content">
          <div className="acad-content-inner">
            {/* Global feedback alert */}
            {statusMessage && (
              <Alert
                type={statusMessage.type}
                onDismiss={() => setStatusMessage(null)}
                className="acad-alert-banner"
              >
                {statusMessage.text}
              </Alert>
            )}

            {/* Step views */}
            {currentStep === 1 && <StudentOnboardingPage />}
            {currentStep === 2 && <SkillAssessmentPage />}
            {currentStep === 3 && <CompletionPage />}
          </div>
        </main>

        {/* Right decorative/info panel */}
        <RightPanel currentStep={currentStep} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
