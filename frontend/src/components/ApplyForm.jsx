function ApplyForm({ applyForm, loading, onChange, onSubmit, onCancel }) {
  return (
    <section className="card">
      <h2>Apply for Opportunity</h2>
      <form onSubmit={onSubmit}>
        <label>Opportunity ID</label>
        <input
          name="opportunityIdDisplay"
          value={applyForm.opportunityId ? String(applyForm.opportunityId) : ""}
          readOnly
          title="Pre-filled from the opportunity you selected"
        />
        <label>CGPA</label>
        <input name="cgpa" type="number" min={0} max={10} step={0.01} value={applyForm.cgpa} onChange={onChange} required />
        <label>Phone number</label>
        <input
          name="phone"
          type="tel"
          pattern="[0-9+\-\s()]{8,20}"
          title="Enter 8-20 digits and optional + - ( )"
          value={applyForm.phone}
          onChange={onChange}
          required
        />
        <label>Skills</label>
        <input name="skills" value={applyForm.skills} onChange={onChange} />
        <label>Applied role</label>
        <input name="appliedRole" value={applyForm.appliedRole} onChange={onChange} />
        <label>Cover letter</label>
        <textarea name="coverLetter" value={applyForm.coverLetter} onChange={onChange} />
        <label>Resume (PDF, DOC, DOCX)</label>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={onChange} required />
        <div className="row-gap">
          <button className="button" type="submit" disabled={loading}>Submit Application</button>
          <button className="button secondary" type="button" disabled={loading} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

export default ApplyForm;
