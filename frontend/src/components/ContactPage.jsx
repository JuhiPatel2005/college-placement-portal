function ContactPage() {
  return (
    <div className="dashboard">
      <section className="card contact-page">
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="page-eyebrow">Get in touch</p>
            <h2>Contact Us</h2>
            <p>
              Have a query about placements, portal access, or company onboarding? Reach out to the
              placement team using the email below.
            </p>
            <p>
              We support students, recruiters, and administrators with registration, opportunity
              publishing, and application management.
            </p>

            <div className="contact-points">
              <div>
                <span>Email</span>
                <p><a href="mailto:pdpu1234@gmail.com">pdpu1234@gmail.com</a></p>
              </div>
              <div>
                <span>Office</span>
                <p>PDEU Campus, Gandhinagar, Gujarat</p>
              </div>
              <div>
                <span>Availability</span>
                <p>Mon-Fri, 10:00 AM to 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
