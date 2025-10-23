import React from "react";
import "./style/Vuelos.css";
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";


export default function MisViajes() {

  const vuelos = [
    {
      origen: "PEREIRA, PEI",
      destino: "MÉXICO, MCO",
      horaSalida: "10:45 pm",
      horaLlegada: "1:40 pm",
      duracion: "13 h 55 min",
      aerolinea: "Celestis Air",
      fecha: "12/10/2024"
        
    },
    {
      origen: "PEREIRA, PEI",
      destino: "MÉXICO, MCO",
      horaSalida: "6:50 pm",
      horaLlegada: "1:40 pm",
      duracion: "17 h 50 min",
      aerolinea: "Celestis Air",
      fecha: "01/02/2024"
    },
  ];

 

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        
        <div className="navbar-actions">
          <Link to="/inicio-sesion" className="btn-outline">Cerrar Sesion</Link>
        </div>
      </NavBar>

      {/* Barra de información del vuelo */}
      <div className="barra-vuelo">
      <h1>Mis Viajes</h1>
      </div>

      <div className="lista-vuelos">
        {vuelos.map((vuelo, index) => (
          <div
            key={index}
            className="vuelo-card"
            style={{ cursor: "pointer" }} // Indica que es clickeable
          >
            
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
                              <p>Fecha <strong>{vuelo.fecha}</strong></p>

              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
