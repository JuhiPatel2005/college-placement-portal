import { useState } from "react";

function AdminOpportunitiesView({ opportunities, applications, loading, onDelete, onEdit }) {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  const selectedOpportunity = opportunities.find((opp) => opp._id === selectedOpportunityId);
  const applicationsForSelected = selectedOpportunityId
    ? applications.filter((app) => String(app?.opportunity?._id || app?.opportunity) === String(selectedOpportunityId))
    : [];

  const getApplicationStatusColor = (status) => {
    return `status-${String(status || "applied").toLowerCase().replace(" ", "-")}`;
  };

  return (
    <div className="dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Opportunities List */}
        <section className="card">
          <h2>Open Opportunities</h2>
          <div className="list">
            {opportunities.length === 0 ? (
              <div className="empty">No opportunities available.</div>
            ) : (
              opportunities.map((opportunity) => {
                const oppApplications = applications.filter(
                  (app) => String(app?.opportunity?._id || app?.opportunity) === String(opportunity._id)
                );
                return (
                  <div
                    key={opportunity._id}
                    className={`item-card ${selectedOpportunityId === opportunity._id ? "selected" : ""}`}
                    onClick={() => setSelectedOpportunityId(opportunity._id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedOpportunityId === opportunity._id ? "#e3f2fd" : "white",
                      borderLeft: selectedOpportunityId === opportunity._id ? "4px solid #1e40af" : "4px solid transparent",
                    }}
                  >
                    <div className="item-header">
                      <strong>{opportunity.title}</strong>
                      <span>{opportunity.company}</span>
                    </div>
                    <div className="item-row">
                      <span>Applications: </span>
                      <strong>{oppApplications.length}</strong>
                    </div>
                    <div className="item-row">
                      <span>Type: </span>
                      <span className="status-badge">{opportunity.type}</span>
                    </div>
                    {opportunity.location && (
                      <div className="item-row">
                        <span>Location: </span>
                        <span>{opportunity.location}</span>
                      </div>
                    )}
                    <div className="item-row" style={{ gap: "8px" }}>
                      <button
                        className="button small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(opportunity);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="button small danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(opportunity);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Applications for Selected Opportunity */}
        <section className="card">
          <h2>
            {selectedOpportunity
              ? `Applications for "${selectedOpportunity.title}"`
              : "Select an Opportunity"}
          </h2>
          {selectedOpportunity ? (
            <div className="list">
              {applicationsForSelected.length === 0 ? (
                <div className="empty">No applications received yet.</div>
              ) : (
                applicationsForSelected.map((application) => {
                  const student = application.student;
                  return (
                    <div key={application._id} className="item-card">
                      <div className="item-header">
                        <strong>{student?.name || "Unknown"}</strong>
                        <span>{student?.email || "N/A"}</span>
                      </div>
                      {student?.cgpa && (
                        <div className="item-row">
                          <span>CGPA: </span>
                          <span>{student.cgpa}</span>
                        </div>
                      )}
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
                      {application.phone && (
                        <div className="item-row">
                          <span>Phone: </span>
                          <span>{application.phone}</span>
                        </div>
                      )}
                      {application.skills && (
                        <div className="item-row">
                          <span>Skills: </span>
                          <span>{application.skills}</span>
                        </div>
                      )}
                      <div className="item-row">
                        <span>Status: </span>
                        <span className={`status-badge ${getApplicationStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="empty">Click on an opportunity to view applications</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminOpportunitiesView;
