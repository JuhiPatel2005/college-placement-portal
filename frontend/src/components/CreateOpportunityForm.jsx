function CreateOpportunityForm({ newOpportunity, onChange, onSubmit }) {
  return (
    <section className="card">
      <h2>Create Opportunity</h2>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input name="title" value={newOpportunity.title} onChange={onChange} required />
        <label>Company</label>
        <input name="company" value={newOpportunity.company} onChange={onChange} required />
        <label>Description</label>
        <textarea name="description" value={newOpportunity.description} onChange={onChange} required />
        <div className="grid-2">
          <label>
            Type
            <select name="type" value={newOpportunity.type} onChange={onChange}>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </label>
          <label>
            Location
            <input name="location" value={newOpportunity.location} onChange={onChange} />
          </label>
        </div>
        <div className="grid-2">
          <label>
            Salary
            <input name="salary" value={newOpportunity.salary} onChange={onChange} />
          </label>
          <label>
            Stipend
            <input name="stipend" value={newOpportunity.stipend} onChange={onChange} />
          </label>
        </div>
        <label>Duration</label>
        <input name="duration" value={newOpportunity.duration} onChange={onChange} />
        <button className="button" type="submit">Create Opportunity</button>
      </form>
    </section>
  );
}

export default CreateOpportunityForm;
