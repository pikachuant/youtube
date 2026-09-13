import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/subscriptions">Subscriptions</Link>
        <Link to="/history">History</Link>
        <Link to="/your-videos">Your Videos</Link>
        <Link to="/liked-videos">Liked Videos</Link>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </div>

    </div>
  );
}

export default Sidebar;