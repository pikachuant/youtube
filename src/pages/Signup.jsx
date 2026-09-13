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
        setUser(data.data)
      }else{
        setError(data.message)
        
      }
    } catch (error) {
      setError("Something went wrong")
    }
  }


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

    <label>
      {avatar?avatar.name:"Choose to Upload Proffile picture"}
      <input
      type='file'
      accept='image/*'
      onChange={handleAvatarImage}
      hidden
    />
    </label>
    

    <label>
      {coverImage?coverImage.name:"Choose to Upload Cover picture"}
      <input
      type='file'
      accept='image/*'
      onChange={handleCoverImage}
      hidden
    />
    </label>
    
    <button
    onClick={handleSubmit}
    >
      SignUp
    </button>

    <p>
      {error}
    </p>


    </>
  )
}

export default Signup