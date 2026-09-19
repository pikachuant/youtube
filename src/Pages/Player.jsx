import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'


function Player() {
    const[video,setVideo]=useState({})
    const [comment,setComment]=useState("")
    const [showcomment,setShowComment]=useState([])
    const [error,setError]=useState()
    const location=useLocation()
    const videodata=location.state?.video
    
    const [editCommentId,setEditCommentId]=useState("")
    const [editComment,setEditComment]=useState("")
    const [originalComment, setOriginalComment] = useState("");

    const [likes,setLikes]=useState({})
    const [isliked,setIsLiked]=useState()

    const videoRef = useRef(null);
    const [isplaying,setisPlaying]=useState(true)

    const[ismute,setIsMute]=useState(true)
    const [volume, setVolume] = useState(0.4);

    const [duration,setDuration]=useState(null)
    const[onTimeChage,setOnTimeChange]=useState(null)

    const viewCountedRef=useRef(false)

    
   useEffect(()=>{
    if(videodata){
        setVideo(videodata)
    }
   },[videodata])

   const doComment=async function(){
        if (!comment.trim()) {
            return
        }
        try {
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
            setShowComment(prev=>[
                newData,
                ...prev
            ])
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
            setShowComment(data.data.comments)
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
        if(!editComment.trim()){
            setEditCommentId("")
            return
        }
        if(editComment.trim()===originalComment){
            setEditCommentId("")
            return
        }
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
        setShowComment(prev=>
            prev.map(comment=>(
                comment._id===editCommentId?{
                    ...comment,
                    comment:editComment.trim()
                }:comment
            ))
        )
        setEditCommentId("")
        setEditComment("")
        


    } catch (error) {
        setError(error.message)
    }
   }

   const deleteComment=async function(deleteCommentId){
    try {
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
        setShowComment(prev=>
            prev.filter(comment=>comment._id!==deleteCommentId)
        )
    } catch (error) {
        setError(error.message)
    }

   }

   const likesControl=async function(){
    if(isliked){
        try {
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
            setIsLiked(false)
            setLikes(prev=>(
            {
                ...prev,
                totalLikes: prev.totalLikes - 1
            }
        ))
        } catch (error) {
            setError(error.message)
        }
        return

    }
    try {
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
        setVideo(prev=>({
            ...prev,
            views:prev.views+1
        }))

    } catch (error) {
        console.log(error.message)
    }

  }


  
  return (
    <>
    <div className="player">
        <video
        ref={videoRef}
        src={video?.videoFile}
        poster={video?.thumbnail}
        autoPlay
        muted
        onPlay={() => setisPlaying(true)}
        onPause={() => setisPlaying(false)}
        controlsList="nodownload"

        onLoadedMetadata={()=>{
            setDuration(videoRef.current.duration)
        }}

        onTimeUpdate={()=>{
            const currentTime=videoRef.current.currentTime
            setOnTimeChange(currentTime)

            if(currentTime>=10 && !viewCountedRef.current){
                viewCountedRef.current = true;
                addView()
            }
        }}
        />

        <div className='player-control'>
            <button onClick={togglePlay}>
              {isplaying ? "⏸" : "▶"}
            </button>

            <span>
              {formatTIme(onTimeChage)} / {formatTIme(duration)}
            </span>

            <button
            onClick={muteControl}
            >{
                ismute?(
                    <p>"🔇"</p>
                ):(<p>"🔊"</p>)
            }</button>

            <input
            type='range'
            min="0"
            max="1"
            step="0.025"
            value={ismute?0:volume}
            onChange={(e)=>{
                const newVolume=Number(e.target.value)
                setVolume(newVolume)
                setIsMute(newVolume === 0);

                videoRef.current.volume=newVolume
                videoRef.current.muted=newVolume===0
            }}
            />
        </div>

        <div className="controls-right">
            <button>⚙</button>

            <button
            onClick={toggleFullscreen}
            >⛶</button>
        </div>
    </div>

    <div className='video-info'>
        <h1>{video?.titile}</h1>
        <p>
          {video?.views || 0} views
        </p>
        <p>
          {likes?.totalLikes || 0} Likes
        </p>
        {
            isliked?(
                <button
                onClick={likesControl}
                >
                    Liked
                </button>
            ):(
                <button
                onClick={likesControl}
                >
                    Not-Liked
                </button>
            )
        }
        <p>
          {video?.description}
        </p>
    </div>

    <div className='do-comment'>
        <input
        type='string'
        placeholder="Enter Your Comment To Post"
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
        />
        <button onClick={doComment}>Send</button>
    </div>

    <div className="show-comment">
    {error && (
    <p className="text-red-500">
        {error}
    </p>
)}
    {showcomment.map((comment) => (
        <React.Fragment key={comment._id}>

            <div>
                <p>{comment.comment}</p>

                {comment.isEditable && (
                    <>
                    <button
                        onClick={() => {
                            setEditCommentId(comment._id);
                            setEditComment(comment.comment);
                            setOriginalComment(comment.comment)
                        }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={()=>{
                            deleteComment(comment._id);
                        }}
                    >
                        Delete
                    </button>
                    </>
                )}
            </div>

            {editCommentId === comment._id && (
                <div>
                    <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                    />

                    <button onClick={saveEditComment}>
                        Save
                    </button>
                </div>
            )}

        </React.Fragment>
      ))}
    </div>

    
    
    </>
  )
}

export default Player