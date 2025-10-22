import React from "react";
import "./style/Vuelos.css";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Vuelos() {
  const navigate = useNavigate();

  const vuelos = [
    {
      origen: "PEREIRA, PEI",
      destino: "MÉXICO, MCO",
      horaSalida: "10:45 pm",
      horaLlegada: "1:40 pm",
      duracion: "13 h 55 min",
      aerolinea: "Celestis Air",
      precio: "2.950.000",
      recomendado: true,
      masRapido: true,
    },
    {
      origen: "PEREIRA, PEI",
      destino: "MÉXICO, MCO",
      horaSalida: "6:50 pm",
      horaLlegada: "1:40 pm",
      duracion: "17 h 50 min",
      aerolinea: "Celestis Air",
      precio: "1.890.000",
      recomendado: true,
      masRapido: false,
    },
  ];

  const handleCardClick = () => {
    navigate("/asientos-vuelo");
  };

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
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
          <strong>1</strong>
        </div>
      </div>

      <div className="lista-vuelos">
        {vuelos.map((vuelo, index) => (
          <div
            key={index}
            className="vuelo-card"
            onClick={handleCardClick}
            style={{ cursor: "pointer" }} // Indica que es clickeable
          >
            {/* Etiquetas superiores */}
            <div className="vuelo-header">
              {vuelo.recomendado && <span className="tag tag-recomendado">Recomendado</span>}
              {vuelo.masRapido && <span className="tag tag-rapido">Más rápido</span>}
            </div>

            {/* Cuerpo principal */}
            <div className="vuelo-body">
              <div className="vuelo-hora">
                <h2>{vuelo.horaSalida}</h2>
                <span>{vuelo.origen}</span>
              </div>

              <div className="vuelo-duracion">
                <div className="linea"></div>
                <p>Duración</p>
                <strong>{vuelo.duracion}</strong>
                <p></p>
              </div>

              <div className="vuelo-hora">
                <h2>{vuelo.horaLlegada}</h2>
                <span>{vuelo.destino}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="vuelo-footer">
              <p>Operado por <strong>{vuelo.aerolinea}</strong></p>
              <div className="precio-section">
                <span className="precio-label">Desde</span>
                <span className="precio-valor">${vuelo.precio}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
