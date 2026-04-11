function OpportunityList({ opportunities, userRole, onApply }) {
  return (
    <section className="card">
      <h2>Opportunities</h2>
      <div className="list">
        {opportunities.length === 0 && <div className="empty">No opportunities available yet.</div>}
        {opportunities.map((item) => (
          <div key={item._id} className="item-card">
            <div className="item-header">
              <strong>{item.title}</strong>
              <span>{item.type}</span>
            </div>
            <p>{item.description}</p>
            <div className="item-row">
              <span>{item.company}</span>
              <span>{item.location || "Remote"}</span>
            </div>
            <div className="item-row">
              <span>{item.salary ? `Salary: ${item.salary}` : item.stipend ? `Stipend: ${item.stipend}` : "Compensation not specified"}</span>
              <span>{item.duration ? `Duration: ${item.duration}` : ""}</span>
            </div>
            {userRole === "student" && (
              <button className="button small" type="button" onClick={() => onApply(item)}>
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default OpportunityList;
