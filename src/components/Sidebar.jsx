import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  if(!sidebarOpen){
    return null
  }

  return (
    <div>

      <div>
      <Link to="/youtube">Home</Link>
      <Link to="/youtube/subscriptions">Subscriptions</Link>
      <Link to="/youtube/history">History</Link>
      <Link to="/youtube/your-videos">Your Videos</Link>
      <Link to="/youtube/liked-videos">Liked Videos</Link>

      <Link to="/twitter">Home</Link>
      <Link to="/twitter/profile">Profile</Link>
    </div>

    </div>
  );
}

export default Sidebar;