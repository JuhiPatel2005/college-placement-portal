function CreateOpportunityForm({ newOpportunity, loading, onChange, onSubmit, isEditMode, onCancelEdit }) {
  const isJobLike = newOpportunity.type === "job" || newOpportunity.type === "placement";
  const isInternship = newOpportunity.type === "internship";

  return (
    <section className="card">
      <h2>{isEditMode ? "Edit Opportunity" : "Create Opportunity"}</h2>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input name="title" value={newOpportunity.title} onChange={onChange} required />
        <label>Company name</label>
        <input name="company" value={newOpportunity.company} onChange={onChange} required />
        <label>Description</label>
        <textarea name="description" value={newOpportunity.description} onChange={onChange} required />
        <div className="grid-2">
          <label>
            Type
            <select name="type" value={newOpportunity.type} onChange={onChange} required>
              <option value="">Select type</option>
              <option value="job">Job</option>
              <option value="placement">Placement</option>
              <option value="internship">Internship</option>
            </select>
          </label>
          <label>
            Location
            <input name="location" value={newOpportunity.location} onChange={onChange} placeholder="City or Remote" />
          </label>
        </div>
        {isJobLike ? (
          <label>
            Salary
            <input name="salary" value={newOpportunity.salary} onChange={onChange} placeholder="e.g. 12 LPA" />
          </label>
        ) : null}
        {isInternship ? (
          <>
            <div className="grid-2">
              <label>
                Stipend
                <input name="stipend" value={newOpportunity.stipend} onChange={onChange} placeholder="e.g. ₹25k/month" />
              </label>
              <label>
                Duration
                <input name="duration" value={newOpportunity.duration} onChange={onChange} placeholder="e.g. 3 months" />
              </label>
            </div>
          </>
        ) : null}
        <div className="actions-row">
          <button className="button" type="submit" disabled={loading}>
            {isEditMode ? "Save Changes" : "Create Opportunity"}
          </button>
          {isEditMode && (
            <button className="button secondary" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default CreateOpportunityForm;
