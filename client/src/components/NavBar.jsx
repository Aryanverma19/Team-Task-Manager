import { Link, useNavigate } from "react-router-dom";

const getToken = () => localStorage.getItem("ttm_token");

export default function NavBar() {
  const navigate = useNavigate();
  const authenticated = Boolean(getToken());

  const handleLogout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/dashboard">Team Task Manager</Link>
      </div>
      <nav>
        {authenticated ? (
          <button className="button button-muted" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
