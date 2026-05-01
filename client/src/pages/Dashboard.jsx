import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
  <div className="portal-page">
    <aside className="sidebar">
      <h2>SecureAuth</h2>

      <nav>
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item" onClick={() => navigate("/profile")}>
            Profile
        </button>

        <button className="nav-item" onClick={() => navigate("/settings")}>
            Settings
        </button>

        {user?.role === "admin" && (
          <button className="nav-item" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>

    <main className="main-content">
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.username}</p>
        </div>

        <span className={`role-badge ${user?.role}`}>
          {user?.role}
        </span>
      </div>

      <div className="stats-grid">
        <div className="info-card">
          <h3>Account Status</h3>
          <p>Active</p>
        </div>

        <div className="info-card">
          <h3>Authentication</h3>
          <p>JWT Verified</p>
        </div>

        <div className="info-card">
          <h3>Role</h3>
          <p>{user?.role}</p>
        </div>
      </div>

      <div className="profile-panel">
        <h2>Profile Overview</h2>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Access Level:</strong> {user?.role}</p>
      </div>
    </main>
  </div>
);
}

export default Dashboard;