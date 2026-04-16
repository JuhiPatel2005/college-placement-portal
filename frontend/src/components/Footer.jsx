function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PDEU Placements</h3>
            <p>
              PDEU Placement Portal connects students, companies, and the placement office on one
              reliable platform.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PDEU Placement Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
