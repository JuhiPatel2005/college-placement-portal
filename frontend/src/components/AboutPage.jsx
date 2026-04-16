function AboutPage() {
  return (
    <div className="dashboard">
      <section className="card about-page">
        <p className="page-eyebrow">About PDEU Placements</p>
        <h2>A simple platform for campus hiring</h2>
        <p className="page-lead">
          This portal helps students, companies, and the placement office manage opportunities and
          applications in one place.
        </p>

        <div className="about-grid">
          <article className="about-block">
            <h3>For students</h3>
            <ul>
              <li>Browse jobs, placements, and internships</li>
              <li>Apply quickly with resume and profile details</li>
              <li>Track application progress easily</li>
            </ul>
          </article>

          <article className="about-block">
            <h3>For companies</h3>
            <p>
              Post opportunities, review applications, and manage shortlisting in a clean workflow.
            </p>
          </article>
          <article className="about-block">
            <h3>For placement office</h3>
            <p>
              Monitor activity, manage users, and support a smooth placement process across campus.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
