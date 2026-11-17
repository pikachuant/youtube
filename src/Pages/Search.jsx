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
    <div className="search-page">
      {error && <p className="home-error">{error}</p>}
      {
        isYoutube ? (
          youtube.length === 0 ? (
            <div className="search-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <p>No videos found</p>
            </div>
          ) : (
            <div className="search-results-list">
              {youtube.map((video) => (
                <a
                  className="search-result-card"
                  href={`/watch/${video._id}`}
                  key={video._id}
                >
                  <div className="search-thumb-wrap">
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="search-result-info">
                    <h3 className="search-result-title">{video.titile}</h3>
                    <p className="search-result-views">{video.views || 0} views</p>
                  </div>
                </a>
              ))}
            </div>
          )
        ) : (
          tweet.length === 0 ? (
            <div className="search-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <p>No tweets found</p>
            </div>
          ) : (
            <div className="search-tweet-list">
              {tweet.map((item) => (
                <div className="search-tweet-card" key={item._id}>
                  <h3>{item.content}</h3>
                </div>
              ))}
            </div>
          )
        )
      }
    </div>
  )
}

export default Search