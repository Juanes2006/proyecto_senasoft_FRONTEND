import React from "react";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import './style/InicioSesion.css'

export default function InicioSesion() {
  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
        </div>
      </NavBar>

      <Hero showTitle={false} showSearch={false} showImage={true}>
  <div className="login-overlay">
    <div className="login-card">
      <h2>INICIAR SESIÓN</h2>
      <form>
        <input type="email" placeholder="Correo Electrónico" />
        <input type="password" placeholder="Contraseña" />
                <Link to="/mis-viajes" className="btn-outline">Iniciar sesión</Link>
        
      </form>
    </div>
  </div>
</Hero>

    </>
  );
}
