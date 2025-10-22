import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import "./style/pagosVuelo.css";

export default function PayVuelo() {
  const [metodo, setMetodo] = useState("card");
  const [card, setCard] = useState({ nombre: "", numero: "", mes: "", ano: "", cvv: "" });
  const [userData, setUserData] = useState({ nombre: "", telefono: "", tipoDocumento: "", numeroDocumento: "" });
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const subtotal = 1890000;
  const impuestos = Math.round(subtotal * 0.12);
  const descuento = promo === "SAVE10" ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + impuestos - descuento;

  const formatCurrency = (n) =>
    n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCard = () => {
    if (!card.nombre || !card.numero || !card.mes || !card.ano || !card.cvv) {
      setError("Completa todos los datos de la tarjeta.");
      return false;
    }
    if (!/^\d{13,19}$/.test(card.numero.replace(/\s+/g, ""))) {
      setError("Número de tarjeta inválido.");
      return false;
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      setError("CVV inválido.");
      return false;
    }
    if (!email) {
      setError("Ingresa un correo electrónico.");
      return false;
    }
    if (!userData.nombre || !userData.telefono || !userData.tipoDocumento || !userData.numeroDocumento) {
      setError("Completa todos los datos personales.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validateCard()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const reset = () => {
    setProcessing(false);
    setSuccess(false);
    setCard({ nombre: "", numero: "", mes: "", ano: "", cvv: "" });
    setUserData({ nombre: "", telefono: "", tipoDocumento: "", numeroDocumento: "" });
    setEmail("");
    setPromo("");
    setError("");
  };

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <Link to="/" className="btn-outline">Volver</Link>
        </div>
      </NavBar>

      <div className="pay-overlay">
        <div className="pay-wrapper">
          <div className="pay-left">
            <h2>Pago Seguro</h2>
            <p className="muted">Completa tus datos para procesar el pago.</p>

            <div className="metodos">
              <button
                className={metodo === "card" ? "metodo active" : "metodo"}
                onClick={() => setMetodo("card")}
              >
                Tarjeta
              </button>
            </div>

            {metodo === "card" && (
              <>
                <div className="card-preview">
                  <div className="chip" />
                  <div className="card-number">{card.numero || "XXXX XXXX XXXX XXXX"}</div>
                  <div className="card-bottom">
                    <div className="card-name">{card.nombre ? card.nombre.toUpperCase() : "NOMBRE DEL TITULAR"}</div>
                    <div className="card-exp">{card.mes || "MM"}/{card.ano || "AA"}</div>
                  </div>
                </div>

                <form className="pay-form" onSubmit={handlePay}>
                  {/* Datos tarjeta */}
                  <input name="nombre" value={card.nombre} onChange={handleCardChange} placeholder="Nombre en la tarjeta" />
                  <input name="numero" value={card.numero} onChange={handleCardChange} placeholder="Número de tarjeta" inputMode="numeric" />
                  <div className="small-row">
                    <input name="mes" value={card.mes} onChange={handleCardChange} placeholder="MM" />
                    <input name="ano" value={card.ano} onChange={handleCardChange} placeholder="AA" />
                    <input name="cvv" value={card.cvv} onChange={handleCardChange} placeholder="CVV" />
                  </div>

                  {/* Datos usuario */}
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email de contacto" />
                  <div className="small-row">
                    <input name="nombre" value={userData.nombre} onChange={handleUserChange} placeholder="Nombre" />
                    <input name="telefono" value={userData.telefono} onChange={handleUserChange} placeholder="Teléfono" />
                  </div>

                  <select name="tipoDocumento" value={userData.tipoDocumento} onChange={handleUserChange}>
                    <option value="">Tipo Documento</option>
                    <option value="CC">Cédula</option>
                    <option value="PS">Pasaporte</option>
                  </select>

                  <input name="numeroDocumento" value={userData.numeroDocumento} onChange={handleUserChange} placeholder="Número de documento" />

                  {error && <div className="error">{error}</div>}

                  <button type="submit" className="btn-pay" disabled={processing}>
                    {processing ? <span className="loader"></span> : `Pagar ${formatCurrency(total)}`}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="pay-right">
            <div className="summary">
              <h3>Resumen del vuelo</h3>
              <div className="line">
                <div>
                  <div className="route">Pereira → México</div>
                  <div className="meta">jue, 13 de nov • 1 pasajero</div>
                </div>
                <div className="tag">Celestis Air</div>
              </div>

              <div className="prices">
                <div className="price-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="price-row"><span>Impuestos</span><span>{formatCurrency(impuestos)}</span></div>
                {descuento > 0 && <div className="price-row"><span>Descuento</span><span>-{formatCurrency(descuento)}</span></div>}
                <div className="price-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              </div>

              <div className="help">
                <p className="muted">Pago simulado</p>
              </div>
            </div>
          </aside>
        </div>

        {success && (
          <div className="success-overlay">
            <div className="success-card">
              <h2>Pago realizado ✅</h2>
              <p>Tu pago ha sido procesado con éxito (simulación).</p>
              <p><strong>Referencia:</strong> SIM-{Math.floor(Math.random() * 900000 + 100000)}</p>
              <div className="success-actions">
                <button className="btn-outline" onClick={reset}>Volver</button>
                <Link to="/" className="btn-pay small">Ir al inicio</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
