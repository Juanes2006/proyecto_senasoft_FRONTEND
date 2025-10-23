import React, { useEffect, useState } from "react";
import "./style/Vuelos.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/Navbar";

export default function Vuelos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el flujo de ida y vuelta
  const [pasoActual, setPasoActual] = useState("ida");
  const [vueloIdaSeleccionado, setVueloIdaSeleccionado] = useState(null);

  // ✅ Validar diferencia de fechas (máximo 2 meses)
  const validarFechas = (fechaIda, fechaVuelta) => {
    if (!fechaIda || !fechaVuelta) return true;
    
    const fecha1 = new Date(fechaIda);
    const fecha2 = new Date(fechaVuelta);
    
    // Calcular fecha máxima (2 meses después)
    const fechaMaxima = new Date(fecha1);
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 2);
    
    if (fecha2 > fechaMaxima) {
      const mesesDif = Math.floor((fecha2 - fecha1) / (1000 * 60 * 60 * 24 * 30));
      return `La fecha de vuelta no puede ser mayor a 2 meses después de la fecha de ida. Diferencia: ${mesesDif} meses.`;
    }
    
    return true;
  };

  const simularFetchVuelos = (origen, destino, tipo, direccion = "ida") => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!origen || !destino) {
          return reject(new Error("Parámetros de búsqueda incompletos."));
        }
        
        if (origen === destino) {
          return reject(new Error("El origen y el destino no pueden ser iguales."));
        }

        let vuelos = [];

        if (direccion === "ida") {
          vuelos = [
            {
              id: "ida-1",
              origen: origen,
              destino: destino,
              horaSalida: "10:45 pm",
              horaLlegada: "1:40 pm",
              duracion: "13 h 55 min",
              aerolinea: "Celestis Air",
              precio: "2.950.000",
              recomendado: true,
              masRapido: true,
            },
            {
              id: "ida-2",
              origen: origen,
              destino: destino,
              horaSalida: "6:50 pm",
              horaLlegada: "1:40 pm",
              duracion: "17 h 50 min",
              aerolinea: "Celestis Air",
              precio: "1.890.000",
              recomendado: true,
              masRapido: false,
            },
          ];
        } else {
          // Vuelos de vuelta
          vuelos = [
            {
              id: "vuelta-1",
              origen: destino,
              destino: origen,
              horaSalida: "3:20 pm",
              horaLlegada: "9:10 pm",
              duracion: "6 h 50 min",
              aerolinea: "Celestis Air",
              precio: "3.200.000",
              recomendado: true,
              masRapido: true,
            },
            {
              id: "vuelta-2",
              origen: destino,
              destino: origen,
              horaSalida: "5:30 pm",
              horaLlegada: "11:45 pm",
              duracion: "7 h 15 min",
              aerolinea: "Celestis Air",
              precio: "2.800.000",
              recomendado: false,
              masRapido: false,
            },
          ];
        }

        resolve(vuelos);
      }, 1200);
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const origen = params.get("origen") || "";
    const destino = params.get("destino") || "";
    const fechaIda = params.get("fechaIda") || "";
    const fechaVuelta = params.get("fechaVuelta") || "";
    const tipo = params.get("tipo") || "ida";

    // ✅ Validar fechas si es ida-vuelta
    if (tipo === "ida-vuelta" && fechaIda && fechaVuelta) {
      const validacion = validarFechas(fechaIda, fechaVuelta);
      if (validacion !== true) {
        setError(validacion);
        setVuelos([]);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    const direccion = pasoActual === "ida" ? "ida" : "vuelta";
    simularFetchVuelos(origen, destino, tipo, direccion)
      .then(setVuelos)
      .catch((err) => {
        setError(err.message);
        setVuelos([]);
      })
      .finally(() => setLoading(false));
  }, [location.search, pasoActual]); // ✅ Solo las dependencias necesarias

  const handleCardClick = (vuelo) => {
  const params = new URLSearchParams(location.search);
  const tipo = params.get("tipo") || "ida";
  const pasajeros = params.get("pasajeros") || "1";
  const origen = params.get("origen") || "";
  const destino = params.get("destino") || "";
  const fechaIda = params.get("fechaIda") || "";
  const fechaVuelta = params.get("fechaVuelta") || "";

  if (tipo === "ida") {
    // ✅ Pasar los parámetros en la URL también
    navigate(
      `/asientos-vuelo?origen=${origen}&destino=${destino}&fechaIda=${fechaIda}&pasajeros=${pasajeros}&tipo=${tipo}`,
      { state: { vueloIda: vuelo } }
    );
    return;
  }

  if (pasoActual === "ida") {
    setVueloIdaSeleccionado(vuelo);
    setPasoActual("vuelta");
  } else {
    // ✅ Pasar los parámetros en la URL también
    navigate(
      `/asientos-vuelo?origen=${origen}&destino=${destino}&fechaIda=${fechaIda}&fechaVuelta=${fechaVuelta}&pasajeros=${pasajeros}&tipo=${tipo}`,
      {
        state: {
          vueloIda: vueloIdaSeleccionado,
          vueloVuelta: vuelo,
        },
      }
    );
  }
};


  const handleVolverAIda = () => {
    setPasoActual("ida");
    setVueloIdaSeleccionado(null);
  };

  // Obtener parámetros para mostrar en la UI
  const params = new URLSearchParams(location.search);
  const origen = params.get("origen") || "";
  const destino = params.get("destino") || "";
  const fechaIda = params.get("fechaIda") || "";
  const fechaVuelta = params.get("fechaVuelta") || "";
  const pasajeros = params.get("pasajeros") || "1";
  const tipo = params.get("tipo") || "ida";

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">
            Volver
          </Link>
        </div>
      </NavBar>



      {/* 🔹 Barra superior con la info de búsqueda */}
      <div className="barra-vuelo">
        <div className="item-vuelo">
          <span className="icon">✈️</span>
          {pasoActual === "ida" ? (
            <>
              <strong>{origen || "Origen"}</strong>
              <span className="icon">➡️</span>
              <strong>{destino || "Destino"}</strong>
            </>
          ) : (
            <>
              <strong>{destino || "Destino"}</strong>
              <span className="icon">➡️</span>
              <strong>{origen || "Origen"}</strong>
            </>
          )}
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">📅</span>
          <strong>
            {pasoActual === "ida"
              ? fechaIda || "Fecha de ida"
              : fechaVuelta || "Fecha de vuelta"}
          </strong>
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">👤</span>
          <strong>{pasajeros}</strong>
        </div>
      </div>

      {/* 🔹 Vuelo seleccionado de ida */}
      {tipo === "ida-vuelta" && pasoActual === "vuelta" && vueloIdaSeleccionado && (
        <div className="vuelo-seleccionado-resumen">
          <div className="resumen-header">
            <h3>✓ Vuelo de Ida Seleccionado</h3>
            <button onClick={handleVolverAIda} className="btn-cambiar">
              Cambiar
            </button>
          </div>
          <div className="resumen-info">
            <span>
              {vueloIdaSeleccionado.origen} → {vueloIdaSeleccionado.destino}
            </span>
            <span>{vueloIdaSeleccionado.horaSalida}</span>
            <span>${vueloIdaSeleccionado.precio}</span>
          </div>
        </div>
      )}

      {/* 🔹 Título de la sección */}
      <div className="titulo-seccion">
        <h2>
          {pasoActual === "ida"
            ? "Selecciona tu vuelo de ida"
            : "Selecciona tu vuelo de vuelta"}
        </h2>
      </div>

      {/* 🔹 Resultado de búsqueda */}
      <div className="lista-vuelos">
        {loading && (
          <p className="loading-msg">🔍 Buscando vuelos disponibles...</p>
        )}

        {error && <p className="error-msg">⚠️ {error}</p>}

        {!loading && !error && vuelos.length === 0 && (
          <p className="no-results-msg">No se encontraron vuelos.</p>
        )}

        {!loading &&
          !error &&
          vuelos.map((vuelo, index) => (
            <div
              key={index}
              className="vuelo-card"
              onClick={() => handleCardClick(vuelo)}
              style={{ cursor: "pointer" }}
            >
              <div className="vuelo-header">
                {vuelo.recomendado && (
                  <span className="tag tag-recomendado">Recomendado</span>
                )}
                {vuelo.masRapido && (
                  <span className="tag tag-rapido">Más rápido</span>
                )}
              </div>

              <div className="vuelo-body">
                <div className="vuelo-hora">
                  <h2>{vuelo.horaSalida}</h2>
                  <span>{vuelo.origen}</span>
                </div>

                <div className="vuelo-duracion">
                  <div className="linea"></div>
                  <p>Duración</p>
                  <strong>{vuelo.duracion}</strong>
                </div>

                <div className="vuelo-hora">
                  <h2>{vuelo.horaLlegada}</h2>
                  <span>{vuelo.destino}</span>
                </div>
              </div>

              <div className="vuelo-footer">
                <p>
                  Operado por <strong>{vuelo.aerolinea}</strong>
                </p>
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