import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { jsPDF } from "jspdf";

import autoTable from "jspdf-autotable";

import "./style/pagosVuelo.css";

export default function PayVuelo() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Obtener todos los datos con valores por defecto
  const {
    vueloIda,
    vueloVuelta,
    pasajeros = [], // ✅ Valor por defecto: array vacío
    origen = "Origen",
    destino = "Destino",
    fechaIda = "N/A",
    fechaVuelta = "N/A",
    numPasajeros = 1,
  } = location.state || {};

  const asientosIda = location.state?.asientosIda || [];
  const asientosVuelta = location.state?.asientosVuelta || [];

  // ✅ Validar que llegaron los datos
  useEffect(() => {
    if (!vueloIda || !pasajeros || pasajeros.length === 0) {
      console.error("Datos faltantes:", { vueloIda, pasajeros });
      alert("No hay información de reserva. Serás redirigido.");
      navigate("/");
    }
  }, [vueloIda, pasajeros, navigate]);

  const [metodo, setMetodo] = useState("card");
  const [card, setCard] = useState({
    nombre: "",
    numero: "",
    mes: "",
    ano: "",
    cvv: "",
  });
  const [email, setEmail] = useState(pasajeros?.[0]?.email || "");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [referencia, setReferencia] = useState("");

  // ✅ Calcular costos con validación
  const calcularPrecio = (precioStr) => {
    if (!precioStr) return 0;
    const precio = precioStr.toString().replace(/\./g, "").replace(/[^0-9]/g, "");
    return parseInt(precio) || 0;
  };

  const precioBase = calcularPrecio(vueloIda?.precio) || 1890000;
  const subtotal = precioBase * numPasajeros;
  const impuestos = Math.round(subtotal * 0.12);
  const costoVuelta = vueloVuelta
    ? calcularPrecio(vueloVuelta?.precio) * numPasajeros
    : 0;
  const total = subtotal + impuestos + costoVuelta;

  const formatCurrency = (n) => {
    try {
      return n.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      });
    } catch {
      return `$${n.toLocaleString()}`;
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
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
    setError("");
    return true;
  };

  // ✅ Función para generar el PDF CON VALIDACIONES
  const generarPDF = (ref) => {
    try {
      console.log("=== INICIO GENERACIÓN PDF ===");
      console.log("Referencia:", ref);
      console.log("Pasajeros:", pasajeros);
      console.log("Vuelo Ida:", vueloIda);
      console.log("Asientos Ida:", asientosIda);

      // ✅ VALIDACIONES CRÍTICAS
      if (!pasajeros || pasajeros.length === 0) {
        throw new Error("No hay datos de pasajeros para generar el PDF");
      }

      if (!vueloIda) {
        throw new Error("No hay información del vuelo de ida");
      }

      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString("es-CO");

      // === ENCABEZADO ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("CELESTIS AIR", 105, 20, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Confirmación de Reserva", 105, 32, { align: "center" });

      // Línea
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);

      // Información
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let y = 48;

      doc.text(`Referencia: ${ref}`, 20, y);
      doc.text(`Fecha: ${fechaActual}`, 140, y);
      y += 15;

      // === VUELO DE IDA ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(0, 102, 204);
      doc.rect(20, y, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("VUELO DE IDA", 25, y + 6);
      y += 15;

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      doc.text(`Ruta: ${origen || "N/A"} → ${destino || "N/A"}`, 20, y);
      doc.text(`Fecha: ${fechaIda || "N/A"}`, 120, y);
      y += 7;
      doc.text(`Salida: ${vueloIda?.horaSalida || "N/A"}`, 20, y);
      doc.text(`Llegada: ${vueloIda?.horaLlegada || "N/A"}`, 120, y);
      y += 7;
      doc.text(`Duración: ${vueloIda?.duracion || "N/A"}`, 20, y);
      doc.text(`Aerolínea: ${vueloIda?.aerolinea || "N/A"}`, 120, y);
      y += 12;

      // ✅ Tabla de pasajeros con validaciones
      console.log("Generando tabla de pasajeros...");
      
      const pasajerosIdaData = pasajeros.map((p, index) => {
        const nombre = p?.nombres || "N/A";
        const apellido = p?.primerApellido || "";
        const documento = p?.numeroDocumento || "N/A";
        const asiento = p?.asientoIda || asientosIda[index] || "N/A";
        
        return [
          index + 1,
          `${nombre} ${apellido}`.trim(),
          documento,
          asiento,
        ];
      });

      console.log("Datos tabla:", pasajerosIdaData);

      autoTable(doc, {
        startY: y,
        head: [["#", "Nombre", "Documento", "Asiento"]],
        body: pasajerosIdaData,
        theme: "grid",
        headStyles: { 
          fillColor: [0, 102, 204], 
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold"
        },
        bodyStyles: {
          fontSize: 9
        },
        margin: { left: 20, right: 20 },
      });

      y = doc.lastAutoTable.finalY + 15;

      // === VUELO DE VUELTA ===
      if (vueloVuelta) {
        console.log("Generando vuelo de vuelta...");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setFillColor(0, 102, 204);
        doc.rect(20, y, 170, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("VUELO DE VUELTA", 25, y + 6);
        y += 15;

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        doc.text(`Ruta: ${destino || "N/A"} → ${origen || "N/A"}`, 20, y);
        doc.text(`Fecha: ${fechaVuelta || "N/A"}`, 120, y);
        y += 7;
        doc.text(`Salida: ${vueloVuelta?.horaSalida || "N/A"}`, 20, y);
        doc.text(`Llegada: ${vueloVuelta?.horaLlegada || "N/A"}`, 120, y);
        y += 7;
        doc.text(`Duración: ${vueloVuelta?.duracion || "N/A"}`, 20, y);
        doc.text(`Aerolínea: ${vueloVuelta?.aerolinea || "N/A"}`, 120, y);
        y += 12;

        const pasajerosVueltaData = pasajeros.map((p, index) => {
          const nombre = p?.nombres || "N/A";
          const apellido = p?.primerApellido || "";
          const documento = p?.numeroDocumento || "N/A";
          const asiento = p?.asientoVuelta || asientosVuelta[index] || "N/A";
          
          return [
            index + 1,
            `${nombre} ${apellido}`.trim(),
            documento,
            asiento,
          ];
        });

        autoTable(doc,{
          startY: y,
          head: [["#", "Nombre", "Documento", "Asiento"]],
          body: pasajerosVueltaData,
          theme: "grid",
          headStyles: { 
            fillColor: [0, 102, 204], 
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold"
          },
          bodyStyles: {
            fontSize: 9
          },
          margin: { left: 20, right: 20 },
        });

        y = doc.lastAutoTable.finalY + 15;
      }

      // Nueva página si es necesario
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // === RESUMEN DE COSTOS ===
      console.log("Generando resumen de costos...");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(0, 102, 204);
      doc.rect(20, y, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("RESUMEN DE PAGO", 25, y + 6);
      y += 15;

      const costosData = [
        ["Vuelo de ida", `${numPasajeros} pasajero(s)`, formatCurrency(subtotal)],
      ];

      if (vueloVuelta) {
        costosData.push([
          "Vuelo de vuelta",
          `${numPasajeros} pasajero(s)`,
          formatCurrency(costoVuelta),
        ]);
      }

      costosData.push(
        ["Impuestos (12%)", "", formatCurrency(impuestos)],
        ["TOTAL", "", formatCurrency(total)]
      );

      autoTable(doc, {
        startY: y,
        body: costosData,
        theme: "striped",
        margin: { left: 20, right: 20 },
        styles: { fontSize: 10 },
        columnStyles: {
          2: { halign: "right", fontStyle: "bold" },
        },
      });

      y = doc.lastAutoTable.finalY + 15;

      // Pie de página
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Gracias por volar con Celestis Air", 105, y, {
        align: "center",
      });
      doc.text(
        "Presentar este documento en el aeropuerto con identificación",
        105,
        y + 5,
        { align: "center" }
      );

      // ✅ GUARDAR PDF
      console.log("Guardando PDF...");
      const nombreArchivo = `ticket_celestis_${ref}.pdf`;
      doc.save(nombreArchivo);
      console.log("=== PDF GENERADO EXITOSAMENTE ===");
      
      alert("✅ PDF descargado correctamente");
      
    } catch (error) {
      console.error("=== ERROR AL GENERAR PDF ===");
      console.error("Tipo:", error.name);
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);
      console.error("Datos disponibles:", { 
        pasajeros, 
        vueloIda, 
        asientosIda,
        origen,
        destino 
      });
      
      alert(`Error al generar el PDF: ${error.message}`);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validateCard()) return;

    setProcessing(true);
    setTimeout(() => {
      const ref = `CEL-${Math.floor(Math.random() * 900000 + 100000)}`;
      setReferencia(ref);
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const reset = () => {
    setProcessing(false);
    setSuccess(false);
    setCard({ nombre: "", numero: "", mes: "", ano: "", cvv: "" });
    setEmail("");
    setError("");
  };

  // ✅ Mostrar mensaje si no hay datos
  if (!vueloIda || !pasajeros || pasajeros.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>No hay información de reserva</h2>
        <Link to="/" className="btn-outline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <>
      <NavBar showImage={true} showBotones={false}>
        <div className="navbar-actions">
          <button onClick={() => navigate(-1)} className="btn-outline">
            Volver
          </button>
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
                💳 Tarjeta
              </button>
            </div>

            {metodo === "card" && (
              <>
                <div className="card-preview">
                  <div className="chip" />
                  <div className="card-number">
                    {card.numero || "XXXX XXXX XXXX XXXX"}
                  </div>
                  <div className="card-bottom">
                    <div className="card-name">
                      {card.nombre
                        ? card.nombre.toUpperCase()
                        : "NOMBRE DEL TITULAR"}
                    </div>
                    <div className="card-exp">
                      {card.mes || "MM"}/{card.ano || "AA"}
                    </div>
                  </div>
                </div>

                <form className="pay-form" onSubmit={handlePay}>
                  <input
                    name="nombre"
                    value={card.nombre}
                    onChange={handleCardChange}
                    placeholder="Nombre en la tarjeta"
                    required
                  />
                  <input
                    name="numero"
                    value={card.numero}
                    onChange={handleCardChange}
                    placeholder="Número de tarjeta"
                    inputMode="numeric"
                    required
                  />
                  <div className="small-row">
                    <input
                      name="mes"
                      value={card.mes}
                      onChange={handleCardChange}
                      placeholder="MM"
                      maxLength="2"
                      required
                    />
                    <input
                      name="ano"
                      value={card.ano}
                      onChange={handleCardChange}
                      placeholder="AA"
                      maxLength="2"
                      required
                    />
                    <input
                      name="cvv"
                      value={card.cvv}
                      onChange={handleCardChange}
                      placeholder="CVV"
                      maxLength="4"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email de contacto"
                    required
                  />

                  {error && <div className="error">{error}</div>}

                  <button
                    type="submit"
                    className="btn-pay"
                    disabled={processing}
                  >
                    {processing ? (
                      <span className="loader"></span>
                    ) : (
                      `Pagar ${formatCurrency(total)}`
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="pay-right">
            <div className="summary">
              <h3>Resumen de la reserva</h3>

              <div className="line">
                <div>
                  <div className="route">
                    {origen} → {destino}
                  </div>
                  <div className="meta">
                    {fechaIda} • {numPasajeros} pasajero
                    {numPasajeros > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="tag">{vueloIda?.aerolinea || "N/A"}</div>
              </div>

              {vueloVuelta && (
                <div className="line">
                  <div>
                    <div className="route">
                      {destino} → {origen}
                    </div>
                    <div className="meta">
                      {fechaVuelta} • {numPasajeros} pasajero
                      {numPasajeros > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="tag">{vueloVuelta?.aerolinea || "N/A"}</div>
                </div>
              )}

              <div className="prices">
                <div className="price-row">
                  <span>Subtotal ({numPasajeros} pasajero(s))</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {vueloVuelta && (
                  <div className="price-row">
                    <span>Vuelo de vuelta</span>
                    <span>{formatCurrency(costoVuelta)}</span>
                  </div>
                )}
                <div className="price-row">
                  <span>Impuestos (12%)</span>
                  <span>{formatCurrency(impuestos)}</span>
                </div>
                <div className="price-total">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              <div className="pasajeros-lista">
                <h4>Pasajeros:</h4>
                {pasajeros.map((p, index) => (
                  <div key={index} className="pasajero-item">
                    <span>
                      {index + 1}. {p?.nombres || "N/A"} {p?.primerApellido || ""}
                    </span>
                    <span className="asiento-info">
                      Asiento Ida: {p?.asientoIda || asientosIda[index] || "N/A"}
                      {(p?.asientoVuelta || asientosVuelta[index]) &&
                        ` / Vuelta: ${p?.asientoVuelta || asientosVuelta[index]}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="help">
                <p className="muted">💳 Pago simulado</p>
              </div>
            </div>
          </aside>
        </div>

        {success && (
          <div className="success-overlay">
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h2>¡Pago Exitoso!</h2>
              <p>Tu reserva ha sido confirmada</p>
              <p>
                <strong>Referencia:</strong> {referencia}
              </p>

              <div className="success-actions">
                <button
                  className="btn-download"
                  onClick={() => generarPDF(referencia)}
                >
                  📄 Descargar Tickets PDF
                </button>
                <button className="btn-outline" onClick={reset}>
                  Nueva reserva
                </button>
                <Link to="/" className="btn-pay small">
                  Ir al inicio
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
