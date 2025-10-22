import React, { useState } from "react";
import "./style/BuscadorCard.css";
import { Link } from "react-router-dom";  // ✅ Falta esto


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
        <input type="text" placeholder="Origen"  required/>
        <input type="text" placeholder="Destino"  required/>
        <input type="date" />
        {tripType === "ida-vuelta" && <input type="date" required/>}
        <select>
          <option>1 pasajero</option>
          <option>2 pasajeros</option>
          <option>3 pasajeros</option>
          <option>4 pasajeros</option>
          <option>5 pasajeros</option>
        </select>
       <div className="navbar-actions">
        <Link to="/vuelos" className="btn-outline">Buscar</Link>
      </div>

      </div>
    </div>
  );
}
