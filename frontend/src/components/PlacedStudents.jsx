function PlacedStudents({ applications }) {
  const placedApplications = applications.filter(
    (app) => app.status === "selected" || app.status === "placed"
  );

  const getStatusColor = (status) => {
    return `status-${String(status || "applied").toLowerCase().replace(" ", "-")}`;
  };

  return (
    <section className="card">
      <h2>Placed Students</h2>
      <div className="list">
        {placedApplications.length === 0 ? (
          <div className="empty">No placed students yet.</div>
        ) : (
          placedApplications.map((application) => {
            const student = application.student;
            const opportunity = application.opportunity;
            return (
              <div key={application._id} className="item-card">
                <div className="item-header">
                  <strong>{student?.name || "Unknown"}</strong>
                  <span>{student?.email || "N/A"}</span>
                </div>
                <div className="item-row">
                  <span>Position: </span>
                  <strong>{opportunity?.title || "N/A"}</strong>
                </div>
                <div className="item-row">
                  <span>Company: </span>
                  <strong>{opportunity?.company || "N/A"}</strong>
                </div>
                {student?.year && (
                  <div className="item-row">
                    <span>Year: </span>
                    <span>{student.year}</span>
                  </div>
                )}
                {student?.branch && (
                  <div className="item-row">
                    <span>Branch: </span>
                    <span>{student.branch}</span>
                  </div>
                )}
                {student?.cgpa && (
                  <div className="item-row">
                    <span>CGPA: </span>
                    <span>{student.cgpa}</span>
                  </div>
                )}
                <div className="item-row">
                  <span>Status: </span>
                  <span className={`status-badge ${getStatusColor(application.status)}`}>
                    {application.status === "selected" ? "Selected" : "Placed"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default PlacedStudents;
