import React, { useEffect, useState } from 'react'

function Home() {
    const [tweet,setTweet]=useState([])
    const [error,setError]=useState("")
    useEffect(()=>{
       const checkTweet=async function() {
        try {
            const response=await fetch(
                "https://antonpklive.online/v1/api/user/user/tweet/all-tweet",
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            const data=await response.json()
            if(data.success){
                setTweet(data.data.Editable)
            }else{
                setError("failed Fetech Tweet Details")
                return
            }
        } catch (error) {
            setError(error)
        }
       }
       
     checkTweet()
    },[])
  
  return (
    <>
    {error && <p>{error}</p>}
    <div>
        {tweet.map()}
    </div>
    </>
  )
}

export default Home