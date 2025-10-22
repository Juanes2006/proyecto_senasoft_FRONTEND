import React from "react";
import "./style/Navbar.css";
import { Link } from "react-router-dom";

import celestisAir from "../assets/logo/celestis2.png"

export default function Navbar({ showImage = true, showBotones = true, children}) {
  return (
    <nav className="navbar">

      {showImage && (
      <div className="logo">
       <img src={celestisAir} alt="logo" />
      </div>
      )}


    

       {showBotones && (
                  
                
      <div className="navbar-actions">
        <Link to="/registro" className="btn-outline">Regístrate</Link>
        <Link to="/inicio-sesion" className="btn-primary">Iniciar sesión</Link>
      </div>

      )}

            
            
      {children && <div className="navbar-extra">{children}</div>}
    </nav>
  );
}
