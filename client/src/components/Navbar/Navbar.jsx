import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo">🛒 ShopSphere</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {user ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              
              <span style={{ color: "white" }}>
                Welcome, {user.name}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;