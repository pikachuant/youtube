import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'


function Player() {
    const [comment,setComment]=useState("")
    const [showcomment,setShowComment]=useState([])
    const [error,setError]=useState()
    const location=useLocation()
    const video=location.state?.video

    const [editCommentId,setEditCommentId]=useState("")
    const [editComment,setEditComment]=useState("")

    const [likes,setLikes]=useState({})
    const [isliked,setIsLiked]=useState()

    


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
            setError(error)
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
            setError(error)
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
            setError(error)
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
        setError(error)
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
    } catch (error) {
        setError(error.message)
    }
  }


  
  return (
    <>
    <div className="player">
        <video
        src={video?.videoFile}
        poster={video?.thumbnail}
        />

        <div className='player-control'>
            <button>▶</button>
            <button>🔊</button>

            <span>
              0:00 / 0:00
            </span>
        </div>

        <div className="controls-right">
            <button>⚙</button>
            <button>⛶</button>
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