import { useState } from "react";

function UserManagement({ users, onRoleChange }) {
  const [activeTab, setActiveTab] = useState("students");

  const filterUsersByRole = (role) => {
    return users.filter((user) => user.role === role);
  };

  const getFilteredUsers = () => {
    switch (activeTab) {
      case "students":
        return filterUsersByRole("student");
      case "companies":
        return filterUsersByRole("company");
      case "tpo":
        return filterUsersByRole("tpo");
      default:
        return [];
    }
  };

  const filteredUsers = getFilteredUsers();

  const tabs = [
    { id: "students", label: "Students" },
    { id: "companies", label: "Companies" },
    { id: "tpo", label: "TPO" },
  ];

  return (
    <section className="card">
      <h2>User Management</h2>

      {/* Tabs */}
      <div className="tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users List */}
      <div className="list">
        {filteredUsers.length === 0 ? (
          <div className="empty">No users found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="item-card">
              <div className="item-header">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <div className="item-row">
                <span>Role: </span>
                <select value={user.role} onChange={(e) => onRoleChange(user, e.target.value)}>
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                  <option value="tpo">TPO</option>
                  <option value="superadmin">Admin</option>
                </select>
              </div>
              {(user.year != null || user.branch) && (
                <div className="item-row">
                  {user.year != null && <span>Year: {user.year} </span>}
                  {user.branch && <span>Branch: {user.branch}</span>}
                </div>
              )}
              {user.college && <div className="item-row">College: {user.college}</div>}
              {user.companyName && <div className="item-row">Company: {user.companyName}</div>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default UserManagement;
