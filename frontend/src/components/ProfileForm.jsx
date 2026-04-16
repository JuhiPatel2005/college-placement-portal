function ProfileForm({
  profileData,
  loading,
  onChange,
  onSubmit,
  onCancel,
  showCancel = false,
}) {
  return (
    <section className="card">
      <div className="item-header">
        <strong>Edit Profile</strong>
      </div>

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input name="name" value={profileData.name} onChange={onChange} required />
        <label>Email</label>
        <input name="email" value={profileData.email} disabled />
        <label>Role</label>
        <input
          name="role"
          value={profileData.role === "superadmin" ? "admin" : profileData.role}
          disabled
        />

        {profileData.role === "student" && (
          <>
            <div className="grid-2">
              <label>
                Year
                <input name="year" type="number" value={profileData.year ?? ""} onChange={onChange} />
              </label>
              <label>
                Branch
                <input name="branch" value={profileData.branch || ""} onChange={onChange} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Passing Year
                <input name="passingYear" type="number" value={profileData.passingYear ?? ""} onChange={onChange} />
              </label>
              <label>
                College
                <input name="college" value={profileData.college || ""} onChange={onChange} />
              </label>
            </div>
          </>
        )}

        {profileData.role === "company" && (
          <>
            <label>Company Name</label>
            <input name="companyName" value={profileData.companyName || ""} onChange={onChange} />
            <label>Company Website</label>
            <input name="companyWebsite" value={profileData.companyWebsite || ""} onChange={onChange} />
            <label>Company Description</label>
            <textarea name="companyDescription" value={profileData.companyDescription || ""} onChange={onChange} />
          </>
        )}

        <div className="row-gap">
          <button className="button" type="submit" disabled={loading}>Save</button>
          {showCancel && (
            <button className="button secondary" type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ProfileForm;
