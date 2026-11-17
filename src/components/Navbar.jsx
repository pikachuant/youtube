import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/Authcontext.jsx";
import streamtalk from "../picture/streamtalk.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

function Navbar({ sidebarOpen, setopenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading,setUser} = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const searchButton = function () {
    if (!search.trim()) {
      return;
    }
    if (location.pathname == "/tweet") {
      navigate(`/tweet/search?q=${encodeURIComponent(search.trim())}`);
    }
    if (location.pathname == "/youtube") {
      navigate(`/youtube/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const createButton = function () {
    if (location.pathname.startsWith("/tweet")) {
      navigate(`/tweet/create`);
    } else {
      navigate(`/youtube/upload`);
    }
  };

  const handleLogout = async function () {
    await fetch(`https://antonpklive.online/v1/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        className="navbar-hamburger"
        onClick={() => setopenSidebar(!sidebarOpen)}
      >
        ☰
      </button>
      <div className="navbar-brand">
        <img src={streamtalk} alt="Tweet Logo" />
      </div>

      {/* Search */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchButton}>Search</button>
      </div>

      {user && (
        <button
          className="navbar-create-btn"
          onClick={createButton}
          aria-label="Create"
        >
          <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
          <span>Create</span>
        </button>
      )}

      {user ? (
        <div
          className="navbar-user"
          key={user._id}
          style={{ position: "relative" }}
        >
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <img src={user.avatar} alt={user.fullName} />
            <p>{user.fullName}</p>
          </div>

          {open && (
            <ul className="user-dropdown">
              <li>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link className="navbar-login-link" to="/login">
          Login/Signup
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
