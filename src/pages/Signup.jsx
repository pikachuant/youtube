import React from 'react'
import { useState } from 'react'
import { useAuth } from "../context/Authcontext";

function Signup() {
  const {setUser}=useAuth()
  const [fullname,setFullname]=useState("")
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")

  const [avatar,setAvatar]=useState("")
  const [coverImage,setcoverImage]=useState("")

  return (
    <>
    <h1>Signup</h1>
    <input
    type='text'
    placeholder='Full Name'
    required={true}
    onChange={(e)=>setFullname(e.target.value)}
    value={fullname}
    />

    <input
    type='text'
    placeholder='Username'
    required={true}
    onChange={(e)=>setUsername(e.target.value)}
    value={username}
    />

    <input
    type='email'
    placeholder='Email'
    required={true}
    onChange={(e)=>setEmail(e.target.value)}
    value={email}
    />
    <input
    type='password'
    placeholder='Password'
    required={true}
    onChange={(e)=>setPassword(e.target.value)}
    value={password}
    />

    
    </>
  )
}

export default Signup