import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

function Home() {
    const [video,setVideo]=useState([])
    const [error,setError]=useState("")
    useEffect(()=>{
       const checkVideo=async function() {
        try {
            const response=await fetch(
                "https://antonpklive.online/v1/api/user/get-feed-videos",
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            const data=await response.json()
            if(data.success){
                setVideo(data.data)
            }else{
                setError("failed Fetech Video Details")
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