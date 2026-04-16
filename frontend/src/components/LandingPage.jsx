function FeatureIcon({ children }) {
  return <div className="feature-icon" aria-hidden="true">{children}</div>;
}

function LandingPage({ onGetStarted, onLogin, onRegister }) {
  const benefits = [
    "Structured workflows for postings, applications, and shortlisting",
    "Secure handling of resumes and placement-related documents",
    "Clear status tracking for students and recruiters",
    "Responsive layout that works across desktop and mobile",
    "Role-based access aligned with TPO, companies, and students",
    "Designed for the official campus placement process at PDEU",
  ];

  return (
    <section className="landing">
      <div className="landing-hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-eyebrow">Pandit Deendayal Energy University</p>
          <h1>Campus placements, managed in one place</h1>
          <p className="hero-lead">
            Connect students with recruiters through a single, university-aligned portal for
            opportunities, applications, and updates.
          </p>
          <p className="hero-meta">Registration, listings, and tracking—kept straightforward and consistent.</p>

          <button type="button" className="btn-primary" onClick={onGetStarted}>
            Sign in to continue
          </button>
        </div>
      </div>

      <div className="hero-features-wrap">
        <div className="hero-features">
          <div className="feature">
            <FeatureIcon>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </FeatureIcon>
            <h3>For students</h3>
            <p>Browse approved opportunities, submit applications, and follow progress in one workspace.</p>
          </div>

          <div className="feature">
            <FeatureIcon>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </FeatureIcon>
            <h3>For companies</h3>
            <p>Publish roles and internships, review applicants, and coordinate with the placement office.</p>
          </div>

          <div className="feature">
            <FeatureIcon>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </FeatureIcon>
            <h3>For TPO / administration</h3>
            <p>Oversee listings, users, and placement activity with controls suited to institutional use.</p>
          </div>
        </div>
      </div>

      <div className="landing-info">
        <div className="info-box info-box--benefits">
          <h2>Why use this portal</h2>
          <p className="info-box-intro">
            The placement office uses this system to keep campus recruitment organized, auditable, and easy to
            navigate for every stakeholder.
          </p>
          <ul className="benefits-list">
            {benefits.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="info-box info-box--cta">
          <h2>Access your account</h2>
          <p className="info-box-intro">
            Use your university or company credentials to sign in. New users can register and select the
            appropriate role.
          </p>
          <div className="landing-actions">
            <button type="button" className="btn-secondary btn-secondary--outline" onClick={onLogin}>
              Login
            </button>
            <button type="button" className="btn-secondary" onClick={onRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
