import React from "react";
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import { Link } from "react-router-dom";

export default function InicioSesion() {
  return (
    <>
    <NavBar showImage={true} showBotones={false}>
      <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
        </div>

    </NavBar>

    <Hero showTitle = {false} showSearch = {false} showImage = {true} >
       
    </Hero>
    
    
   
    </>
  );
}
