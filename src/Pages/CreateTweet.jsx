import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTweet() {
  const [tweet, setTweet] = useState("");
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)

  const navigate=useNavigate()

  const tweetHandler=async function () {
    if(loading) return
    if(!tweet.trim()){
        setError("Please Enter Some Tweet to Do Tweet")
        return
    }
    setError("")
    try {
        setLoading(true)
        console.log("Now")
        const response=await fetch("https://antonpklive.online/v1/api/user/user/tweet/create-tweet",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                content:tweet
            })
        })
        const data=await response.json()
        if(!response.ok){
            setError(data.message)
        }
        navigate('/tweet')
    } catch (error) {
        setError(error.message)
    }finally{
        setLoading(false)
    }

  }

  return (
    <>
      <input
        type="text"
        placeholder="Enter Tweet Context Here"
        onChange={(e) => setTweet(e.target.value)}
        value={tweet}
      />
      <button onClick={tweetHandler}>Tweet</button>
      {error && <p>{error}</p>}
    </>
  );
}

export default CreateTweet;
