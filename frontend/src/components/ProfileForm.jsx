function ProfileForm({ user, profileData, onChange, onSubmit, onEditToggle, editing }) {
  return (
    <section className="card">
      <div className="item-header">
        <strong>Profile</strong>
        <button className="button small" type="button" onClick={onEditToggle}>
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input name="name" value={profileData.name} onChange={onChange} disabled={!editing} required />
        <label>Email</label>
        <input name="email" value={profileData.email} disabled />
        <label>Role</label>
        <input name="role" value={profileData.role} disabled />

        {(profileData.role === "student" || profileData.role === "tpo") && (
          <>
            <div className="grid-2">
              <label>
                Year
                <input name="year" value={profileData.year || ""} onChange={onChange} disabled={!editing} />
              </label>
              <label>
                Branch
                <input name="branch" value={profileData.branch || ""} onChange={onChange} disabled={!editing} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Passing Year
                <input name="passingYear" value={profileData.passingYear || ""} onChange={onChange} disabled={!editing} />
              </label>
              <label>
                College
                <input name="college" value={profileData.college || ""} onChange={onChange} disabled={!editing} />
              </label>
            </div>
          </>
        )}

        {profileData.role === "company" && (
          <>
            <label>Company Name</label>
            <input name="companyName" value={profileData.companyName || ""} onChange={onChange} disabled={!editing} />
            <label>Company Website</label>
            <input name="companyWebsite" value={profileData.companyWebsite || ""} onChange={onChange} disabled={!editing} />
            <label>Company Description</label>
            <textarea name="companyDescription" value={profileData.companyDescription || ""} onChange={onChange} disabled={!editing} />
          </>
        )}

        {editing && <button className="button" type="submit">Save profile</button>}
      </form>
    </section>
  );
}

export default ProfileForm;
