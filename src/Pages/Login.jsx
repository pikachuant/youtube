import React from 'react'
import { useAuth } from '../Context/Authcontext.jsx'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";


function Login() {
 const navigate=useNavigate()
 const {setUser}=useAuth()
 const [email,setEmail]=useState("")
 const [password,setPassword]=useState("")
 const [error,setError]=useState("")
 const location=useLocation()

 const from=location.state?.from || "/youtube"

 console.log(from)

 const loggedIn=async function(){
   setError("")
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
   if(!email || !password ){
    setError("Please Fill email and password For login")
    return
   }

   if(!emailRegex.test(email)){
    setError("Please Give us a valid email")
    return
   }

   try {
    const response=await fetch(`https://antonpklive.online/v1/api/user/login`,
       {
          method:"POST",
          credentials: "include",
          headers:{
             "Content-Type":"application/json"
          },
          body:JSON.stringify({
             email,
             password
          })
       }
     )
    const data=await response.json()
    console.log("LOGIN RESPONSE:", data);

    if(!response.ok){
        setError("Email or Password is Incorrect")
        return
    }
    setUser(data.data.user)
    navigate(from,{replace:true});
   } catch (error) {
    console.log(error,"Error At Login Time")
   }
 }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <input
        className="auth-input"
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        />
        <input
        className="auth-input"
        type='password'
        placeholder='Password'
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        />
        <button
        className="auth-btn"
        onClick={loggedIn}
        >Login</button>

        <p className="auth-footer">
            Don't have an Account?
            <Link to="/signup"
            state={{
              from
            }}
            >
                Register
            </Link>
        </p>
      </div>
    </div>
  )
}

export default Login