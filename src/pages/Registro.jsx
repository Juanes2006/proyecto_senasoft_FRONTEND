import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Hero from "../components/Hero"

export default function Registro() {
  return (
    <>
      <Navbar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
        </div>
      </Navbar>

      <Hero showTitle = {false} showSearch = {false} showImage = {true}></Hero>


     
    </>
  );
}
