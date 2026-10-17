import React from 'react';
import { GraduationCap, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';

function Sidebar({ onGoToOnboarding }) {
  return (
    <aside className="sidebar" aria-label="Dashboard navigation">
      {/* Existing Brand / Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" aria-hidden="true">
          <GraduationCap size={20} strokeWidth={2} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">AI Project Mentor</span>
          <span className="sidebar-logo-sub">Academic Platform</span>
        </div>
      </div>

      {/* Minimal Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>

        <button className="sidebar-nav-item active" type="button">
          <span className="sidebar-nav-item-icon">
            <LayoutDashboard size={17} />
          </span>
          Dashboard
        </button>

        <button
          className="sidebar-nav-item"
          type="button"
          onClick={onGoToOnboarding}
          title="Review onboarding profile and skills"
        >
          <span className="sidebar-nav-item-icon">
            <ArrowLeft size={17} />
          </span>
          Onboarding
        </button>
      </nav>
    </aside>
  );
}

export default function StudentDashboard() {
  const { profile, goToStep } = useOnboarding();

  const fullName = profile.fullName ? profile.fullName.trim() : 'Student';

  // Build initials from dynamic student profile (up to 2 chars)
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'ST';

  return (
    <div className="dashboard-shell">
      <Sidebar onGoToOnboarding={() => goToStep(3)} />

      <div className="dashboard-main">
        {/* Top bar with student name and avatar */}
        <header className="dashboard-topbar">
          <span className="dashboard-topbar-title">Student Dashboard</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>
              {fullName}
            </span>
            <div className="sidebar-avatar" style={{ width: 34, height: 34, fontSize: '0.8125rem' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Clean, intentional workspace empty state */}
        <div className="dashboard-content">
          <div className="dashboard-empty-card">
            <div className="dashboard-empty-icon" aria-hidden="true">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="dashboard-empty-title">Student Workspace</h2>
            <p className="dashboard-empty-desc">
              Your onboarding profile and skills are saved. Project workspace modules and mentoring tools will be activated here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
