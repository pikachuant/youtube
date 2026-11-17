import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/youtube",               icon: "🏠", label: "Home"          },
  { to: "/youtube/subscriptions", icon: "📺", label: "Subscriptions" },
  { to: "/youtube/history",       icon: "🕐", label: "History"       },
  { to: "/youtube/your-videos",   icon: "🎬", label: "Your Videos"   },
  { to: "/youtube/liked-videos",  icon: "👍", label: "Liked Videos"  },
]

const TWEET_ITEMS = [
  { to: "/tweet",           icon: "🐦", label: "Tweet Home" },
  { to: "/twitter/profile", icon: "👤", label: "Profile"    },
]

function Sidebar({ sidebarOpen }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--mini'}`}>

      <div className="sidebar-section">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
            to={to}
            title={label}
          >
            <span className="sidebar-icon">{icon}</span>
            {sidebarOpen && <span className="sidebar-label">{label}</span>}
          </Link>
        ))}
      </div>

      <div className="sidebar-section">
        {TWEET_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
            to={to}
            title={label}
          >
            <span className="sidebar-icon">{icon}</span>
            {sidebarOpen && <span className="sidebar-label">{label}</span>}
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Sidebar;