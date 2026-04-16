function UserManagement({ users, onRoleChange }) {
  return (
    <section className="card">
      <h2>User Management</h2>
      <div className="list">
        {users.length === 0 ? (
          <div className="empty">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="item-card">
              <div className="item-header">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <div className="item-row">
                <span>Role: </span>
                <select value={user.role} onChange={(e) => onRoleChange(user, e.target.value)}>
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                  <option value="tpo">TPO</option>
                  <option value="superadmin">Admin</option>
                </select>
              </div>
              {(user.year != null || user.branch) && (
                <div className="item-row">
                  {user.year != null && <span>Year: {user.year} </span>}
                  {user.branch && <span>Branch: {user.branch}</span>}
                </div>
              )}
              {user.college && <div className="item-row">College: {user.college}</div>}
              {user.companyName && <div className="item-row">Company: {user.companyName}</div>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default UserManagement;
