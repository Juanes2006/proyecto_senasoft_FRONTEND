import React from "react";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import './style/registro.css'

export default function Registro() {
  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
        </div>
      </NavBar>

      <Hero showTitle={false} showSearch={false} showImage={true}>
  <div className="registro-overlay">
      <div className="registro-card">
        <h2>REGÍSTRATE</h2>

        <form className="registro-form">
          <div className="form-grid">
            <input type="text" placeholder="Primer Apellido" />
            <input type="text" placeholder="Segundo Apellido" />

            <input type="text" placeholder="Nombres" />
            <input type="date" placeholder="Fecha de Nacimiento" />

            <select>
              <option value="">Tipo de documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>

            <input type="text" placeholder="Número de documento" />

            <select>
              <option value="">Género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>

            <input type="text" placeholder="Número de celular" />

            <input type="email" placeholder="Correo Electrónico" />
            <input type="password" placeholder="Contraseña" />
          </div>

          <button type="submit" className="btn-register">
            Registrarse
          </button>
        </form>
      </div>
    </div>
</Hero>

    </>
  );
}
