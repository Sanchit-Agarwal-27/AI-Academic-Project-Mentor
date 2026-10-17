import React from 'react';
import { GraduationCap, RotateCcw } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

export default function Navbar() {
  const { resetForm } = useOnboarding();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">AI Project Mentor</span>
            <span className="brand-subtitle">Academic Planning & Skill Assessment</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-reset-btn"
          onClick={resetForm}
          title="Reset form"
          aria-label="Reset form"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
