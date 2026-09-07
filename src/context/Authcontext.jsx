import React, { Children, createContext, useContext, useEffect, useState } from 'react'

export function Authenticate() {
  const Authcontext=createContext()
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const checkUser=async function(){
      try {
        const response=await fetch("https://antonpklive.online/v1/api/user/getuser",
          {
            method:"POST",
            credentials:"true"
          }
        )
        const data=await response.json()

        if(response.ok){
          setUser(data.data)
        }else{
          setUser(null)
        }
      } catch (error) {
        console.log(error,"Error Found at fteching in Current Details")
      }finally{
        setLoading(false)
      }
    }

    checkUser()
  },[])



  return (
    <Authcontext.Provider
      value={{
       user,
       setUser,
       loading
      }}
    >
      {children}
    </Authcontext.Provider>
  )
}

export function useAuth(){
  return useContext(Authcontext)
}