import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/Authcontext.jsx";
import streamtalk from "../picture/streamtalk.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Navbar({ sidebarOpen, setopenSidebar }) {
  const navigate=useNavigate()
  const location=useLocation()
  const { user, loading } = useAuth();
  const [search,setSearch]=useState("")

  const searchButton=function(){
    if(!search.trim()){
      return
    }
    if(location.pathname=='/tweet'){
      navigate(`/tweet/search?q=${encodeURIComponent(search.trim())}`)
    }
    if(location.pathname=="/youtube"){
      navigate(`/youtube/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <nav className="navbar">
       <button className="navbar-hamburger" onClick={() => setopenSidebar(!sidebarOpen)}>
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
          onChange={(e)=>setSearch(e.target.value)}
        />

        <button
        onClick={searchButton}
        >Search</button>
      </div>
      
      {
        user?(
          <div className="navbar-user" key={user._id}>
            <img src={user.avatar} alt={user.fullName}/>
            <p>{user.fullName}</p>
          </div>
        ):(
          <Link className="navbar-login-link" to="/login" >Login/Signup</Link>
        )
      }
      
    </nav>
  );
}

export default Navbar;