import { useEffect, useState } from "react";

function Navbar({ user, currentPath, isLandingPage, onLogout, onNavClick }) {
  const [heroPassed, setHeroPassed] = useState(false);

  const navLinks = user?.role === "student"
    ? [
      { label: "Dashboard", path: "/dashboard", gateToSignIn: false },
      { label: "Opportunities", path: "/opportunities", gateToSignIn: true },
      { label: "Applied", path: "/placements", gateToSignIn: true },
      { label: "About", path: "/about", gateToSignIn: false },
      { label: "Contact", path: "/contact", gateToSignIn: false },
    ]
    : user?.role === "superadmin" || user?.role === "tpo"
      ? [
        { label: "Dashboard", path: "/dashboard", gateToSignIn: false },
        { label: "Opportunities", path: "/admin/opportunities", gateToSignIn: true },
        { label: "Placed Students", path: "/admin/placed-students", gateToSignIn: true },
        { label: "Users", path: "/admin/users", gateToSignIn: true },
        { label: "About", path: "/about", gateToSignIn: false },
        { label: "Contact", path: "/contact", gateToSignIn: false },
      ]
      : [
        ...(!user ? [{ label: "Home", path: "/", gateToSignIn: false }] : []),
        { label: "Opportunities", path: "/opportunities", gateToSignIn: true },
        { label: "Placements", path: "/placements", gateToSignIn: true },
        ...(user ? [{ label: "Dashboard", path: "/dashboard", gateToSignIn: false }] : []),
        { label: "About", path: "/about", gateToSignIn: false },
        { label: "Contact", path: "/contact", gateToSignIn: false },
      ];

  useEffect(() => {
    if (!isLandingPage) {
      setHeroPassed(false);
      return;
    }

    const measureAndUpdate = () => {
      const hero = document.querySelector(".landing-hero");
      const threshold = (hero?.getBoundingClientRect().height ?? 480) - 72;
      setHeroPassed(window.scrollY > Math.max(threshold, 120));
    };

    measureAndUpdate();
    window.addEventListener("scroll", measureAndUpdate, { passive: true });
    window.addEventListener("resize", measureAndUpdate);
    return () => {
      window.removeEventListener("scroll", measureAndUpdate);
      window.removeEventListener("resize", measureAndUpdate);
    };
  }, [isLandingPage]);

  const navVisualLight = isLandingPage && !heroPassed;

  const isActive = (path, label) => {
    if (label === "Home") return currentPath === "/";
    if (label === "Dashboard") return currentPath === "/dashboard";
    if (label === "Applied") return currentPath === "/placements";
    if (label === "Opportunities") return currentPath === "/opportunities" || currentPath === "/admin/opportunities";
    if (label === "Placed Students") return currentPath === "/admin/placed-students";
    if (label === "Users") return currentPath === "/admin/users";
    return currentPath === path;
  };

  return (
    <nav className={`navbar ${navVisualLight ? "navbar-light" : "navbar-dark"}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div>
            <h1 className="navbar-title">PDEU Placements</h1>
            <p className="navbar-subtitle">Portal</p>
          </div>
        </div>

        <div className="navbar-links" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={`${link.label}-${link.path}`}
              href={`#${link.path}`}
              className={isActive(link.path, link.label) ? "active" : ""}
              aria-current={isActive(link.path, link.label) ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (link.gateToSignIn && !user) onNavClick("/signin?mode=login");
                else onNavClick(link.path);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-section">
              <span className="username">{user.name}</span>
              <span className="role-badge">
                {user.role === "superadmin" ? "admin" : user.role}
              </span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <button className="signin-btn" onClick={() => onNavClick("/signin?mode=login")}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
