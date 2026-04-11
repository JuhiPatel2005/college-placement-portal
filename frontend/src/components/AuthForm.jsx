function AuthForm({ mode, authData, onModeChange, onChange, onSubmit }) {
  return (
    <section className="card auth-card">
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
            <label>Name</label>
            <input name="name" value={authData.name} onChange={onChange} required />
            <label>Role</label>
            <select name="role" value={authData.role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="tpo">TPO</option>
              <option value="superadmin">Superadmin</option>
            </select>
            {(authData.role === "student" || authData.role === "tpo") && (
              <>
                <div className="grid-2">
                  <label>
                    Year
                    <input name="year" value={authData.year} onChange={onChange} />
                  </label>
                  <label>
                    Branch
                    <input name="branch" value={authData.branch} onChange={onChange} />
                  </label>
                </div>
                <div className="grid-2">
                  <label>
                    Passing Year
                    <input name="passingYear" value={authData.passingYear} onChange={onChange} />
                  </label>
                  <label>
                    College
                    <input name="college" value={authData.college} onChange={onChange} />
                  </label>
                </div>
              </>
            )}
            {authData.role === "company" && (
              <>
                <label>Company Name</label>
                <input name="companyName" value={authData.companyName || ""} onChange={onChange} />
                <label>Company Website</label>
                <input name="companyWebsite" value={authData.companyWebsite || ""} onChange={onChange} />
                <label>Company Description</label>
                <textarea name="companyDescription" value={authData.companyDescription || ""} onChange={onChange} />
              </>
            )}
          </>
        )}

        <label>Email</label>
        <input name="email" type="email" value={authData.email} onChange={onChange} required />
        <label>Password</label>
        <input name="password" type="password" value={authData.password} onChange={onChange} required />
        <button className="button" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
