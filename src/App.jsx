import { Outlet } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./sections/Home";
import { useState } from "react";

function App() {
  const [favorites, setFavorites] = useState([]);
  return (
    <>
      <Nav favorites={favorites}/>
      <Outlet/>
      
    </>
  );
}

export default App;