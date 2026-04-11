function ApplicationList({ applications, userRole, onStatusUpdate }) {
  return (
    <section className="card">
      <h2>Applications</h2>
      <div className="list">
        {applications.length === 0 && <div className="empty">No applications found.</div>}
        {applications.map((app) => (
          <div key={app._id} className="item-card">
            <div className="item-header">
              <strong>{app.opportunity?.title || "Opportunity"}</strong>
              <span>{app.status}</span>
            </div>
            <p>{app.coverLetter || "No cover letter provided."}</p>
            <div className="item-row">
              <span>Student: {app.student?.name || app.student?.email || "Unknown"}</span>
              <span>Phone: {app.phone || "-"}</span>
            </div>
            <div className="item-row">
              <span>CGPA: {app.cgpa || "-"}</span>
              <span>Role: {app.appliedRole || "-"}</span>
            </div>
            {userRole !== "student" && (
              <div className="actions-row">
                <button className="button small" type="button" onClick={() => onStatusUpdate(app, "shortlisted")}>Shortlist</button>
                <button className="button small" type="button" onClick={() => onStatusUpdate(app, "rejected")}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ApplicationList;
