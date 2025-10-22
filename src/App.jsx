import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/RegistroUsuarios";
import Vuelos from  "./pages/Vuelos";
import RegistroViajeros from "./pages/RegistroViajeros";
import PayVuelo from "./pages/PayVuelo";
import AsientosVuelo from "./pages/AsientosVuelo";
import MisViajes from "./pages/MisViajes";

export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/vuelos" element={<Vuelos />} />
        <Route path="/asientos-vuelo" element={<AsientosVuelo />} />
        <Route path="/registro-pasajeros" element={<RegistroViajeros/>}/>
        <Route path="/pay-celestis" element={<PayVuelo/>}/>
        <Route path="/mis-viajes" element={<MisViajes/>}/>




      </Routes>
    </Router>
  );
}
