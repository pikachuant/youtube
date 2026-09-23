import React from 'react'
import { useState } from 'react'
import { useAuth } from "../Context/Authcontext.jsx";
import { useLocation, useNavigate } from 'react-router-dom';

function Signup() {
  const location=useLocation()
  const navigate=useNavigate()
  const {setUser}=useAuth()
  const [fullname,setFullname]=useState("")
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")

  const [avatar,setAvatar]=useState("")
  const [coverImage,setcoverImage]=useState("")


  const from=location.state?.from
  const handleAvatarImage=(e)=>{
    const file=e.target.files[0]
    if(file){
      setAvatar(file)
    }
  }

  const handleCoverImage=(e)=>{
    const file=e.target.files[0]
    if(file){
      setcoverImage(file)
    }
  }

  const handleSubmit=async function(){
    if (!fullname || !username || !email || !password || !avatar) {
      setError("User Must Fill All Mandatory Details to Signup")
      return
    }
    try {
      const formData = new FormData()

      formData.append("fullName", fullname)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("avatar", avatar)

      if(coverImage){
        formData.append("coverImage",coverImage)
      }

      const response=await fetch(
        "https://antonpklive.online/v1/api/user/register",
        {
          method:"POST",
          body:formData,
          credentials:"include"
        }
      )

      const data=await response.json()

      if(data.success){
        console.log("registrayion is Complete")
        setUser(data.data.user)
        navigate(from,{replace:true})
      }else{
        setError(data.message)
        
      }
    } catch (error) {
      setError("Something went wrong")
    }
  }


  return (
    <div className="auth-page">
    <div className="auth-card">
    <h1 className="auth-title">Signup</h1>
    <input
    className="auth-input"
    type='text'
    placeholder='Full Name'
    required={true}
    onChange={(e)=>setFullname(e.target.value)}
    value={fullname}
    />

    <input
    className="auth-input"
    type='text'
    placeholder='Username'
    required={true}
    onChange={(e)=>setUsername(e.target.value)}
    value={username}
    />

    <input
    className="auth-input"
    type='email'
    placeholder='Email'
    required={true}
    onChange={(e)=>setEmail(e.target.value)}
    value={email}
    />
    <input
    className="auth-input"
    type='password'
    placeholder='Password'
    required={true}
    onChange={(e)=>setPassword(e.target.value)}
    value={password}
    />

    <label className={`auth-file-label${avatar ? ' has-file' : ''}`}>
      {avatar?avatar.name:"📷 Choose Profile Picture"}
      <input
      type='file'
      accept='image/*'
      onChange={handleAvatarImage}
      hidden
    />
    </label>
    

    <label className={`auth-file-label${coverImage ? ' has-file' : ''}`}>
      {coverImage?coverImage.name:"🖼️ Choose Cover Image (optional)"}
      <input
      type='file'
      accept='image/*'
      onChange={handleCoverImage}
      hidden
    />
    </label>
    
    <button
    className="auth-btn"
    onClick={handleSubmit}
    >
      SignUp
    </button>

    {error && <p className="auth-error">
      {error}
    </p>}

    </div>
    </div>
  )
}

export default Signup