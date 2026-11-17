import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Tweet from "./Pages/Tweet";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Layout/Layout";
import Search from "./Pages/Search";
import Player from "./Pages/Player";
import Upload from "./Pages/Upload";
import CreateTweet from "./Pages/CreateTweet";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>


      <Route path="/youtube" element={<Home />} />
      <Route path="/youtube/search" element={<Search />} />
      
      <Route path="/tweet" element={<Tweet />} />
      <Route path="/tweet/search" element={<Search />} />

      <Route path="/watch/:videoId" element={<Player />} />

      <Route path="/youtube/upload" element={<Upload />} />
      <Route path="/tweet/create" element={<CreateTweet />} />
      
      </Route>
    
    </Routes>
  )
}

export default App
