/* =============================================================================
   COMUN.JS · Piezas compartidas por la portada y el libro de visitas
   No hace falta tocar este archivo para actualizar la web.
   ============================================================================= */
const ANIV = (function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (txt) => String(txt ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Quita tildes y mayúsculas: sirve para comparar encabezados y para buscar
  const normalizar = (t) => String(t ?? "").normalize("NFD")
    .replace(/[̀-ͯ]/g, "").trim().toLowerCase();

  /* ─── Recuerdos ─────────────────────────────────────────────────────────── */

  // Lee un CSV respetando comillas, comas y saltos de línea dentro de los campos
  function leerCSV(texto) {
    const filas = [];
    let fila = [], campo = "", entreComillas = false;
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (entreComillas) {
        if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
        else if (c === '"') entreComillas = false;
        else campo += c;
      } else if (c === '"') entreComillas = true;
      else if (c === ",") { fila.push(campo); campo = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && texto[i + 1] === "\n") i++;
        fila.push(campo); filas.push(fila); fila = []; campo = "";
      } else campo += c;
    }
    if (campo || fila.length) { fila.push(campo); filas.push(fila); }
    return filas.filter((f) => f.some((v) => v.trim()));
  }

  // Convierte la hoja publicada en recuerdos, en el orden en que se escribieron.
  // Las columnas se reconocen por su encabezado (texto, autor, relacion y, si
  // existe, fecha), sin importar el orden ni las tildes.
  function recuerdosDesdeHoja(csv) {
    const [cabecera, ...filas] = leerCSV(csv);
    if (!cabecera) return [];
    const col = (nombre) => cabecera.findIndex((h) => normalizar(h) === nombre);
    const [iT, iA, iR, iF] = ["texto", "autor", "relacion", "fecha"].map(col);
    if (iT < 0) return [];
    const campo = (f, i) => (i >= 0 ? (f[i] || "").trim() : "");
    return filas
      .map((f) => ({ texto: campo(f, iT), autor: campo(f, iA), relacion: campo(f, iR), fecha: campo(f, iF) }))
      .filter((r) => r.texto);
  }

  // Los de datos.js por un lado y los de la hoja por otro, en orden de llegada.
  // Si la hoja no responde, se devuelve solo lo de datos.js: la web no se rompe.
  async function obtenerRecuerdos() {
    const manuales = (DATOS.recuerdos || []).filter((r) => r && r.texto);
    const url = (DATOS.aniversario.hojaRecuerdos || "").trim();
    if (!url) return { manuales, deHoja: [] };
    try {
      const resp = await fetch(url, { cache: "no-store" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return { manuales, deHoja: recuerdosDesdeHoja(await resp.text()) };
    } catch (error) {
      console.warn("No se han podido cargar los recuerdos de la hoja:", error);
      return { manuales, deHoja: [] };
    }
  }

  // "2026-10-27" → "27 de octubre de 2026". Cualquier otro formato se ignora,
  // para no mostrar nunca una fecha que se pueda leer al revés.
  function fechaLegible(texto) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto || "");
    if (!m) return "";
    const fecha = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(fecha) ? "" : fecha.toLocaleDateString("es-ES",
      { day: "numeric", month: "long", year: "numeric" });
  }

  /* ─── Participa ─────────────────────────────────────────────────────────── */

  // Adónde lleva cada botón de participación: su enlace (un formulario, por
  // ejemplo) o, si no tiene, un correo al aniversario con asunto y plantilla.
  function destinoParticipa(p) {
    if (p.enlace) return p.enlace;
    const correo = DATOS.aniversario.email || DATOS.centro.email;
    if (!correo) return "";
    const asunto = encodeURIComponent(`${DATOS.aniversario.numero} aniversario · ${p.titulo}`);
    const cuerpo = p.cuerpo ? `&body=${encodeURIComponent(p.cuerpo)}` : "";
    return `mailto:${correo}?subject=${asunto}${cuerpo}`;
  }

  /* ─── Compartir ─────────────────────────────────────────────────────────── */

  // La dirección oficial de la página (la que figura como canónica)
  const direccionOficial = () =>
    document.querySelector('link[rel="canonical"]')?.href || location.href.split(/[?#]/)[0];

  const ICONO_COMPARTIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></svg>';
  const ICONO_WHATSAPP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-3.9A8 8 0 1 1 8 18.9z"/><path d="M9.2 8.6c.3 2.6 2.4 5 5.4 5.9l1.1-1.2-1.8-1-.8.7c-1-.4-2-1.4-2.5-2.5l.7-.8-1-1.8z"/></svg>';
  const ICONO_ENLACE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>';

  // Botones para difundir una página: el menú de compartir del móvil (si lo
  // hay), WhatsApp directamente y copiar el enlace.
  function pintarCompartir(cont, { texto, url = direccionOficial() }) {
    if (!cont) return;
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`;
    cont.innerHTML = `
      ${navigator.share ? `<button class="compartir__btn" type="button" data-accion="nativo">${ICONO_COMPARTIR}<span>Compartir…</span></button>` : ""}
      <a class="compartir__btn compartir__btn--whatsapp" href="${esc(whatsapp)}" target="_blank" rel="noopener">${ICONO_WHATSAPP}<span>WhatsApp</span></a>
      <button class="compartir__btn" type="button" data-accion="copiar">${ICONO_ENLACE}<span>Copiar enlace</span></button>
      <span class="compartir__aviso" role="status" aria-live="polite"></span>`;

    const aviso = $(".compartir__aviso", cont);
    const avisar = (t) => { aviso.textContent = t; clearTimeout(aviso._t); aviso._t = setTimeout(() => { aviso.textContent = ""; }, 3500); };

    cont.addEventListener("click", async (e) => {
      const boton = e.target.closest("[data-accion]");
      if (!boton) return;
      if (boton.dataset.accion === "nativo") {
        try { await navigator.share({ title: document.title, text: texto, url }); } catch (err) { /* cancelado */ }
        return;
      }
      try {
        await navigator.clipboard.writeText(url);
        avisar("Enlace copiado");
      } catch (err) {
        // Sin portapapeles (navegador antiguo o sin permiso): se muestra para copiarlo a mano
        avisar(url);
      }
    });
  }

  /* ─── Modo claro / oscuro ───────────────────────────────────────────────── */
  function iniciarTema() {
    const raiz = document.documentElement;
    const btn = $("#btn-tema");
    let guardado = null;
    try { guardado = localStorage.getItem("tema-aniversario"); } catch (e) { /* sin almacenamiento */ }
    const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

    function aplicar(tema) {
      raiz.dataset.tema = tema;
      if (btn) btn.setAttribute("aria-label", tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.content = tema === "oscuro" ? "#0c1611" : "#12341f";
    }

    aplicar(guardado || (prefiereOscuro ? "oscuro" : "claro"));
    if (!btn) return;
    btn.addEventListener("click", () => {
      const nuevo = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
      aplicar(nuevo);
      try { localStorage.setItem("tema-aniversario", nuevo); } catch (e) { /* sin almacenamiento */ }
    });
  }

  return { $, $$, esc, normalizar, leerCSV, recuerdosDesdeHoja, obtenerRecuerdos,
           fechaLegible, destinoParticipa, iniciarTema, pintarCompartir, direccionOficial };
})();
