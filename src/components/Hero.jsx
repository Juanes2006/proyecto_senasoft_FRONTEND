import React from "react";
import "./style/Hero.css";
import plane from "../assets/plane.png";
import BuscadorCard from "./BuscadorCard";

export default function Hero({ showTitle = true, showSearch = true, showImage = true, background = plane, children}) {
  return (
    <section
    
      className="hero"
      style={showImage ? { backgroundImage: `url(${background})` } : {}}

    >
      <div className="hero-overlay">
        <div className="hero-content">
          {showTitle && (
            <h1 className="hero-title">A UNA RESERVA DE TU FELICIDAD</h1>
          )}

          {showSearch && (
            <div className="buscador-wrapper">
              <BuscadorCard />
            </div>
          )}

                      {children && <div className="hero-children">{children}</div>}

        </div>
      </div>



    </section>
  );
}
