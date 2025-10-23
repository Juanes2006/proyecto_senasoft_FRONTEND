import React, { useState } from "react";
import "./style/BuscadorCard.css";
import { useNavigate} from "react-router-dom";

export default function BuscadorCard() {
  const [tripType, setTripType] = useState("ida");
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    fechaIda: "",
    fechaVuelta: "",
    pasajeros: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ciudades = [
    "Bogotá (BOG)",
    "Medellín (MDE)",
    "Cali (CLO)",
    "Cartagena (CTG)",
    "Barranquilla (BAQ)",
    "Pereira (PEI)",
    "Cúcuta (CUC)",
    "Bucaramanga (BGA)",
    "Montería (MTR)",
    "Santa Marta (SMR)",
    "San Andrés (ADZ)",
    "Ciudad de México (MEX)",
    "Miami (MIA)",
    "Madrid (MAD)", 
  ];

  const simularBusquedaVuelos = async (params) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (params.origen === params.destino)
          return reject(new Error("El origen y el destino no pueden ser iguales."));
        const hayVuelos = Math.random() > 0.2;
        if (!hayVuelos) return reject(new Error("No se encontraron vuelos disponibles."));
        resolve({ vuelos: [{ id: 1, ...params }] });
      }, 1000);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const validarFormulario = () => {
    if (!form.origen || !form.destino)
      return "Por favor selecciona origen y destino.";
    if (!form.fechaIda) return "Debes seleccionar una fecha de salida.";
    if (tripType === "ida-vuelta") {
      if (!form.fechaVuelta) return "Debes seleccionar una fecha de regreso.";
      if (form.fechaVuelta < form.fechaIda)
        return "La fecha de regreso no puede ser anterior a la de salida.";
    }
    return null;
  };

  const handleBuscar = async () => {
    const errorMsg = validarFormulario();
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    try {
      await simularBusquedaVuelos(form);
      const params = new URLSearchParams({
        ...form,
        tipo: tripType,
      }).toString();
      navigate(`/vuelos?${params}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador-inner">
      <div className="trip-type">
        <input
          id="ida"
          type="radio"
          name="trip"
          checked={tripType === "ida"}
          onChange={() => setTripType("ida")}
        />
        <label htmlFor="ida">Solo ida</label>

        <input
          id="ida-vuelta"
          type="radio"
          name="trip"
          checked={tripType === "ida-vuelta"}
          onChange={() => setTripType("ida-vuelta")}
        />
        <label htmlFor="ida-vuelta">Ida y vuelta</label>
      </div>

      <div className="search-card">
        <input
          list="ciudades"
          name="origen"
          placeholder="Ciudad de origen"
          value={form.origen}
          onChange={handleChange}
        />
        <datalist id="ciudades">
          {ciudades.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <input
          list="ciudades"
          name="destino"
          placeholder="Ciudad de destino"
          value={form.destino}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fechaIda"
          value={form.fechaIda}
          onChange={handleChange}
        />

        {tripType === "ida-vuelta" && (
          <input
            type="date"
            name="fechaVuelta"
            value={form.fechaVuelta}
            onChange={handleChange}
          />
        )}

        <select name="pasajeros" value={form.pasajeros} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} pasajero{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <div className="navbar-actions">
          <button className="btn-outline" onClick={handleBuscar} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}
