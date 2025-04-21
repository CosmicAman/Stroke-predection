import React, { useState } from "react";
import { auth } from "../auth/firebaseConfig";
import { signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = ({ onNavigate, user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (page) => {
    onNavigate(page); // Navigate to the page
    closeMenu(); // Close menu if mobile
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state after logout
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">🧠 StrokePredict</div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <button onClick={() => handleNavClick("home")}>Home</button>
          <button onClick={() => handleNavClick("predict")}>Predict</button>
          <button onClick={() => handleNavClick("metrics")}>Metrics</button> {/* ✅ NEW */}
          <button onClick={() => handleNavClick("history")}>History</button>
          <button onClick={() => handleNavClick("about")}>About</button>

          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        <div className="menu-toggle" onClick={toggleMenu} aria-label="Menu Toggle">
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
