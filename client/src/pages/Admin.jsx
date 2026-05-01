import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API}/api/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        navigate("/dashboard");
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="portal-page">
      <aside className="sidebar">
        <div>
          <h2>SecureAuth</h2>

          <nav>
            <button className="nav-item" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className="nav-item">Profile</button>
            <button className="nav-item">Settings</button>
            <button className="nav-item active">Admin Panel</button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {data ? (
          <>
            <div className="topbar">
              <div>
                <h1>Admin Panel</h1>
                <p>Manage system access and security controls</p>
              </div>

              <span className={`role-badge ${data.user.role}`}>
                {data.user.role}
              </span>
            </div>

            <div className="stats-grid">
              <div className="info-card">
                <h3>Total Users</h3>
                <p>{data.stats.totalUsers}</p>
              </div>

              <div className="info-card">
                <h3>Admins</h3>
                <p>{data.stats.totalAdmins}</p>
              </div>

              <div className="info-card">
                <h3>Normal Users</h3>
                <p>{data.stats.totalNormalUsers}</p>
              </div>
            </div>

            <div className="profile-panel">
              <h2>Admin Overview</h2>
              <p>
                <strong>Username:</strong> {data.user.username}
              </p>
              <p>
                <strong>Email:</strong> {data.user.email}
              </p>
              <p>
                <strong>Access Level:</strong> {data.user.role}
              </p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}

export default Admin;