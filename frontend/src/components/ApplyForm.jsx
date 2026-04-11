function ApplyForm({ applyForm, onChange, onSubmit, onCancel }) {
  return (
    <section className="card">
      <h2>Apply for Opportunity</h2>
      <form onSubmit={onSubmit}>
        <label>CGPA</label>
        <input name="cgpa" value={applyForm.cgpa} onChange={onChange} required />
        <label>Phone</label>
        <input name="phone" value={applyForm.phone} onChange={onChange} required />
        <label>Skills</label>
        <input name="skills" value={applyForm.skills} onChange={onChange} />
        <label>Applied role</label>
        <input name="appliedRole" value={applyForm.appliedRole} onChange={onChange} />
        <label>Cover letter</label>
        <textarea name="coverLetter" value={applyForm.coverLetter} onChange={onChange} />
        <label>Resume file</label>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={onChange} />
        <div className="row-gap">
          <button className="button" type="submit">Submit Application</button>
          <button className="button secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

export default ApplyForm;
