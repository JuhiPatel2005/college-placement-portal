function formatOpportunityType(type) {
  if (type === "job") return "Job";
  if (type === "placement") return "Placement";
  if (type === "internship") return "Internship";
  return type || "";
}

function OpportunityList({ opportunities, userRole, appliedOpportunityIds, loading, onApply, onDelete, onEdit }) {
  return (
    <div className="list">
      {opportunities.length === 0 && <div className="empty empty-state">No opportunities available yet.</div>}
      {opportunities.map((item) => {
        const isApplied = appliedOpportunityIds?.has(String(item._id));
        return (
          <div key={item._id} className="item-card">
            <div className="item-header">
              <div>
                <strong className="item-title">{item.title}</strong>
                <p className="item-subtitle">{item.company || "Company not specified"}</p>
              </div>
              <span className="type-pill">{formatOpportunityType(item.type)}</span>
            </div>
            <p className="item-description">{item.description || "No description provided."}</p>
            <div className="item-row item-meta">
              <span><strong>Location:</strong> {item.location || "Remote"}</span>
              <span>
                <strong>Compensation:</strong>{" "}
                {item.salary ? item.salary : item.stipend ? `Stipend ${item.stipend}` : "Not specified"}
              </span>
            </div>
            <div className="item-row item-meta">
              {item.duration ? <span><strong>Duration:</strong> {item.duration}</span> : <span className="text-muted">Duration not specified</span>}
            </div>
            {userRole === "student" &&
              (isApplied ? (
                <button className="button small secondary" type="button" disabled>
                  Applied
                </button>
              ) : (
                <button className="button small" type="button" onClick={() => onApply(item)}>
                  Apply
                </button>
              ))}
            {(userRole === "company" || userRole === "tpo" || userRole === "superadmin") && (
              <div className="actions-row">
                <button
                  className="button small secondary"
                  type="button"
                  disabled={loading}
                  onClick={() => onEdit?.(item)}
                >
                  Edit
                </button>
                <button
                  className="button small danger"
                  type="button"
                  disabled={loading}
                  onClick={() => onDelete?.(item)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OpportunityList;
