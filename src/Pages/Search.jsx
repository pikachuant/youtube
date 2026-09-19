import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

function Search() {
  const [youtube,setYoutube]=useState([])
  const [tweet,setTweet]=useState([])
  const [error,setError]=useState(null)
  const location=useLocation()
  const [searchParams]=useSearchParams()

  const query=searchParams.get("q")
  const isYoutube=location.pathname.startsWith("/youtube")
  const isTweet=location.pathname.startsWith("/tweet")


  useEffect(()=>{
    const fecthData=async function() {
        let url
        try {
            if(isYoutube){
                url = `https://antonpklive.online/v1/api/user/video/search/${encodeURIComponent(query)}`;
            }if(isTweet){
                url = `https://antonpklive.online/v1/api/user/tweet/search/${encodeURIComponent(query)}`;
            }

            const response=await fetch(url)
            const data=await response.json()

            if (isTweet) {
                setTweet(data.data)

            }
            if(isYoutube){
                setYoutube(data.data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    fecthData()
  },[query,isYoutube,isTweet])

  


  return (
    <>
    {error && <p className="home-error">{error}</p>}
    {
        isYoutube?(
            youtube.length==0?(
                <p>No Video Found</p>
            ):(
                youtube.map((video)=>(
                    <Link
                    to={`/watch/${video._id}`}
                    key={video._id}>
                        <div>
                        <img
                        src={video.thumbnail}
                        alt={video.title}
                        />
                        <span>{video.duration}</span>
                        </div>

                        <div>
                          <h3>{video.titile}</h3>
                          <p>{video.views ||0} views</p>
                        </div>
                    </Link>
            ))
            )
        ):(
            tweet.length==0?(
                <p>No Tweet Found</p>
            ):(
                tweet.map((item)=>(
                    <div key={item._id}>
                        <h3>{item.content}</h3>
                    </div>
                ))
            )
        )
    }
    </>
  )
}

export default Search