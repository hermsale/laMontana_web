// ============================================================================
// Componente: SectionHero
// Descripción:
//   - Renderiza la sección "Hero" de la landing (título, subtítulo, lead, CTA y
//     fila de features).
//   - Mantiene el diseño y la semántica del HTML original, pero modularizado
//     en React para reuso y claridad.
//   - Orquesta dos subcomponentes: <HeroCTA /> y <HeroFeaturesRow />.
// Accesibilidad:
//   - Usa aria-labelledby para asociar el título.
//   - Mantiene role="group" en botones de acción.
// Estilos:
//   - Reutiliza tus clases CSS existentes (hero, wrap, cta, icons-row, feature).
// ============================================================================

// ============================================================================
// Archivo: SectionHero.jsx
// Contexto: Sección hero de la landing (título, subtítulo, lead, CTA y features).
// Alcance: Página de inicio; CTA navega al catálogo; incluye iconos locales.
// Funciones/componentes:
//  - scrollCatalogo(): navega/scroll a catálogo
//  - <HeroCTA />, <HeroFeaturesRow /> y SVGs internos (PrinterIcon, etc.)
// ============================================================================
import React from "react";
import { useNavigate } from "react-router-dom";

//importación de estilos CSS específicos del componente
import "./SectionHero.css";

// Subcomponentes
import HeroCTA from "./HeroCTA/HeroCTA";
import HeroFeaturesRow from "./HeroFeaturesRow/HeroFeaturesRow";

// ============================================================================
// Iconos SVG internos
// ============================================================================
const PrinterIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <style>{`.b{fill:#000000;}.c{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1px;}`}</style>
    </defs>
    <path
      className="c"
      d="M14.5171,35.415H6.4026c-.4985,0-.9026-.4041-.9026-.9026v-13.504c0-.4985,.4041-.9026,.9026-.9026H41.5974c.4985,0,.9026,.4041,.9026,.9026v13.504c0,.4985-.4041,.9026-.9026,.9026h-8.1144"
    />
    <rect className="c" x="14.5171" y="31.4366" width="18.9659" height="10.13" />
    <path className="c" d="M33.4829,20.1056H14.5171V6.4334h14.9659l4,4v9.6723Z" />
    <polyline className="c" points="29.8724 6.4334 29.8724 10.0439 33.4829 10.0439" />
    <circle className="b" cx="39.8515" cy="22.8983" r=".75" />
    <circle className="b" cx="36.8351" cy="22.8983" r=".75" />
    <circle className="b" cx="33.8187" cy="22.8983" r=".75" />
  </svg>
);

const SpeedIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
    <path d="M12 6v6l3 3" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const QualityIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9.5 12.4L10.9286 14L14.5 10"
      stroke="#1C274C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 14.4963 20.1632 16.4284 19 17.9041M3.19284 14C4.05026 18.2984 7.57641 20.5129 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C14.6796 21.2747 15.3324 20.9478 16 20.5328"
      stroke="#1C274C"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TruckIcon = () => (
  <svg
    fill="#000000"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <g>
      <path d="M21.47,11.185l-1.03-1.43a2.5,2.5,0,0,0-2.03-1.05H14.03V6.565a2.5,2.5,0,0,0-2.5-2.5H4.56a2.507,2.507,0,0,0-2.5,2.5v9.94a1.5,1.5,0,0,0,1.5,1.5H4.78a2.242,2.242,0,0,0,4.44,0h5.56a2.242,2.242,0,0,0,4.44,0h1.22a1.5,1.5,0,0,0,1.5-1.5v-3.87A2.508,2.508,0,0,0,21.47,11.185ZM7,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,7,18.935Zm6.03-1.93H9.15a2.257,2.257,0,0,0-4.3,0H3.56a.5.5,0,0,1-.5-.5V6.565a1.5,1.5,0,0,1,1.5-1.5h6.97a1.5,1.5,0,0,1,1.5,1.5ZM17,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,17,18.935Zm3.94-2.43a.5.5,0,0,1-.5.5H19.15a2.257,2.257,0,0,0-4.3,0h-.82v-7.3h4.38a1.516,1.516,0,0,1,1.22.63l1.03,1.43a1.527,1.527,0,0,1,.28.87Z" />
      <path d="M18.029,12.205h-2a.5.5,0,0,1,0-1h2a.5.5,0,0,1,0,1Z" />
    </g>
  </svg>
);

// ============================================================================
// Componente principal
// ============================================================================

const SectionHero = () => {
  const navigate = useNavigate();
  const title = (
    <>
      Impresión
      <br />
      <strong>Profesional</strong>
    </>
  );
  const subtitle = "Al alcance de un clic";
  const lead =
    "Sube tu archivo, elige tus opciones y recibe tu trabajo impreso con la mejor calidad. Más de 1000 clientes satisfechos con nuestros servicios.";

  const features = [
    { id: "speed", text: "Entrega rápida", icon: <SpeedIcon /> },
    { id: "quality", text: "Calidad Garantizada", icon: <QualityIcon /> },
    { id: "delivery", text: "Envíos a Domicilio", icon: <TruckIcon /> },
  ];

  const irAImpresiones = () => {
    navigate("/impresiones");
  };

  return (
    <main>
      <section className="hero wrap" aria-labelledby="hero-title">
        <h2 id="hero-title">{title}</h2>
        <h3>{subtitle}</h3>
        <p className="lead">{lead}</p>

        <div className="cta" role="group" aria-label="Acciones principales">
          <HeroCTA
            href="/impresiones"
            label="Comenzar a imprimir"
            icon={<PrinterIcon />}
            onClick={irAImpresiones}
          />
        </div>

        <HeroFeaturesRow features={features} />
      </section>
    </main>
  );
};

export default SectionHero;
