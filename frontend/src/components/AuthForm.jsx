function AuthForm({ mode, authData, loading, onModeChange, onChange, onSubmit }) {
  return (
    <section className="card auth-card">
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

      <div className="tab-row">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => onModeChange("login")}>
          Login
        </button>
        <button className={mode === "register" ? "active" : ""} type="button" onClick={() => onModeChange("register")}>
          Register
        </button>
      </div>

      <form onSubmit={onSubmit}>
        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input name="name" value={authData.name} onChange={onChange} placeholder="John Doe" required />

            <label>Role</label>
            <select name="role" value={authData.role} onChange={onChange} required>
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="tpo">TPO Officer</option>
              <option value="superadmin">Admin</option>
            </select>

            {authData.role === "student" && (
              <>
                <label>Year</label>
                <input name="year" type="number" value={authData.year} onChange={onChange} placeholder="2024" />
                <label>Branch</label>
                <input name="branch" value={authData.branch} onChange={onChange} placeholder="Computer Science" />
                <label>Passing Year</label>
                <input name="passingYear" type="number" value={authData.passingYear} onChange={onChange} placeholder="2025" />
                <label>College</label>
                <input name="college" value={authData.college} onChange={onChange} placeholder="PDEU" />
              </>
            )}

            {authData.role === "company" && (
              <>
                <label>Company Name</label>
                <input name="companyName" value={authData.companyName || ""} onChange={onChange} placeholder="ABC Corp" required />

                <label>Company Website</label>
                <input name="companyWebsite" value={authData.companyWebsite || ""} onChange={onChange} placeholder="https://example.com" />

                <label>Company Description</label>
                <textarea name="companyDescription" value={authData.companyDescription || ""} onChange={onChange} placeholder="Tell us about your company..." />
              </>
            )}
          </>
        )}

        <label>Email Address</label>
        <input name="email" type="email" value={authData.email} onChange={onChange} placeholder="you@example.com" required />

        <label>Password</label>
        <input name="password" type="password" value={authData.password} onChange={onChange} placeholder="••••••••" required />

        <button className="button" type="submit" disabled={loading} style={{ width: "100%", marginTop: "8px" }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
