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
    {error && <p className="home-error">{error}</p>}
    <div className="video-grid">
        {video.map((item)=>(
            <Link 
            className="video-card"
            to={`/watch/${item._id}`}
            state={{ video: item }}
            key={item._id}
            >
                <div className="video-thumbnail-wrapper">
                  <img
                  src={item.thumbnail}
                  alt={item.titile}
                  />
                  <span className="video-duration">{item.duration}</span>
                </div>

                <div className="video-info">
                    <h3>{item.titile}</h3>
                    <p>{item.views ||0} views</p>
                </div>
            </Link>
        ))}
    </div>
    </>
  )
}

export default Home