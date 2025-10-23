import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/RegistroViajeros.css";

export default function RegistroViajeros() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Obtener datos del componente anterior (AsientosVuelo)
  const {
    vueloIda,
    vueloVuelta,
    asientosIda,
    asientosVuelta,
    numPasajeros,
    origen,
    destino,
    fechaIda,
    fechaVuelta,
    tipo,
  } = location.state || {};

  // ✅ Validar si llegó sin datos
  useEffect(() => {
    if (!vueloIda || !numPasajeros) {
      alert("No hay información de reserva. Serás redirigido.");
      navigate("/");
    }
  }, [vueloIda, numPasajeros, navigate]);

  // Estado para controlar qué formulario está abierto
  const [openIndex, setOpenIndex] = useState(0);

  // ✅ Estado para almacenar los datos de todos los pasajeros
  const [pasajeros, setPasajeros] = useState(
    Array.from({ length: numPasajeros || 1 }, (_, index) => ({
      id: index + 1,
      asientoIda: asientosIda?.[index] || null,
      asientoVuelta: asientosVuelta?.[index] || null,
      primerApellido: "",
      segundoApellido: "",
      nombres: "",
      fechaNacimiento: "",
      tipoDocumento: "",
      numeroDocumento: "",
      genero: "",
      celular: "",
      email: "",
      esInfante: "No",
      validado: false,
    }))
  );

  const toggleForm = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // ✅ Manejar cambios en el formulario
  const handleInputChange = (index, field, value) => {
    setPasajeros((prev) =>
      prev.map((pasajero, i) =>
        i === index ? { ...pasajero, [field]: value } : pasajero
      )
    );
  };

  // ✅ Validar un pasajero específico
  const validarPasajero = (e, index) => {
    e.preventDefault();
    const pasajero = pasajeros[index];

    // Validaciones básicas
    if (
      !pasajero.primerApellido ||
      !pasajero.nombres ||
      !pasajero.fechaNacimiento ||
      !pasajero.tipoDocumento ||
      !pasajero.numeroDocumento ||
      !pasajero.genero ||
      !pasajero.celular ||
      !pasajero.email
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pasajero.email)) {
      alert("Por favor ingresa un email válido");
      return;
    }

    // Validar celular (10 dígitos)
    if (pasajero.celular.length < 10) {
      alert("El número de celular debe tener al menos 10 dígitos");
      return;
    }

    // Marcar como validado
    setPasajeros((prev) =>
      prev.map((p, i) => (i === index ? { ...p, validado: true } : p))
    );

    alert(`Datos del pasajero ${index + 1} validados correctamente ✓`);

    // Abrir siguiente formulario si existe
    if (index < numPasajeros - 1) {
      setOpenIndex(index + 1);
    }
  };

  // ✅ Verificar si todos los pasajeros están validados
  const todosValidados = pasajeros.every((p) => p.validado);

  // ✅ Continuar al pago
  const handleContinuar = () => {
    if (!todosValidados) {
      alert(
        "Debes validar los datos de todos los pasajeros antes de continuar"
      );
      return;
    }

    navigate("/pay-celestis", {
      state: {
        vueloIda,
        vueloVuelta,
        asientosIda,
        asientosVuelta,
        pasajeros,
        origen,
        destino,
        fechaIda,
        fechaVuelta,
        tipo,
        numPasajeros,
      },
    });
  };

  if (!vueloIda) return null;

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <button onClick={() => navigate(-1)} className="btn-outline">
            Volver
          </button>
        </div>
      </NavBar>

      {/* Barra de información del vuelo */}
      <div className="barra-vuelo">
        <div className="item-vuelo">
          <span className="icon">✈️</span>
          <strong>
            {origen} → {destino}
          </strong>
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">📅</span>
          <strong>{fechaIda}</strong>
          {tipo === "ida-vuelta" && fechaVuelta && (
            <span> → {fechaVuelta}</span>
          )}
        </div>

        <div className="divider"></div>

        <div className="item-vuelo">
          <span className="icon">👤</span>
          <strong>
            {numPasajeros} pasajero{numPasajeros > 1 ? "s" : ""}
          </strong>
        </div>
      </div>

      {/* Título */}
      <div className="registro-title">
        <h1>Registro de Pasajeros</h1>
        <p>
          Complete los datos de {numPasajeros > 1 ? "los" : "su"}{" "}
          {numPasajeros} pasajero{numPasajeros > 1 ? "s" : ""}
        </p>
      </div>

      {/* Indicador de progreso */}
      <div className="progreso-container">
        <p>
          Validados: <strong>{pasajeros.filter((p) => p.validado).length}</strong>{" "}
          / {numPasajeros}
        </p>
      </div>

      {/* Formularios dinámicos según número de pasajeros */}
      {pasajeros.map((pasajero, index) => (
        <div key={index} className="registro-card">
          <button
            className={`btn-toggle ${pasajero.validado ? "validado" : ""}`}
            onClick={() => toggleForm(index)}
          >
            <span>
              {pasajero.validado && "✓ "}
              Pasajero {index + 1}
              {pasajero.asientoIda && ` - Asiento Ida: ${pasajero.asientoIda}`}
              {pasajero.asientoVuelta &&
                ` / Vuelta: ${pasajero.asientoVuelta}`}
            </span>
            <span className="toggle-icon">
              {openIndex === index ? "▲" : "▼"}
            </span>
          </button>

          {openIndex === index && (
            <form
              className="registro-form"
              onSubmit={(e) => validarPasajero(e, index)}
            >
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Primer Apellido *"
                  value={pasajero.primerApellido}
                  onChange={(e) =>
                    handleInputChange(index, "primerApellido", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Segundo Apellido"
                  value={pasajero.segundoApellido}
                  onChange={(e) =>
                    handleInputChange(index, "segundoApellido", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Nombres *"
                  value={pasajero.nombres}
                  onChange={(e) =>
                    handleInputChange(index, "nombres", e.target.value)
                  }
                  required
                />
                <input
                  type="date"
                  placeholder="Fecha de Nacimiento *"
                  value={pasajero.fechaNacimiento}
                  onChange={(e) =>
                    handleInputChange(index, "fechaNacimiento", e.target.value)
                  }
                  required
                />
                <select
                  value={pasajero.tipoDocumento}
                  onChange={(e) =>
                    handleInputChange(index, "tipoDocumento", e.target.value)
                  }
                  required
                >
                  <option value="">Tipo de documento *</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
                <input
                  type="text"
                  placeholder="Número de documento *"
                  value={pasajero.numeroDocumento}
                  onChange={(e) =>
                    handleInputChange(index, "numeroDocumento", e.target.value)
                  }
                  required
                />
                <select
                  value={pasajero.genero}
                  onChange={(e) =>
                    handleInputChange(index, "genero", e.target.value)
                  }
                  required
                >
                  <option value="">Género *</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                <input
                  type="tel"
                  placeholder="Número de celular *"
                  value={pasajero.celular}
                  onChange={(e) =>
                    handleInputChange(index, "celular", e.target.value)
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Correo Electrónico *"
                  value={pasajero.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                  required
                />
                <select
                  value={pasajero.esInfante}
                  onChange={(e) =>
                    handleInputChange(index, "esInfante", e.target.value)
                  }
                >
                  <option value="No">No es infante</option>
                  <option value="Si">Sí es infante</option>
                </select>
              </div>

              <button type="submit" className="btn-outline btn-submit">
                {pasajero.validado ? "✓ Validado" : "Validar datos"}
              </button>
            </form>
          )}
        </div>
      ))}

      {/* Botón continuar */}
      <div className="continuar-container">
        <button
          onClick={handleContinuar}
          className={`btn-outline btn-continuar ${
            todosValidados ? "" : "disabled"
          }`}
          disabled={!todosValidados}
        >
          Continuar al pago
        </button>
      </div>
    </>
  );
}
