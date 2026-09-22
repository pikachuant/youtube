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
            console.log(data)
            if(data.success){
                setVideo(data.data)
            }else{
                setError("failed Fetech Video Details")
                return
            }
        } catch (error) {
            setError(error.message)
        }
       }

     checkVideo()

    },[])

    function timeAgo(createdAt){
        const differnce=new Date()-new Date(createdAt)

        const minutes=Math.floor(differnce/(1000*60))
        const hours=Math.floor(minutes/60)
        const days=Math.floor(hours/24)   

        if(days>0){return `${days} days ago`}
        if(hours>0){return `${hours} hours ago`}
        return `${minutes} minutes ago`
    }
  
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
                    <img 
                    src={item.owner.avatar}
                    />
                    <h3>{item.titile}</h3>
                    <p>{item.owner.username}</p>
                    <p>{item.views ||0} views</p>
                    <p>{timeAgo(item.createdAt)}</p>
                </div>
            </Link>
        ))}
    </div>
    </>
  )
}

export default Home