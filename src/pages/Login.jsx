import React from 'react'
import { useAuth } from '../context/Authcontext'
import { useState } from 'react'
import { Link } from "react-router-dom";


function Login() {
 const {setUser}=useAuth()
 const [email,setEmail]=useState("")
 const [password,setPassword]=useState("")
 const [error,setError]=useState("")

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
             "content-Type":"application/json"
          },
          body:JSON.stringify({
             email,
             password
          })
       }
     )
    const data=await response.json()

    if(!response.ok){
        setError("Email or Password is Incorrect")
        return
    }

    setUser(data.data.user)
    


   } catch (error) {
    console.log(error,"Error At Login Time")
   }
 }

  return (
    <div>
        <h1>Login</h1>
        {error && <p>{error}</p>}
        <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        />
        <input
        type='password'
        placeholder='Password'
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        />
        <button
        onClick={loggedIn}
        >Login</button>

        <p>
            Don't have an Account?
            <Link to="/signup">
                Register
            </Link>

        </p>
    </div>
  )
}

export default Login