import React from 'react';
import { GraduationCap, RotateCcw } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

export default function AcadHeader() {
  const { resetForm, goToLogin } = useOnboarding();

  return (
    <header className="acad-header" role="banner">
      {/* Brand */}
      <a href="#main-content" className="acad-header-brand" aria-label="AI Project Mentor home">
        <div className="acad-header-logo" aria-hidden="true">
          <GraduationCap size={20} strokeWidth={2} />
        </div>
        <div className="acad-header-brand-text">
          <span className="acad-header-name">AI Project Mentor</span>
          <span className="acad-header-tagline">Plan · Learn · Build · Grow</span>
        </div>
      </a>

      <div className="acad-header-divider" aria-hidden="true" />

      <div className="acad-header-spacer" />

      <div className="acad-header-actions">
        {/* Log in button */}
        <button
          type="button"
          className="acad-header-login-btn"
          onClick={goToLogin}
          title="Sign in with existing student account"
          aria-label="Sign in to your account"
        >
          <span>Log in</span>
        </button>

        {/* Reset button */}
        <button
          type="button"
          className="acad-reset-btn"
          onClick={resetForm}
          title="Reset onboarding form"
          aria-label="Reset the onboarding form"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
