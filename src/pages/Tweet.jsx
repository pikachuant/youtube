import React, { useCallback, useEffect, useState } from 'react'

function Home() {
    const [tweet,setTweet]=useState(null)
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(null);
    const [error,setError]=useState("")
    const [editingTweetId,setEditingTweetId]=useState("")
    const [editingTweetContent,setEditingTweetContent]=useState("")
     
    const fetchTweet=useCallback(async function(){
        if(!hasMore){
            return
        }
        else{
            try {
                let url="https://antonpklive.online/v1/api/user/user/tweet/all-tweet"
                if (cursor){
                    url+=`?cursor=${cursor}`
                }
    
                const response=await fetch(
                    url,
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
    
                setTweet(...prev,
                    ...data.data.Editable
                )
    
                setCursor(data.data.cursor);
                setHasMore(data.data.hasMore);
            } catch (error) {
                setError(error.message)
            }

        }
    },[hasMore,cursor])

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
                setCursor(data.data.cursor)
                setHasMore(data.data.hasMore)
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
    
    const EditTweet=async function(){
        try {
            const response=await fetch(
                `https://antonpklive.online/v1/api/user/${editingTweetId}/edit-tweet`,
                {
                    method:'POST',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    credentials:"include",
                    body:JSON.stringify({
                        content:editingTweetContent
                    })
                }
            )
            const data=await response.json()
    
            if(data.success){
                setTweet(prev=>
                    prev.map(t=>{
                        t._id==editingTweetId?
                        {
                            ...t,
                            content:data.data.content
                            //inside a object literal 
                        }
                        :t
                    })
                )
                setEditingTweetId(null);
                setEditContent("");
            }else{
                setError(data.message)
            }
    
    
        } catch (error) {
            setError(error.message)
        }
    }
   
  

  return (
    <>
     {error && <p>{error}</p>}
     <div>
         {tweet.map((tweets)=>(
            <div id={tweets._id}>
               <h3>{tweets.content}</h3>
                {
                  tweets.isEditable &&(
                       <button onClick={()=>{
                          setEditingTweetId(tweets._id)
                          setEditingTweetContent(tweets.content)
                         }
                        }>
                        Edit
                       </button>
                    )
                }

                {
                    editingTweetId==tweets._id &&(
                        <div>
                            <textarea
                            value={editingTweetContent}
                            onChange={(e)=setEditingTweetContent(e.target.value)}
                            />
                            <button
                            onClick={EditTweet}
                            >Save</button>

                        </div>
                    )
                }

                {
                    hasMore &&(
                        <div ref={loadMoreRef}></div>
                    )
                }

                {
                    !hasMore &&(
                        <p>No More Tweets</p>
                    )
                }
            </div>
         ))}
      </div>
    </>
  )
}

export default Home