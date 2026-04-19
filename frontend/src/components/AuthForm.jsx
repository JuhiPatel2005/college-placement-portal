import { useState } from "react";

function AuthForm({ mode, authData, loading, onModeChange, onChange, onSubmit }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (mode === "register" && (!authData.name || authData.name.trim().length < 2)) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!authData.email || !emailRegex.test(authData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!authData.password || authData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Role validation
    if (mode === "register" && !authData.role) {
      newErrors.role = "Please select a role";
    }

    // Role-specific validations
    if (mode === "register" && authData.role === "student") {
      if (authData.year && (authData.year < 1 || authData.year > 4)) {
        newErrors.year = "Year must be between 1 and 4";
      }
      if (authData.passingYear && (authData.passingYear < 2020 || authData.passingYear > 2030)) {
        newErrors.passingYear = "Passing year must be between 2020 and 2030";
      }
    }

    if (mode === "register" && authData.role === "company") {
      if (!authData.companyName || authData.companyName.trim().length === 0) {
        newErrors.companyName = "Company name is required";
      }
      if (authData.companyWebsite) {
        const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlRegex.test(authData.companyWebsite)) {
          newErrors.companyWebsite = "Please enter a valid website URL";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

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

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input name="name" value={authData.name} onChange={handleInputChange} placeholder="John Doe" required />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Role</label>
            <select name="role" value={authData.role} onChange={handleInputChange} required>
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="tpo">TPO Officer</option>
              <option value="superadmin">Admin</option>
            </select>
            {errors.role && <span className="error">{errors.role}</span>}

            {authData.role === "student" && (
              <>
                <label>Year</label>
                <input name="year" type="number" value={authData.year} onChange={handleInputChange} placeholder="1" />
                {errors.year && <span className="error">{errors.year}</span>}
                <label>Branch</label>
                <input name="branch" value={authData.branch} onChange={handleInputChange} placeholder="Computer Science" />
                <label>Passing Year</label>
                <input name="passingYear" type="number" value={authData.passingYear} onChange={handleInputChange} placeholder="2025" />
                {errors.passingYear && <span className="error">{errors.passingYear}</span>}
                <label>College</label>
                <input name="college" value={authData.college} onChange={handleInputChange} placeholder="PDEU" />
              </>
            )}

            {authData.role === "company" && (
              <>
                <label>Company Name</label>
                <input name="companyName" value={authData.companyName || ""} onChange={handleInputChange} placeholder="ABC Corp" required />
                {errors.companyName && <span className="error">{errors.companyName}</span>}

                <label>Company Website</label>
                <input name="companyWebsite" value={authData.companyWebsite || ""} onChange={handleInputChange} placeholder="https://example.com" />
                {errors.companyWebsite && <span className="error">{errors.companyWebsite}</span>}

                <label>Company Description</label>
                <textarea name="companyDescription" value={authData.companyDescription || ""} onChange={handleInputChange} placeholder="Tell us about your company..." />
              </>
            )}
          </>
        )}

        <label>Email Address</label>
        <input name="email" type="email" value={authData.email} onChange={handleInputChange} placeholder="you@example.com" required />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <input name="password" type="password" value={authData.password} onChange={handleInputChange} placeholder="••••••••" required />
        {errors.password && <span className="error">{errors.password}</span>}

        <button className="button" type="submit" disabled={loading} style={{ width: "100%", marginTop: "8px" }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
