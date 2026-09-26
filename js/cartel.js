/* =============================================================================
   CARTEL.JS · Carteles con código QR para imprimir (cartel.html)
   Los códigos se generan aquí, a partir de las direcciones de datos.js, así que
   si cambia el formulario o la web, el cartel cambia con ellos.
   ============================================================================= */
(function () {
  "use strict";
  if (typeof DATOS === "undefined" || typeof ANIV === "undefined" || typeof qrcode === "undefined") return;
  const { $, $$, esc } = ANIV;

  const web = new URL("./", ANIV.direccionOficial()).href;          // la portada
  const voz = (DATOS.participa || []).find((p) => p.icono === "voz") || {};
  const formulario = voz.enlace || new URL("recuerdos.html", web).href;
  const sinProtocolo = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Código QR en SVG, en verde muy oscuro sobre blanco (máximo contraste)
  function codigoQR(texto) {
    const qr = qrcode(0, "M");
    qr.addData(texto);
    qr.make();
    const n = qr.getModuleCount(), m = 2;
    let trazo = "";
    for (let f = 0; f < n; f++) {
      for (let c = 0; c < n; c++) if (qr.isDark(f, c)) trazo += `M${c + m},${f + m}h1v1h-1z`;
    }
    return `<svg viewBox="0 0 ${n + 2 * m} ${n + 2 * m}" shape-rendering="crispEdges" role="img" aria-label="Código QR que lleva a ${esc(texto)}">` +
      `<rect width="100%" height="100%" fill="#fff"/><path d="${trazo}" fill="#0b1f13"/></svg>`;
  }

  const anillos = `<svg class="cartel__anillos" viewBox="0 0 100 100" aria-hidden="true">${
    Array.from({ length: 12 }, (_, i) => `<circle cx="50" cy="50" r="${4 + i * 4}"/>`).join("")}</svg>`;

  const cabeza = () => `
    <header class="cartel__cabeza">
      <img class="cartel__escudo" src="assets/escudo.png" alt="" width="180" height="200">
      <p class="cartel__centro">${esc(DATOS.centro.nombre)}<span>${esc(DATOS.centro.localidad || "")}</span></p>
    </header>`;
  const pie = () => `
    <footer class="cartel__pie">
      <span>${esc(DATOS.aniversario.hashtag || "")}</span>
      <span>Curso ${esc(DATOS.centro.curso || "")}</span>
    </footer>`;

  const CARTELES = {
    web: {
      archivo: "Cartel 25 aniversario - web",
      html: () => `${cabeza()}
        <div class="cartel__cuerpo">
          ${anillos}
          <div class="cartel__grupo">
            <p class="cartel__cifra">${esc(DATOS.aniversario.numero)}</p>
            <p class="cartel__lema">años sembrando futuro</p>
          </div>
          <p class="cartel__banda"><strong>${esc(DATOS.semana.titulo)}</strong><br>${esc(DATOS.semana.fechaTexto)}</p>
          <div class="cartel__qr">${codigoQR(web)}</div>
          <div class="cartel__grupo">
            <p class="cartel__llamada">Escanea con la cámara del móvil</p>
            <p class="cartel__detalle">Programa, historia, fotos y libro de visitas</p>
            <p class="cartel__url">${esc(sinProtocolo(web))}</p>
          </div>
        </div>${pie()}`
    },
    recuerdo: {
      archivo: "Cartel 25 aniversario - deja tu recuerdo",
      html: () => `${cabeza()}
        <div class="cartel__cuerpo">
          ${anillos}
          <div class="cartel__grupo">
            <p class="cartel__titulo">¿Pasaste por La&nbsp;Arboleda?</p>
            <p class="cartel__sub">Deja tu recuerdo en el libro de visitas del ${esc(DATOS.aniversario.numero)} aniversario</p>
          </div>
          <div class="cartel__qr">${codigoQR(formulario)}</div>
          <div class="cartel__grupo">
            <p class="cartel__llamada">Escanea el código y cuéntanoslo</p>
            <p class="cartel__detalle">Un maestro, una excursión, un patio… en cuatro líneas. Lo leerá todo el colegio.</p>
            <p class="cartel__url">${esc(sinProtocolo(formulario))}</p>
          </div>
        </div>${pie()}`
    }
  };

  let actual = location.hash === "#recuerdo" ? "recuerdo" : "web";

  function mostrar(tipo) {
    actual = CARTELES[tipo] ? tipo : "web";
    $("#cartel").innerHTML = CARTELES[actual].html();
    $("#cartel").setAttribute("aria-label", actual === "web" ? "Cartel: web del aniversario" : "Cartel: deja tu recuerdo");
    $$(".cartel-opcion").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.cartel === actual)));
    history.replaceState(null, "", actual === "web" ? location.pathname : "#recuerdo");
  }

  async function imprimir() {
    const escudo = $("#cartel img");
    if (escudo && escudo.decode) { try { await escudo.decode(); } catch (e) { /* sin escudo */ } }
    const titulo = document.title;
    document.title = CARTELES[actual].archivo;                // nombre que se propone al PDF
    window.addEventListener("afterprint", () => { document.title = titulo; }, { once: true });
    window.print();
  }

  document.addEventListener("DOMContentLoaded", () => {
    ANIV.iniciarTema();
    mostrar(actual);
    $$(".cartel-opcion").forEach((b) => b.addEventListener("click", () => mostrar(b.dataset.cartel)));
    // Flechas entre las dos opciones, como en cualquier grupo de opciones
    $(".cartel-opciones").addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      mostrar(actual === "web" ? "recuerdo" : "web");
      $(`.cartel-opcion[data-cartel="${actual}"]`).focus();
    });
    $("#imprimir-cartel").addEventListener("click", imprimir);
  });
})();
