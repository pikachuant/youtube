import React, { useEffect, useState } from 'react'

function Home() {
    const [tweet,setTweet]=useState([])
    const [error,setError]=useState("")
    useEffect(()=>{
       const checkVideo=async function() {
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
       
     checkVideo()
    },[])
  
  return (
    <>
    <div>
        {video.map((item)=>(
            <Link 
            to={`/watch/${item._id}`}
            key={item._id}
            >
                <img
                src={item.thumbnail}
                alt={item.titile}
                />
                <span>{item.duration}</span>

                <div>
                    <h3>{item.titile}</h3>
                    <p>{item.views ||0}views</p>
                </div>
            </Link>
        ))}
    </div>
    </>
  )
}

export default Home