import React, { useState } from "react";

function Navbar() {
  const [search,setSearch]=useState("")

  const searchButton=async function(){
    if(!serach.trim()){
      return
    }

    try {
      const response=await fetch(`https://antonpklive.online/v1/api/user/search/${encodeURIComponent(search)}`)
      const data=await response.json()
    } catch (error) {
      console.log(error,"Error at fecthed into videos")
    }
  }

  return (
    <nav>
      <div>
        <img src="./picture/picture.png" alt="Tweet Logo" />
        <h1>Tweet</h1>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={serach}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <button
        onClick={}
        >Search</button>
      </div>

      {/* Right Side */}
      <div>
        <button>Create</button>
        <button>Login / Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;