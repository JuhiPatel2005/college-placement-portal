function ApplicationList({ applications, userRole, onStatusUpdate }) {
  const baseUrl = "http://localhost:5000";

  return (
    <section className="card">
      <h2>Applications</h2>
      <div className="list">
        {applications.length === 0 && <div className="empty">No applications found.</div>}
        {applications.map((app) => {
          const resumeUrl = app.resume ? `${baseUrl}/${app.resume}` : null;
          const offerLetterText = app.offerLetter || "No offer letter provided.";
          const offerLetterIsUrl = typeof offerLetterText === "string" && offerLetterText.startsWith("http");

          return (
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
              {resumeUrl && (
                <div className="item-row">
                  <a href={resumeUrl} target="_blank" rel="noreferrer">Download resume</a>
                </div>
              )}
              <div className="item-row">
                <strong>Offer letter:</strong>
                {offerLetterIsUrl ? (
                  <a href={offerLetterText} target="_blank" rel="noreferrer">View offer letter</a>
                ) : (
                  <span>{offerLetterText}</span>
                )}
              </div>
              {userRole !== "student" && (
                <div className="actions-row">
                  <button className="button small" type="button" onClick={() => onStatusUpdate(app, "shortlisted")}>Shortlist</button>
                  <button className="button small" type="button" onClick={() => onStatusUpdate(app, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ApplicationList;
