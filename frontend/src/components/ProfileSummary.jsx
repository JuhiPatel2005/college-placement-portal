function ProfileSummary({ user, onEdit }) {
  if (!user) return null;

  return (
    <section className="card profile-summary">
      <div className="item-header">
        <strong>Profile</strong>
        <button className="button small" type="button" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      <div className="profile-rows">
        <div className="profile-row"><span className="profile-label">Name</span><span>{user.name || "-"}</span></div>
        <div className="profile-row"><span className="profile-label">Email</span><span>{user.email || "-"}</span></div>
        <div className="profile-row"><span className="profile-label">Role</span><span>{user.role === "superadmin" ? "admin" : user.role}</span></div>

        {user.role === "student" && (
          <>
            <div className="profile-row"><span className="profile-label">Year</span><span>{user.year ?? "-"}</span></div>
            <div className="profile-row"><span className="profile-label">Branch</span><span>{user.branch || "-"}</span></div>
            <div className="profile-row"><span className="profile-label">Passing Year</span><span>{user.passingYear ?? "-"}</span></div>
            <div className="profile-row"><span className="profile-label">College</span><span>{user.college || "-"}</span></div>
          </>
        )}

        {user.role === "company" && (
          <>
            <div className="profile-row"><span className="profile-label">Company Name</span><span>{user.companyName || "-"}</span></div>
            <div className="profile-row"><span className="profile-label">Website</span><span>{user.companyWebsite || "-"}</span></div>
            <div className="profile-row"><span className="profile-label">Description</span><span>{user.companyDescription || "-"}</span></div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProfileSummary;
