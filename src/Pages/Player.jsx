import React, { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'


function Player() {
    
    const [comment,setComment]=useState("")
    const [showcomment, setShowComment] = useState({
      comments: [],
      hasMore: false,
      nextCursor: null
    })
    const [error,setError]=useState()
    const location=useLocation()
    const videodata=location.state?.video
    
    const [editCommentId,setEditCommentId]=useState("")
    const [editComment,setEditComment]=useState("")
    const [originalComment, setOriginalComment] = useState("");

    const [hasMore,setHasMore]=useState(null)
    const [cursor,setCursor]=useState(null)
    const [loading,setLoading]=useState(false)

    const [likes,setLikes]=useState({})
    const [isliked,setIsLiked]=useState()

    const videoRef = useRef(null);
    const [isplaying,setisPlaying]=useState(true)

    const [ismute,setIsMute]=useState(true)
    const [volume, setVolume] = useState(0.4);

    const [showSetting,setShowSetting]=useState(false)
    const [showSpeed,setShowSpeed]=useState(false)
    const [playBackSpeed,setPlayBackSpeed]=useState(1)


    const [duration,setDuration]=useState(null)
    const [onTimeChage,setOnTimeChange]=useState()

    const viewCountedRef=useRef(false)

    const[video,setVideo]=useState(videodata)

    const loadmoreRef=useRef(null)
    

   


   const doComment=async function(){
        if (!comment.trim() || loading) {
            return
        }
        try {
            setLoading(true)
            const response=await fetch(`https://antonpklive.online/v1/api/user/user/comment`,
                {
                    method:"POST",
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        comment:comment.trim(),
                        targetId:video._id,
                        targetType:"Video"
                    })
                }
            )
            const data=await response.json()
            if(!data.success){
                setError(data.message)
                return
            }
            const newData={
                ...data.data,
                isEditable: true
            }
            setShowComment(prev=>({
                ...prev,
                comments:[
                    newData,
                    ...prev.comments,
                    
                ]
            }))
            setLoading(false)
            setComment("")
        } catch (error) {
            setError(error.message)
        }
    }

   useEffect(()=>{
     const fetchComment=async function(){
        try {
            const response=await fetch(`https://antonpklive.online/v1/api/user/user/video/comment/${video._id}?sort=latest`,
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            const data=await response.json()
    
            if(!data.success){
                setError(data.message)
                return
            }
            setHasMore(data.data.hasMore)
            setShowComment(data.data)
            setCursor(data.data.nextCursor)
            
        } catch (error) {
            setError(error.message)
        }

        

    } 

    const fecthLikes=async function(){
        try {
            const response=await fetch(`https://antonpklive.online/v1/api/user/user/video/${video._id}/get-alllikes`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        targetType:"Video"
                    })
                }
            )
            const data=await response.json()
            if(!data.success){
                setError(data.message)
            }
            setLikes(data.data)
            if(data.data.isliked==1){
                setIsLiked(true)
            }
        } catch (error) {
            setError(error.message)
        }
    }
    fecthLikes()
    fetchComment()
   },[video?._id])


   const saveEditComment=async function() {
    try {
        if(!editComment.trim() || loading){
            setEditCommentId("")
            return
        }
        if(editComment.trim()===originalComment){
            setEditCommentId("")
            return
        }
        setLoading(true)
        const response=await fetch(`https://antonpklive.online/v1/api/user/user/comment/update`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(
                    {id:editCommentId,
                    comment:editComment.trim()}
                )
                
            }
        )
        const data=await response.json()
        if(!data.success){
            setError(data.message)
            return
        }

        setShowComment(prev=>({
            ...prev,
            comments:prev.comments.map(comment=>
                comment._id==data.data._id
                ?{
                    ...comment,
                    comment:data.data.comment
                }
                :comment
            )
        }))
        setEditCommentId("")
        setEditComment("")
    } catch (error) {
        setError(error.message)
    }finally{
        setLoading(false)
    }
   }

   const deleteComment=async function(deleteCommentId){
    if(loading){
        return
    }
    try {
        setLoading(true)
        const response=await fetch(`https://antonpklive.online/v1/api/user/user/comment/deletecomment`,
            {
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    commentId:deleteCommentId
                })
    
            }
        )
        const data=await response.json()
        if(!data.success){
            setError(data.message)
            return
        }
        setShowComment(prev=>({
            ...prev,
            comments:prev.comments.filter(comment=>comment._id!==deleteCommentId)
        }))
    } catch (error) {
        setError(error.message)
    }finally{
        setLoading(false)
    }

   }

   const likesControl=async function(){
    if(loading){
        return
    }
    if(isliked){
        try {
            setLoading(true)
            const response=await fetch(`https://antonpklive.online/v1/api/user/user/unlike`,
                {
                    method:"DELETE",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        id:video._id,
                        targetType:"Video"
                    })
                }
            )
            const data=await response.json()
            if(!data.success){
                setError(data.message)
            }
            setLikes(prev=>(
            {
                ...prev,
                totalLikes: prev.totalLikes - 1
            }))
            
            setIsLiked(false)
            
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
        return
        

    }
    try {
        if(loading){
            return
        }
        setLoading(true)
        const response=await fetch(`https://antonpklive.online/v1/api/user/user/like`,
            {
                method:"POST",
                credentials:"include",
                headers:{
                   "Content-Type":"application/json"
                },
                body:JSON.stringify({
                id:video._id,
                targetType:"Video"
            })
        })
        const data=await response.json()
        if(!data.success){
        setError(data.message)
        }
        setIsLiked(true)
        setLikes(prev=>(
            {
                ...prev,
                totalLikes: prev.totalLikes + 1
            }
        ))
    } catch (error) {
        setError(error.message)
    }finally{
        setLoading(false)
    }
  }

  const togglePlay=function(){
    if(videoRef.current.paused){
        videoRef.current.play()
        setisPlaying(true)
    }else{
        videoRef.current.pause()
        setisPlaying(false)
    }
  }
  
  const toggleFullscreen=async function(){
    const video=videoRef.current
    
    if(!document.fullscreenElement){
        await video.requestFullscreen()
    }else{
        await document.exitFullscreen()
    }
  }

  const muteControl=async function(){
    const video=videoRef.current
    video.muted=!video.muted
    setIsMute(video.muted);
  }

  const formatTIme=function(time){
    if(!Number.isFinite(time)) return "0:00"

    const minute=Math.floor(time/60)
    const second=Math.floor(time%60)

    return `${minute}:${second.toString().padStart(2, "0")}`;
  }
  
  const addView=async function() {
    try {
        const response=await fetch(`https://antonpklive.online/v1/api/user/addviews`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    _id:video._id
                })
                
            }
        )
        const data=await response.json()
        if(!data.success){
            console.log(data.message)
            return
        }


    } catch (error) {
        console.log(error.message)
    }

  }

  const loadMoreComment=useCallback(async function(){
    if(!hasMore || loading){
        return
    }else{
        try {
            console.log("called");
            setLoading(true)
            const response=await fetch(`https://antonpklive.online/v1/api/user/user/video/comment/${video._id}?cursor=${cursor}`,
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            const data=await response.json()
            console.log(data)
    
            if(!data.success){
                setError(data.message)
                return
            }
            setShowComment(prev=>({
                ...prev,
                ...data.data,
                comments:[
                    ...prev.comments,
                    ...data.data.comments
                ]
            }))
            setHasMore(data.data.hasMore)
            setCursor(data.data.nextCursor)
            setError(false)
        } catch (error) {
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }
  },[hasMore, loading, cursor, video._id])

  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>{
        if(entries[0].isIntersecting){
            loadMoreComment()
        }
    })

    if(loadmoreRef.current){
        observer.observe(loadmoreRef.current)
    }

    return ()=>{
        observer.disconnect()
    }
  },[loadMoreComment])

  const changeSpeed=function(speed){
    videoRef.current.playbackRate = speed;
    setPlayBackSpeed(speed)
    setShowSpeed(false);
  }

  const handleChnage=function(e){
    const time=Number(e.target.value)

    videoRef.current.currentTime=time
    setOnTimeChange(time)
  }


  

  return (
    <div className="player-page">

      {/* ── Video Player ── */}
      <div className="player-wrapper">
        <video
          ref={videoRef}
          src={video?.videoFile}
          poster={video?.thumbnail}
          autoPlay
          muted
          onPlay={() => setisPlaying(true)}
          onPause={() => setisPlaying(false)}
          controlsList="nodownload"
          onClick={togglePlay}
          className="player-video"
          onLoadedMetadata={() => {
            setDuration(videoRef.current.duration)
            const saved = localStorage.getItem('volume')
            const vol = saved !== null ? Number(saved) : 0.4
            videoRef.current.volume = vol
            videoRef.current.muted = false
            setVolume(vol)
            setIsMute(false)
          }}
          onTimeUpdate={() => {
            const currentTime = videoRef.current.currentTime
            setOnTimeChange(currentTime)
            if (currentTime >= 10 && !viewCountedRef.current) {
              viewCountedRef.current = true
              addView()
            }
          }}
        />

        {/* ── Controls Overlay ── */}
        <div className="player-controls-overlay">
          {/* Progress Bar */}
          <div className="player-progress-bar-wrap">
            <div className="player-progress-track">
              <div className="player-progress-fill" style={{ width: `${duration ? (onTimeChage / duration) * 100 : 0}%` }} />
              <input
                className="player-progress-input"
                type="range"
                min="0"
                max={duration || 0}
                value={onTimeChage || 0}
                step={0.1}
                onChange={handleChnage}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="player-controls-row">
            {/* Left */}
            <div className="player-controls-left">
              <button className="player-ctrl-btn" onClick={togglePlay}>
                {isplaying ? '⏸' : '▶'}
              </button>

              <div className="player-volume-arc-wrap">
                <svg className="player-volume-arc-svg" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="14" className="player-volume-arc-track" />
                  <circle
                    cx="20" cy="20" r="14"
                    className="player-volume-arc-fill"
                    style={{ strokeDashoffset: 87.96 * (1 - (ismute ? 0 : volume)) }}
                  />
                </svg>
                <button className="player-ctrl-btn" onClick={muteControl}>
                  {ismute ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
              </div>

              <div className="player-volume-slider-wrap">
                <input
                  className="player-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.025"
                  value={ismute ? 0 : volume}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setVolume(v)
                    setIsMute(v === 0)
                    videoRef.current.volume = v
                    videoRef.current.muted = v === 0
                    localStorage.setItem('volume', v)
                  }}
                />
              </div>

              <span className="player-time">
                {formatTIme(onTimeChage)} / {formatTIme(duration)}
              </span>
            </div>

            {/* Right */}
            <div className="player-controls-right">
              <div className="player-settings-wrap">
                <button className="player-ctrl-btn" onClick={() => setShowSetting(p => !p)}>⚙</button>

                {showSetting && (
                  <div className="player-settings-panel">
                    <button className="player-settings-item" onClick={() => setShowSpeed(p => !p)}>
                      <span>Playback Speed</span>
                      <span className="player-settings-value">{playBackSpeed}x</span>
                    </button>
                  </div>
                )}

                {showSpeed && (
                  <div className="player-speed-panel">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                      <button
                        key={s}
                        className={`player-speed-btn ${playBackSpeed === s ? 'selected' : ''}`}
                        onClick={() => changeSpeed(s)}
                      >
                        {s === 1 ? 'Normal' : `${s}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="player-ctrl-btn" onClick={toggleFullscreen}>⛶</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Meta ── */}
      <div className="player-meta">
        <h1 className="player-title">{video?.titile || video?.title}</h1>

        <div className="player-meta-row">
          <div className="player-meta-stats">
            <span className="player-stat">{video?.views || 0} views</span>
          </div>
          <div className="player-like-wrap">
            <button className={`player-like-icon-btn ${isliked ? 'liked' : ''}`} onClick={likesControl}>
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={isliked ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>
            <span className="player-like-count">{likes?.totalLikes || 0}</span>
          </div>
        </div>

        {video?.description && (
          <div className="player-description">
            <p>{video.description}</p>
          </div>
        )}
      </div>

      {/* ── Comment Section ── */}
      <div className="player-comment-section">
        <div className="player-comment-header">💬 Comments</div>

        {error && <div className="player-error">{error}</div>}

        <div className="player-comment-input-wrap">
          <input
            className="player-comment-input"
            type="text"
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doComment()}
          />
          <button
            className={`player-comment-send-btn ${comment.trim() ? 'active' : ''}`}
            onClick={doComment}
            disabled={!comment.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div className="player-comments-list">
          {showcomment.comments.map((c) => (
            <React.Fragment key={c._id}>
              <div className="player-comment-card">
                <div className="player-comment-avatar">
                  {c.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="player-comment-body">
                  {c.username && <span className="player-comment-username">{c.username}</span>}

                  {editCommentId === c._id ? (
                    <div className="player-comment-edit-form">
                      <textarea
                        className="player-comment-edit-textarea"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                      <div className="player-comment-edit-actions">
                        <button className="player-edit-save-btn" onClick={saveEditComment}>✓ Save</button>
                        <button className="player-edit-cancel-btn" onClick={() => setEditCommentId('')}>✕ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="player-comment-text">{c.comment}</p>
                  )}

                  {c.isEditable && editCommentId !== c._id && (
                    <div className="player-comment-actions">
                      <button
                        className="player-comment-action-btn"
                        onClick={() => { setEditCommentId(c._id); setEditComment(c.comment); setOriginalComment(c.comment) }}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="player-comment-action-btn danger"
                        onClick={() => deleteComment(c._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}

          {hasMore && (
            <div ref={loadmoreRef} className="player-load-more">
              {loading && (
                <div className="player-load-more-spinner">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          )}
          {!hasMore && showcomment.comments.length > 0 && (
            <p className="player-no-more">— No more comments —</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default Player