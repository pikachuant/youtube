import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  if(!sidebarOpen){
    return null
  }

  return (
    <div className="sidebar">

      <div className="sidebar-section">
      <Link className="sidebar-link" to="/youtube">Home</Link>
      <Link className="sidebar-link" to="/youtube/subscriptions">Subscriptions</Link>
      <Link className="sidebar-link" to="/youtube/history">History</Link>
      <Link className="sidebar-link" to="/youtube/your-videos">Your Videos</Link>
      <Link className="sidebar-link" to="/youtube/liked-videos">Liked Videos</Link>
      </div>

      <div className="sidebar-section">
      <Link className="sidebar-link" to="/tweet">Home</Link>
      <Link className="sidebar-link" to="/twitter/profile">Profile</Link>
      </div>

    </div>
  );
}

export default Sidebar;