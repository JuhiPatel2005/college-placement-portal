import { useState } from "react";
import { serverOrigin } from "../api";

function formatStatus(status) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function ApplicationList({ applications, userRole, loading, onStatusUpdate, postedOpportunityCount }) {
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const [totalRoundsDraft, setTotalRoundsDraft] = useState("1");
  const [currentRoundDraft, setCurrentRoundDraft] = useState("0");

  const beginAction = (app, nextAction) => {
    setActioningId(String(app._id));
    setActionType(nextAction);
    setOfferLetterFile(null);
    setTotalRoundsDraft(String(app.totalRounds ?? 1));
    setCurrentRoundDraft(String(app.currentRound ?? 0));
  };

  const cancelAction = () => {
    setActioningId(null);
    setActionType("");
    setOfferLetterFile(null);
    setTotalRoundsDraft("1");
    setCurrentRoundDraft("0");
  };

  const confirmShortlist = async (app) => {
    const payload = {
      status: "shortlisted",
      totalRounds: Number(totalRoundsDraft) || 1,
      currentRound: Number(currentRoundDraft) || 0,
    };
    await onStatusUpdate(app, payload);
    cancelAction();
  };

  const confirmOfferUpload = async (app) => {
    const payload = { status: app.status || "shortlisted" };
    await onStatusUpdate(app, payload, offerLetterFile || undefined);
    cancelAction();
  };

  const emptyMessage = (() => {
    if (applications.length > 0) return null;
    if (userRole === "company" && postedOpportunityCount === 0) {
      return "You have not created any job or internship listing yet. Post an opportunity from your dashboard to start receiving applications.";
    }
    if (userRole === "company") {
      return "No applications have been submitted to your listings yet.";
    }
    return "No applications found.";
  })();

  return (
    <div className="list">
      {emptyMessage && <div className="empty empty-state">{emptyMessage}</div>}
      {applications.map((app) => {
        const resumeUrl = app.resume ? `${serverOrigin}/${app.resume.replace(/\\/g, "/")}` : null;
        const offerLetterPath = app.offerLetter
          ? String(app.offerLetter).startsWith("http")
            ? String(app.offerLetter)
            : `${serverOrigin}/${String(app.offerLetter).replace(/\\/g, "/")}`
          : null;
        const appliedOn = app.createdAt
          ? new Date(app.createdAt).toLocaleString()
          : null;
        const isActioning = actioningId === String(app._id);

        return (
          <div key={app._id} className="item-card">
            <div className="item-header">
              <strong className="item-title">{app.opportunity?.title || "Opportunity"}</strong>
              <span className={`status-badge status-${String(app.status || "applied").toLowerCase()}`}>
                {formatStatus(app.status)}
              </span>
            </div>
            {app.opportunity?.company && (
              <div className="item-row item-meta">
                <span><strong>Company:</strong> {app.opportunity.company}</span>
              </div>
            )}
            {appliedOn && (
              <div className="item-row item-meta">
                <span><strong>Applied date:</strong> {appliedOn}</span>
              </div>
            )}
            {userRole === "student" && (
              <div className="item-row item-meta">
                <span>Applied role: {app.appliedRole || "—"}</span>
                <span>CGPA: {app.cgpa ?? "—"}</span>
              </div>
            )}
            {userRole !== "student" && (
              <p className="cover-preview">{app.coverLetter || "No cover letter provided."}</p>
            )}
            {userRole === "student" && app.coverLetter && (
              <p className="cover-preview">{app.coverLetter}</p>
            )}
            {userRole !== "student" && (
              <div className="item-row item-meta">
                <span>Student: {app.student?.name || app.student?.email || "Unknown"}</span>
                <span>Email: {app.student?.email || "—"}</span>
              </div>
            )}
            <div className="item-row item-meta">
              <span>Phone: {app.phone || "—"}</span>
              {userRole !== "student" && <span>CGPA: {app.cgpa ?? "—"}</span>}
            </div>
            {userRole !== "student" && app.skills && (
              <div className="item-row">
                <span>Skills: {app.skills}</span>
              </div>
            )}
            {userRole === "student" && app.skills && (
              <div className="item-row">
                <span>Skills: {app.skills}</span>
              </div>
            )}
            {resumeUrl && (
              <div className="item-row">
                <a href={resumeUrl} target="_blank" rel="noreferrer">Download resume</a>
              </div>
            )}
            {(userRole !== "student" || app.status === "shortlisted") && (
              <div className="item-row">
                <strong>Offer letter: </strong>
                {offerLetterPath ? (
                  <a href={offerLetterPath} target="_blank" rel="noreferrer">Download PDF</a>
                ) : (
                  <span>No offer letter uploaded.</span>
                )}
              </div>
            )}
            {userRole === "student" && app.status === "shortlisted" && (
              <div className="item-row">
                <span>
                  Interview progress: Round {app.currentRound ?? 0} of {app.totalRounds ?? 1}
                </span>
              </div>
            )}
            {userRole !== "student" && (
              <div className="actions-col">
                {isActioning ? (
                  <div className="shortlist-panel">
                    {actionType === "shortlist" ? (
                      <>
                        <label>Total interview rounds</label>
                        <input
                          type="number"
                          min="1"
                          value={totalRoundsDraft}
                          onChange={(e) => setTotalRoundsDraft(e.target.value)}
                        />
                        <label>Current round</label>
                        <input
                          type="number"
                          min="0"
                          value={currentRoundDraft}
                          onChange={(e) => setCurrentRoundDraft(e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <label>Offer letter PDF</label>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(e) => setOfferLetterFile(e.target.files?.[0] || null)}
                        />
                      </>
                    )}
                    <div className="row-gap">
                      <button
                        className="button small"
                        type="button"
                        disabled={loading}
                        onClick={() => (actionType === "shortlist" ? confirmShortlist(app) : confirmOfferUpload(app))}
                      >
                        {actionType === "shortlist" ? "Save shortlist status" : "Upload offer letter"}
                      </button>
                      <button className="button small secondary" type="button" onClick={cancelAction}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="actions-row">
                    <button
                      className="button small"
                      type="button"
                      onClick={() => beginAction(app, "shortlist")}
                    >
                      {app.status === "shortlisted" ? "Update rounds" : "Shortlist"}
                    </button>
                    {app.status === "shortlisted" && (
                      <button
                        className="button small"
                        type="button"
                        onClick={() => beginAction(app, "offer")}
                      >
                        Upload offer letter
                      </button>
                    )}
                    <button className="button small danger" type="button" onClick={() => onStatusUpdate(app, { status: "rejected" })}>
                      Reject
                    </button>
                    <button className="button small secondary" type="button" onClick={() => onStatusUpdate(app, { status: "applied", currentRound: 0 })}>
                      Mark as applied
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationList;
