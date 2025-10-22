import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "./style/RegistroViajeros.css";

export default function RegistroViajeros() {
  const [open, setOpen] = useState(false); // Controla si se despliega

  const toggleForm = () => {
    setOpen(!open);
  };

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/asientos-vuelo" className="btn-outline">Volver</Link>
        </div>
      </NavBar>

      {/* Barra de información del vuelo */}
      <div className="barra-vuelo">
        <div className="item-vuelo">
          <span className="icon">✈️</span>
          <strong>Pereira</strong>
          <span className="icon">✈️</span>
          <strong>Mexico</strong>
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">📅</span>
          <strong>jue, 13 de nov</strong>
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">👤</span>
          <strong>1 pasajero</strong>
        </div>
      </div>

      {/* Título */}
      <div className="registro-title">
        <h1>Registro Pasajeros</h1>
      </div>

      {/* Formulario desplegable */}
      <div className="registro-card">
        <button className="btn-toggle" onClick={toggleForm}>
          {open ? "Ocultar Persona 1" : "Persona 1"}
        </button>

        {open && (
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
              <select>
                <option value="">Condición de Infante</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            <button type="submit" className="btn-outline btn-submit">
              Validar datos
            </button>
          </form>
        )}
      </div>

      {/* Botón continuar */}
      <div className="continuar-container">
        <Link to="/pay-celestis" className="btn-outline btn-continuar">Continuar</Link>
      </div>
    </>
  );
}
