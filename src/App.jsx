import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Tweet from "./Pages/Tweet";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
      <Route path="/youtube" element={<Home />} />

      
      <Route path="/tweet" element={<Tweet />} />
      </Route>
    
    </Routes>
  )
}

export default App
