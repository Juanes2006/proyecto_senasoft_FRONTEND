import React, { useState, useEffect } from "react";
import "./style/AsientosVuelo.css";
import NavBar from "../components/NavBar";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Componente de asiento individual
const Asiento = ({ asiento, onClick, disabled }) => {
  const getClass = () => {
    switch (asiento.estado) {
      case "libre":
        return "asiento libre";
      case "seleccionado":
        return "asiento seleccionado";
      case "ocupado":
        return "asiento ocupado";
      default:
        return "asiento";
    }
  };

  return (
    <button
      className={getClass()}
      onClick={() => !disabled && asiento.estado !== "ocupado" && onClick(asiento.id)}
      disabled={disabled && asiento.estado === "libre"}
    >
      {asiento.id}
    </button>
  );
};

// Componente principal del avión
const AsientosVuelo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Obtener datos del componente anterior (Vuelos)
  const { vueloIda, vueloVuelta } = location.state || {};
  
  // ✅ Obtener parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const origen = searchParams.get("origen") || "";
  const destino = searchParams.get("destino") || "";
  const fechaIda = searchParams.get("fechaIda") || "";
  const fechaVuelta = searchParams.get("fechaVuelta") || "";
  const numPasajeros = parseInt(searchParams.get("pasajeros") || "1", 10);
  const tipo = searchParams.get("tipo") || "ida";

  console.log("Número de pasajeros recibido:", numPasajeros); // Debug

  // Estado para controlar qué vuelo está seleccionando asientos
  const [vueloActual, setVueloActual] = useState("ida");

  const filas = 10;
  const asientosPorFila = 6;

  // Crear estructura inicial de asientos
  const crearAsientosIniciales = () => {
    const asientos = [];
    let contador = 1;
    
    // Marcar algunos asientos como ocupados aleatoriamente
    const ocupados = [3, 7, 12, 18, 25, 31, 42, 48];
    
    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < asientosPorFila; j++) {
        fila.push({
          id: contador,
          estado: ocupados.includes(contador) ? "ocupado" : "libre",
        });
        contador++;
      }
      asientos.push(fila);
    }
    return asientos;
  };

  const [asientosIda, setAsientosIda] = useState(crearAsientosIniciales());
  const [asientosVuelta, setAsientosVuelta] = useState(crearAsientosIniciales());

  // ✅ Validar si llegó sin datos
  useEffect(() => {
    if (!vueloIda) {
      alert("No hay información de vuelo. Serás redirigido.");
      navigate("/");
    }
  }, [vueloIda, navigate]);

  // ✅ Validar que numPasajeros sea válido
  useEffect(() => {
    if (isNaN(numPasajeros) || numPasajeros < 1) {
      alert("Número de pasajeros inválido");
      navigate("/");
    }
  }, [numPasajeros, navigate]);

  // Obtener asientos actuales según el vuelo
  const asientosActuales = vueloActual === "ida" ? asientosIda : asientosVuelta;
  const setAsientosActuales = vueloActual === "ida" ? setAsientosIda : setAsientosVuelta;

  // ✅ Contar asientos seleccionados
  const asientosSeleccionados = asientosActuales
    .flat()
    .filter((a) => a.estado === "seleccionado");

  // ✅ Verificar si se alcanzó el límite
  const limiteAlcanzado = asientosSeleccionados.length >= numPasajeros;

  // Cambiar estado de asiento
  const manejarClick = (id) => {
    setAsientosActuales((prev) =>
      prev.map((fila) =>
        fila.map((a) => {
          if (a.id === id) {
            // Si está seleccionado, deseleccionar
            if (a.estado === "seleccionado") {
              return { ...a, estado: "libre" };
            }
            // Si está libre y no se alcanzó el límite, seleccionar
            if (a.estado === "libre" && !limiteAlcanzado) {
              return { ...a, estado: "seleccionado" };
            }
          }
          return a;
        })
      )
    );
  };

  // ✅ Manejar continuar
  const handleContinuar = () => {
    if (asientosSeleccionados.length !== numPasajeros) {
      alert(`Debes seleccionar exactamente ${numPasajeros} asiento(s)`);
      return;
    }

    // Si hay vuelo de vuelta y aún no se han seleccionado esos asientos
    if (vueloVuelta && vueloActual === "ida") {
      setVueloActual("vuelta");
      return;
    }

    // Preparar datos para enviar a la siguiente página
    const asientosIdaSeleccionados = asientosIda
      .flat()
      .filter((a) => a.estado === "seleccionado")
      .map((a) => a.id);

    const asientosVueltaSeleccionados = vueloVuelta
      ? asientosVuelta
          .flat()
          .filter((a) => a.estado === "seleccionado")
          .map((a) => a.id)
      : [];

    navigate("/registro-pasajeros", {
      state: {
        vueloIda,
        vueloVuelta,
        asientosIda: asientosIdaSeleccionados,
        asientosVuelta: asientosVueltaSeleccionados,
        numPasajeros,
        origen,
        destino,
        fechaIda,
        fechaVuelta,
        tipo,
      },
    });
  };

  // ✅ Volver al paso anterior
  const handleVolver = () => {
    if (vueloActual === "vuelta") {
      setVueloActual("ida");
    } else {
      navigate(-1);
    }
  };

  if (!vueloIda) return null;

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <button onClick={handleVolver} className="btn-outline">
            Volver
          </button>
        </div>
      </NavBar>

      {/* Barra de información del vuelo */}
      <div className="barra-vuelo">
        <div className="item-vuelo">
          <span className="icon">✈️</span>
          {vueloActual === "ida" ? (
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
            {vueloActual === "ida" ? fechaIda : fechaVuelta}
          </strong>
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">👤</span>
          <strong>{numPasajeros}</strong>
        </div>
      </div>

      {/* Indicador de paso para ida y vuelta */}
      {vueloVuelta && (
        <div className="pasos-indicador">
          <div className={`paso ${vueloActual === "ida" ? "activo" : "completado"}`}>
            <span className="numero">1</span>
            <span className="texto">Asientos Ida</span>
          </div>
          <div className="linea-paso"></div>
          <div className={`paso ${vueloActual === "vuelta" ? "activo" : ""}`}>
            <span className="numero">2</span>
            <span className="texto">Asientos Vuelta</span>
          </div>
        </div>
      )}

      {/* Título */}
      <div className="titulo-seleccion">
        <h1>
          Selecciona {numPasajeros} asiento{numPasajeros > 1 ? "s" : ""}{" "}
          {vueloVuelta && `(${vueloActual === "ida" ? "Ida" : "Vuelta"})`}
        </h1>
      </div>

      {/* Contador de asientos seleccionados */}
      <div className="contador-asientos">
        <p>
          Asientos seleccionados: <strong>{asientosSeleccionados.length}</strong> /{" "}
          <strong>{numPasajeros}</strong>
        </p>
        {limiteAlcanzado && asientosSeleccionados.length === numPasajeros && (
          <p className="mensaje-completado">✓ Has seleccionado todos los asientos requeridos</p>
        )}
        {limiteAlcanzado && asientosSeleccionados.length < numPasajeros && (
          <p className="mensaje-advertencia">⚠ Límite alcanzado. Deselecciona un asiento para cambiar la selección</p>
        )}
      </div>

      <br />

      <div className="div-asientos">
        <div className="avion-leyenda-container">
          {/* Bloque de asientos */}
          <div className="avion-container">
            {asientosActuales.map((fila, index) => (
              <div key={index} className="fila">
                <div className="bloque">
                  {fila.slice(0, 3).map((a) => (
                    <Asiento
                      key={a.id}
                      asiento={a}
                      onClick={manejarClick}
                      disabled={limiteAlcanzado && a.estado === "libre"}
                    />
                  ))}
                </div>

                <div className="pasillo"></div>

                <div className="bloque">
                  {fila.slice(3, 6).map((a) => (
                    <Asiento
                      key={a.id}
                      asiento={a}
                      onClick={manejarClick}
                      disabled={limiteAlcanzado && a.estado === "libre"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bloque de leyenda */}
          <div className="leyenda-container">
            <div className="leyenda">
              <div className="leyenda-item">
                <span className="cuadro seleccionado"></span>
                <span>Libre</span>
              </div>
              <div className="leyenda-item">
                <span className="cuadro libre"></span>
                <span>Seleccionado</span>
              </div>
              
              <div className="leyenda-item">
                <span className="cuadro ocupado"></span>
                <span>Ocupado</span>
              </div>
            </div>
          </div>

          <div className="boton-continuar-container">
            <button
              onClick={handleContinuar}
              className="btn-continuar"
              disabled={asientosSeleccionados.length !== numPasajeros}
            >
              {vueloVuelta && vueloActual === "ida"
                ? "Continuar a vuelo de vuelta"
                : "Continuar al registro"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AsientosVuelo;
