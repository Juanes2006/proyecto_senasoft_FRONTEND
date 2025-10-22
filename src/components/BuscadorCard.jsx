import React, { useState } from "react";
import "./style/BuscadorCard.css";

export default function BuscadorCard() {
  const [tripType, setTripType] = useState("ida-vuelta");

  return (
    <div className="buscador-inner">
      <div className="trip-type">
        <input
          id="ida-vuelta"
          type="radio"
          name="trip"
          checked={tripType === "ida-vuelta"}
          onChange={() => setTripType("ida-vuelta")}
        />
        <label htmlFor="ida-vuelta">Ida y vuelta</label>

        <input
          id="ida"
          type="radio"
          name="trip"
          checked={tripType === "ida"}
          onChange={() => setTripType("ida")}
        />
        <label htmlFor="ida">Ida</label>
      </div>

      <div className="search-card">
        <input type="text" placeholder="Origen" />
        <input type="text" placeholder="Destino" />
        <input type="date" />
        {tripType === "ida-vuelta" && <input type="date" />}
        <select>
          <option>1 pasajero</option>
          <option>2 pasajeros</option>
        </select>
        <button className="btn-primary">Buscar</button>
      </div>
    </div>
  );
}
