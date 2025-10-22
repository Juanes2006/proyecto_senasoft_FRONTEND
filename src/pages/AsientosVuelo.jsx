import React, { useState } from "react";
import "./style/AsientosVuelo.css"; 
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";

// Componente de asiento individual
const Asiento = ({ asiento, onClick }) => {
  const getClass = () => {
    switch (asiento.estado) {
      case "libre":
        return "asiento libre";
      case "reservado":
        return "asiento reservado";
      case "ocupado":
        return "asiento ocupado";
      default:
        return "asiento";
    }
  };

  return (
    <button
      className={getClass()}
      onClick={() => asiento.estado !== "ocupado" && onClick(asiento.id)}
    >
      {asiento.id}
    </button>
  );
};

// Componente principal del avión
const Avion = () => {
  const filas = 10; // número de filas
  const asientosPorFila = 6; // 3 a cada lado
  const contadorInicial = 1;

  // Crear la estructura de asientos
  const inicialAsientos = [];
  let contador = contadorInicial;
  for (let i = 0; i < filas; i++) {
    const fila = [];
    for (let j = 0; j < asientosPorFila; j++) {
      fila.push({ id: contador, estado: "libre" });
      contador++;
    }
    inicialAsientos.push(fila);
  }

  const [asientos, setAsientos] = useState(inicialAsientos);

  // Cambiar estado de asiento
  const manejarClick = (id) => {
    setAsientos((prev) =>
      prev.map((fila) =>
        fila.map((a) =>
          a.id === id ? { ...a, estado: a.estado === "libre" ? "reservado" : "libre" } : a
        )
      )
    );
  };

  return (
    <>
    <NavBar showImage={true} showBotones={false}>
     
        <div className="navbar-actions">
          <Link to="/vuelos" className="btn-outline">Volver</Link>
        </div>
      </NavBar>
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
     <div className="navbar-actions">
          <h1>Asientos</h1>
        </div>

        <br /><br />

        <div className="div-asientos">
  <div className="avion-leyenda-container">
    {/* Bloque de asientos */}
    <div className="avion-container">
      {asientos.map((fila, index) => (
        <div key={index} className="fila">
          <div className="bloque">
            {fila.slice(0, 3).map((a) => (
              <Asiento key={a.id} asiento={a} onClick={manejarClick} />
            ))}
          </div>

          <div className="pasillo"></div>

          <div className="bloque">
            {fila.slice(3, 6).map((a) => (
              <Asiento key={a.id} asiento={a} onClick={manejarClick} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Bloque de leyenda */}
    <div className="leyenda-container">
      <div className="leyenda">
        <span className="libre">Libre</span>
        <span className="reservado">Reservado</span>
        <span className="ocupado">Ocupado</span>
      </div>
    </div>
    <div>
          <Link to="/registro-pasajeros" className="btn-outline">Continuar</Link>
      
    </div>
  </div>
</div>

    </>
  );
};

export default Avion;
