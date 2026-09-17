import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./Pages/Home";
import Tweet from "./Pages/Tweet";

function App() {
  return (
    <>
    <Navbar />
    <Sidebar />
    <Routes>
      <Route
      path="/youtube"
      element={<Home />}
      />

      <Route
      path="/tweet"
      element={<Tweet />}
      />
    </Routes>
    </>
  )
}

export default App
