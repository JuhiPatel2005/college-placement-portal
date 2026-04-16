import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import {
  applyToOpportunity,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
  fetchApplications,
  fetchOpportunities,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateApplicationStatus,
  uploadOfferLetter,
  updateProfile,
  fetchUsers,
  updateUser,
} from "./api";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./components/LandingPage.jsx";
import AuthForm from "./components/AuthForm.jsx";
import OpportunityList from "./components/OpportunityList.jsx";
import CreateOpportunityForm from "./components/CreateOpportunityForm.jsx";
import ApplyForm from "./components/ApplyForm.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import ProfileSummary from "./components/ProfileSummary.jsx";
import UserManagement from "./components/UserManagement.jsx";
import AboutPage from "./components/AboutPage.jsx";
import ContactPage from "./components/ContactPage.jsx";

const defaultAuth = {
  name: "",
  email: "",
  password: "",
  role: "",
  year: "",
  branch: "",
  passingYear: "",
  college: "",
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
};

const defaultOpportunity = {
  title: "",
  company: "",
  description: "",
  type: "",
  location: "",
  salary: "",
  stipend: "",
  duration: "",
};

const defaultApply = {
  opportunityId: "",
  cgpa: "",
  phone: "",
  skills: "",
  appliedRole: "",
  coverLetter: "",
  resume: null,
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  /** True while we verify /auth/me on initial load. */
  const [sessionPending, setSessionPending] = useState(true);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [authData, setAuthData] = useState(defaultAuth);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOpportunity, setNewOpportunity] = useState(defaultOpportunity);
  const [editingOpportunityId, setEditingOpportunityId] = useState("");
  const [applyForm, setApplyForm] = useState(defaultApply);
  const [activeApply, setActiveApply] = useState(null);
  const [studentOpportunityView, setStudentOpportunityView] = useState("jobs-and-placements");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.role) return undefined;
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });
    const refresh = () => loadData();
    socket.on("opportunities:updated", refresh);
    socket.on("applications:updated", refresh);
    return () => {
      socket.off("opportunities:updated", refresh);
      socket.off("applications:updated", refresh);
      socket.close();
    };
  }, [user?.role]);

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      setSessionPending(true);
      setLoading(true);
      try {
        const data = await getCurrentUser();
        if (cancelled) return;
        setUser(data);
        setProfileData(data);
      } catch (error) {
        if (cancelled) return;
        setUser(null);
        setProfileData(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSessionPending(false);
        }
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?.role) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname !== "/signin") return;
    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    setMode(modeParam === "register" ? "register" : "login");
  }, [location.pathname, location.search]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const promises = [fetchOpportunities(), fetchApplications(user.role)];
      if (user.role === "superadmin") {
        promises.push(fetchUsers());
      }

      const [ops, apps, userList] = await Promise.all(promises);
      setOpportunities(ops);
      setApplications(apps);
      if (user.role === "superadmin") {
        setUsers(userList || []);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Proceed with local cleanup even if request fails.
    }
    setUser(null);
    setProfileData(null);
    setSessionPending(false);
    setOpportunities([]);
    setApplications([]);
    navigate("/");
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const action = mode === "login" ? loginUser : registerUser;
    try {
      setLoading(true);
      const response = await action(authData);
      if (response.user) {
        setUser(response.user);
        setProfileData(response.user);
      }
      setSessionPending(false);
      setAuthData(defaultAuth);
      showMessage(mode === "login" ? "Logged in successfully" : "Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const payload = { name: profileData.name };
      ["branch", "college", "companyName", "companyWebsite", "companyDescription"].forEach((key) => {
        if (profileData[key] !== undefined) payload[key] = profileData[key];
      });
      ["year", "passingYear"].forEach((key) => {
        const raw = profileData[key];
        if (raw === "" || raw == null) return;
        const n = Number(raw);
        if (!Number.isNaN(n)) payload[key] = n;
      });
      const updated = await updateProfile(payload);
      setUser(updated);
      setProfileData(updated);
      showMessage("Profile updated successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userItem, role) => {
    try {
      setLoading(true);
      const updated = await updateUser(userItem._id, { role });
      setUsers((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showMessage("User role updated successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityChange = (event) => {
    const { name, value } = event.target;
    setNewOpportunity((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "type") {
        if (value === "job" || value === "placement") {
          next.stipend = "";
          next.duration = "";
        } else {
          next.salary = "";
        }
      }
      return next;
    });
  };

  const handleCreateOpportunity = async (event) => {
    event.preventDefault();
    if (!newOpportunity.type) {
      showMessage("Please select opportunity type.");
      return;
    }
    try {
      setLoading(true);
      const payload = { ...newOpportunity };
      if (payload.type === "job" || payload.type === "placement") {
        payload.stipend = "";
        payload.duration = "";
      } else {
        payload.salary = "";
      }
      if (editingOpportunityId) {
        const updated = await updateOpportunity(editingOpportunityId, payload);
        setOpportunities((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
        showMessage("Opportunity updated successfully");
      } else {
        const created = await createOpportunity(payload);
        setOpportunities((prev) => [created, ...prev]);
        showMessage("Opportunity created successfully");
      }
      setNewOpportunity(defaultOpportunity);
      setEditingOpportunityId("");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunityId(opportunity._id);
    setNewOpportunity({
      title: opportunity.title || "",
      company: opportunity.company || "",
      description: opportunity.description || "",
      type: opportunity.type || "",
      location: opportunity.location || "",
      salary: opportunity.salary || "",
      stipend: opportunity.stipend || "",
      duration: opportunity.duration || "",
    });
  };

  const handleCancelEditOpportunity = () => {
    setEditingOpportunityId("");
    setNewOpportunity(defaultOpportunity);
  };

  const openApply = (opportunity) => {
    const alreadyApplied = applications.some(
      (app) =>
        String(app?.opportunity?._id || app?.opportunity) === String(opportunity._id),
    );
    if (alreadyApplied) return;
    setActiveApply(opportunity._id);
    setApplyForm((prev) => ({ ...prev, opportunityId: opportunity._id }));
  };

  const handleApplyFormChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "resume") {
      setApplyForm((prev) => ({ ...prev, resume: files?.[0] || null }));
      return;
    }
    setApplyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async (event) => {
    event.preventDefault();
    if (!applyForm.opportunityId) {
      showMessage("Select an opportunity to apply.");
      return;
    }
    if (!applyForm.resume) {
      showMessage("Please upload your resume.");
      return;
    }
    try {
      const form = new FormData();
      form.append("opportunityId", String(applyForm.opportunityId));
      form.append("cgpa", String(applyForm.cgpa));
      form.append("phone", applyForm.phone);
      if (applyForm.skills) form.append("skills", applyForm.skills);
      if (applyForm.appliedRole) form.append("appliedRole", applyForm.appliedRole);
      if (applyForm.coverLetter) form.append("coverLetter", applyForm.coverLetter);
      form.append("resume", applyForm.resume, applyForm.resume.name);
      setLoading(true);
      const result = await applyToOpportunity(form);
      setApplications((prev) => [result, ...prev]);
      setApplyForm(defaultApply);
      setActiveApply(null);
      showMessage("Applied successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (application, payload, offerLetterFile) => {
    try {
      setLoading(true);
      let updated = await updateApplicationStatus(application._id, payload);
      if (offerLetterFile) {
        updated = await uploadOfferLetter(application._id, offerLetterFile);
      }
      setApplications((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showMessage("Status updated successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpportunity = async (opportunity) => {
    const label = opportunity?.title || "this opportunity";
    const confirmed = window.confirm(`Delete ${label}? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      setLoading(true);
      await deleteOpportunity(opportunity._id);
      setOpportunities((prev) => prev.filter((item) => item._id !== opportunity._id));
      showMessage("Opportunity deleted successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const appliedOpportunityIds = new Set(
    applications.map((app) => String(app?.opportunity?._id || app?.opportunity)).filter(Boolean),
  );
  const visibleOpportunities =
    user?.role === "student"
      ? opportunities.filter((opportunity) => {
        if (studentOpportunityView === "internships") {
          return String(opportunity.type) === "internship";
        }
        return ["job", "placement"].includes(String(opportunity.type));
      })
      : opportunities;

  return (
    <div className="app">
      <Navbar
        user={user}
        currentPath={location.pathname}
        isLandingPage={location.pathname === "/" && !user}
        onLogout={logout}
        onNavClick={(page) => navigate(page)}
      />

      <main className={`main-content ${location.pathname === "/" && !user ? "landing-main" : ""}`}>
        {message && <div className="message">{message}</div>}
        {loading && <div className="message info">Loading...</div>}

        <Routes>
          <Route path="/" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <LandingPage
                onGetStarted={() => navigate("/signin?mode=login")}
                onLogin={() => navigate("/signin?mode=login")}
                onRegister={() => navigate("/signin?mode=register")}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />

          <Route path="/signin" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <div className="auth-container">
                <AuthForm
                  mode={mode}
                  authData={authData}
                  loading={loading}
                  onModeChange={setMode}
                  onChange={handleAuthChange}
                  onSubmit={handleAuthSubmit}
                />
              </div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />

          <Route path="/dashboard" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <Navigate to="/signin" replace />
            ) : (
              <div className="dashboard">
                {profileData && (
                  <ProfileSummary user={profileData} onEdit={() => navigate("/profile/edit")} />
                )}

                <section className="card dashboard-stats">
                  <h2>Dashboard Stats</h2>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">{opportunities.length}</span>
                      <span className="stat-label">Open Opportunities</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{applications.length}</span>
                      <span className="stat-label">
                        {user.role === "student" ? "Your Applications" : "Applications (received)"}
                      </span>
                    </div>
                    {user.role === "superadmin" && (
                      <div className="stat-item">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Total Users</span>
                      </div>
                    )}
                  </div>
                </section>

                {user.role === "superadmin" && (
                  <UserManagement users={users} onRoleChange={handleRoleChange} />
                )}

                <section className="card">
                  <h2>Job & Internship Opportunities</h2>
                  {user.role === "student" && (
                    <div className="tab-row">
                      <button
                        className={studentOpportunityView === "jobs-and-placements" ? "active" : ""}
                        type="button"
                        onClick={() => setStudentOpportunityView("jobs-and-placements")}
                      >
                        Jobs & Placements
                      </button>
                      <button
                        className={studentOpportunityView === "internships" ? "active" : ""}
                        type="button"
                        onClick={() => setStudentOpportunityView("internships")}
                      >
                        Internships
                      </button>
                    </div>
                  )}
                  <OpportunityList
                    opportunities={visibleOpportunities}
                    userRole={user.role}
                    appliedOpportunityIds={appliedOpportunityIds}
                    loading={loading}
                    onApply={openApply}
                    onDelete={handleDeleteOpportunity}
                    onEdit={handleEditOpportunity}
                  />
                </section>

                {user.role !== "student" && (
                  <CreateOpportunityForm
                    newOpportunity={newOpportunity}
                    loading={loading}
                    onChange={handleOpportunityChange}
                    onSubmit={handleCreateOpportunity}
                    isEditMode={Boolean(editingOpportunityId)}
                    onCancelEdit={handleCancelEditOpportunity}
                  />
                )}

                {activeApply && (
                  <ApplyForm
                    applyForm={applyForm}
                    loading={loading}
                    onChange={handleApplyFormChange}
                    onSubmit={handleApply}
                    onCancel={() => {
                      setActiveApply(null);
                      setApplyForm(defaultApply);
                    }}
                  />
                )}

                <section className="card">
                  <h2>Your Applications</h2>
                  <ApplicationList
                    applications={applications}
                    userRole={user.role}
                    loading={loading}
                    onStatusUpdate={handleStatusUpdate}
                    postedOpportunityCount={user.role === "company" ? opportunities.length : undefined}
                  />
                </section>
              </div>
            )
          } />

          <Route path="/opportunities" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <Navigate to="/signin" replace />
            ) : (
              <div className="dashboard">
                <section className="card">
                  <h2>Job & Internship Opportunities</h2>
                  {user.role === "student" && (
                    <div className="tab-row">
                      <button
                        className={studentOpportunityView === "jobs-and-placements" ? "active" : ""}
                        type="button"
                        onClick={() => setStudentOpportunityView("jobs-and-placements")}
                      >
                        Jobs & Placements
                      </button>
                      <button
                        className={studentOpportunityView === "internships" ? "active" : ""}
                        type="button"
                        onClick={() => setStudentOpportunityView("internships")}
                      >
                        Internships
                      </button>
                    </div>
                  )}
                  <OpportunityList
                    opportunities={visibleOpportunities}
                    userRole={user.role}
                    appliedOpportunityIds={appliedOpportunityIds}
                    loading={loading}
                    onApply={openApply}
                    onDelete={handleDeleteOpportunity}
                    onEdit={handleEditOpportunity}
                  />
                </section>

                {activeApply && (
                  <ApplyForm
                    applyForm={applyForm}
                    loading={loading}
                    onChange={handleApplyFormChange}
                    onSubmit={handleApply}
                    onCancel={() => {
                      setActiveApply(null);
                      setApplyForm(defaultApply);
                    }}
                  />
                )}
              </div>
            )
          } />

          <Route path="/placements" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <Navigate to="/signin" replace />
            ) : (
              <div className="dashboard">
                <section className="card">
                  <h2>Your Applications & Placements</h2>
                  <ApplicationList
                    applications={applications}
                    userRole={user.role}
                    loading={loading}
                    onStatusUpdate={handleStatusUpdate}
                    postedOpportunityCount={user.role === "company" ? opportunities.length : undefined}
                  />
                </section>
              </div>
            )
          } />

          <Route path="/profile/edit" element={
            sessionPending ? (
              <div className="dashboard">
                <div className="message info">Restoring your session…</div>
              </div>
            ) : !user ? (
              <Navigate to="/signin" replace />
            ) : (
              <div className="dashboard">
                {profileData && (
                  <ProfileForm
                    profileData={profileData}
                    loading={loading}
                    onChange={handleProfileChange}
                    onSubmit={async (event) => {
                      await handleProfileSubmit(event);
                      navigate("/dashboard");
                    }}
                    showCancel
                    onCancel={() => {
                      setProfileData(user);
                      navigate("/dashboard");
                    }}
                  />
                )}
              </div>
            )
          } />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      
    </Router>
  );
}

export default App;
