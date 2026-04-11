import { useEffect, useState } from "react";
import {
  applyToOpportunity,
  createOpportunity,
  fetchApplications,
  fetchOpportunities,
  getCurrentUser,
  loginUser,
  registerUser,
  updateApplicationStatus,
  updateProfile,
  fetchUsers,
  updateUser,
} from "./api";
import AuthForm from "./components/AuthForm.jsx";
import OpportunityList from "./components/OpportunityList.jsx";
import CreateOpportunityForm from "./components/CreateOpportunityForm.jsx";
import ApplyForm from "./components/ApplyForm.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import UserManagement from "./components/UserManagement.jsx";

const defaultAuth = {
  name: "",
  email: "",
  password: "",
  role: "student",
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
  type: "job",
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

function App() {
  const [token, setToken] = useState(localStorage.getItem("placement_token") || "");
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileEditing, setProfileEditing] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [authData, setAuthData] = useState(defaultAuth);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOpportunity, setNewOpportunity] = useState(defaultOpportunity);
  const [applyForm, setApplyForm] = useState(defaultApply);
  const [activeApply, setActiveApply] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  useEffect(() => {
    if (user?.role && token) {
      loadData();
    }
  }, [user, token]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser(token);
      setUser(data);
      setProfileData(data);
      localStorage.setItem("placement_token", token);
    } catch (error) {
      showMessage(error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const promises = [fetchOpportunities(token), fetchApplications(token, user.role)];
      if (user.role === "superadmin") {
        promises.push(fetchUsers(token));
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

  const logout = () => {
    setToken("");
    setUser(null);
    setOpportunities([]);
    setApplications([]);
    localStorage.removeItem("placement_token");
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
      setToken(response.token);
      setAuthData(defaultAuth);
      showMessage("Logged in successfully");
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
      const updated = await updateProfile(token, profileData);
      setUser(updated);
      setProfileData(updated);
      setProfileEditing(false);
      showMessage("Profile updated successfully");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setProfileEditing((prev) => !prev);
  };

  const handleRoleChange = async (userItem, role) => {
    try {
      setLoading(true);
      const updated = await updateUser(token, userItem._id, { role });
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
    setNewOpportunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOpportunity = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const created = await createOpportunity(token, newOpportunity);
      setOpportunities((prev) => [created, ...prev]);
      setNewOpportunity(defaultOpportunity);
      showMessage("Opportunity created");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openApply = (opportunity) => {
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
    try {
      const form = new FormData();
      Object.entries(applyForm).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          form.append(key, value);
        }
      });
      setLoading(true);
      const result = await applyToOpportunity(token, form);
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

  const handleStatusUpdate = async (application, status) => {
    try {
      setLoading(true);
      const offerLetter =
        status === "shortlisted"
          ? window.prompt("Enter offer letter text or URL (optional)", application.offerLetter || "") || ""
          : undefined;
      const payload = { status };
      if (offerLetter !== undefined) payload.offerLetter = offerLetter;
      const updated = await updateApplicationStatus(token, application._id, payload);
      setApplications((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showMessage("Status updated");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>Placement Portal</h1>
        {user && (
          <div className="user-bar">
            <span>{`${user.name} (${user.role})`}</span>
            <button className="button small" onClick={logout}>Logout</button>
          </div>
        )}
      </header>

      <main>
        {message && <div className="message">{message}</div>}
        {loading && <div className="message info">Loading ...</div>}

        {!token ? (
          <AuthForm
            mode={mode}
            authData={authData}
            onModeChange={setMode}
            onChange={handleAuthChange}
            onSubmit={handleAuthSubmit}
          />
        ) : (
          <>
            <section className="card">
              <h2>Dashboard</h2>
              <div className="row-gap">
                <span>Opportunities: {opportunities.length}</span>
                <span>Applications: {applications.length}</span>
                {user.role === "superadmin" && <span>Users: {users.length}</span>}
              </div>
              {user.role === "company" && <div className="item-row">Showing your posted opportunities only.</div>}
              {user.role === "student" && <div className="item-row">Apply to roles and track your submissions.</div>}
              {user.role === "tpo" && <div className="item-row">Manage opportunities and applications across the college.</div>}
            </section>

            {profileData && (
              <ProfileForm
                user={user}
                profileData={profileData}
                editing={profileEditing}
                onChange={handleProfileChange}
                onSubmit={handleProfileSubmit}
                onEditToggle={handleEditToggle}
              />
            )}

            {user.role === "superadmin" && (
              <UserManagement users={users} onRoleChange={handleRoleChange} />
            )}

            <OpportunityList opportunities={opportunities} userRole={user.role} onApply={openApply} />
            {user.role !== "student" && (
              <CreateOpportunityForm
                newOpportunity={newOpportunity}
                onChange={handleOpportunityChange}
                onSubmit={handleCreateOpportunity}
              />
            )}
            {activeApply && (
              <ApplyForm
                applyForm={applyForm}
                onChange={handleApplyFormChange}
                onSubmit={handleApply}
                onCancel={() => {
                  setActiveApply(null);
                  setApplyForm(defaultApply);
                }}
              />
            )}
            <ApplicationList applications={applications} userRole={user.role} onStatusUpdate={handleStatusUpdate} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
