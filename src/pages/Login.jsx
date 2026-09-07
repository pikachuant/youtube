import React from 'react'
import { useAuth } from '../context/Authcontext'
import { useState } from 'react'

function Login() {
 const {setUser}=useAuth()
 const [email,setEmail]=useState("")
 const [password,setPassword]=useState("")
 const [error,setError]
 const loggedIn=async function(){
   setError("")
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

    if(response.ok){
        setUser(data.data.user)
    }
   } catch (error) {
    console.log(error,"Error At Login Time")
   }
 }

  return (
    <div>
        <h1>Login</h1>
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
    </div>
  )
}

export default Login