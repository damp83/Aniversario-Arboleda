/* =============================================================================
   APP.JS · Da vida a la web con el contenido de datos.js
   No hace falta tocar este archivo para actualizar la web.
   ============================================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (txt) => String(txt ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  if (typeof DATOS === "undefined") {
    console.error("No se ha cargado datos.js");
    return;
  }

  /* ─── 1. Textos enlazados con data-dato ─────────────────────────────────── */
  function pintarDatos() {
    const compuestos = {
      "aniversario.numero-aniversario": `${DATOS.aniversario.numero} aniversario`
    };
    $$("[data-dato]").forEach((el) => {
      const clave = el.dataset.dato;
      let valor = compuestos[clave];
      if (valor === undefined) {
        valor = clave.split(".").reduce((obj, k) => (obj == null ? obj : obj[k]), DATOS);
      }
      if (valor !== undefined && valor !== null && valor !== "") el.textContent = valor;
    });

    document.title = `${DATOS.aniversario.numero} Aniversario · ${DATOS.centro.nombre}`;
  }

  /* ─── 2. Anillos de crecimiento de la portada (uno por año) ─────────────── */
  function pintarAnillos() {
    const cont = $("#anillos");
    if (!cont) return;
    const total = Number(DATOS.aniversario.numero) || 25;
    const partes = [];
    for (let i = total; i >= 1; i--) {
      const rx = 40 + i * 30;
      const ry = rx * (0.60 + (i % 3) * 0.015);   // ligera irregularidad, como en la madera
      const op = (0.14 + (i / total) * 0.42).toFixed(3);
      partes.push(`<ellipse cx="600" cy="330" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" style="opacity:${op}"/>`);
    }
    cont.innerHTML =
      `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${partes.join("")}</svg>`;
  }

  /* ─── 3. Cuenta atrás ───────────────────────────────────────────────────── */
  function iniciarCuentaAtras() {
    const caja = $("#cuenta");
    if (!caja) return;
    const inicio = new Date(DATOS.semana.inicio);
    const fin = new Date(DATOS.semana.fin || DATOS.semana.inicio);
    if (isNaN(inicio)) return;

    const campos = {
      dias: $('[data-reloj="dias"]'),
      horas: $('[data-reloj="horas"]'),
      minutos: $('[data-reloj="minutos"]'),
      segundos: $('[data-reloj="segundos"]')
    };

    function mensaje(texto) {
      caja.classList.add("cuenta--celebrando");
      if (!$(".cuenta__mensaje", caja)) {
        const p = document.createElement("p");
        p.className = "cuenta__mensaje";
        p.textContent = texto;
        caja.appendChild(p);
      }
    }

    function tic() {
      const restante = inicio - Date.now();
      if (restante <= 0) {
        mensaje(Date.now() <= fin.getTime()
          ? "¡Ya estamos celebrándolo!"
          : "Gracias por celebrarlo con nosotros");
        clearInterval(reloj);
        return;
      }
      const s = Math.floor(restante / 1000);
      campos.dias.textContent = Math.floor(s / 86400);
      campos.horas.textContent = String(Math.floor(s / 3600) % 24).padStart(2, "0");
      campos.minutos.textContent = String(Math.floor(s / 60) % 60).padStart(2, "0");
      campos.segundos.textContent = String(s % 60).padStart(2, "0");
    }

    tic();
    const reloj = setInterval(tic, 1000);
  }

  /* ─── 4. Cifras ─────────────────────────────────────────────────────────── */
  function pintarCifras() {
    const cont = $("#cifras");
    if (!cont) return;
    cont.innerHTML = (DATOS.cifras || []).map((c) => `
      <div class="cifra">
        <span class="cifra__valor">${esc(c.valor)}</span>
        <span class="cifra__texto">${esc(c.texto)}</span>
      </div>`).join("");
  }

  /* ─── 5. Línea del tiempo ───────────────────────────────────────────────── */
  function pintarHitos() {
    const cont = $("#tiempo");
    if (!cont) return;
    cont.innerHTML = (DATOS.hitos || []).map((h) => `
      <li class="hito reveal">
        <span class="hito__punto">${esc(h.anio)}</span>
        <h3 class="hito__titulo">${esc(h.titulo)}</h3>
        <p class="hito__texto">${esc(h.texto)}</p>
      </li>`).join("");
  }

  /* ─── 6. Programa de la semana (pestañas por día) ───────────────────────── */
  function pintarPrograma() {
    const dias = $("#programa-dias");
    const paneles = $("#programa-paneles");
    if (!dias || !paneles) return;
    const programa = DATOS.programa || [];

    dias.innerHTML = programa.map((d, i) => `
      <button class="dia" type="button" role="tab" id="dia-${i}"
              aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        <span class="dia__nombre">${esc(d.dia)}</span>
        <span class="dia__lema">${esc(d.lema)}</span>
      </button>`).join("");

    paneles.innerHTML = programa.map((d, i) => `
      <div class="panel" id="panel-${i}" role="tabpanel" aria-labelledby="dia-${i}"
           data-activo="${i === 0}" ${i === 0 ? "" : "hidden"} tabindex="0">
        <p class="panel__resumen">${esc(d.resumen)}</p>
        <div class="actos">
          ${(d.actividades || []).map((a) => `
            <article class="acto">
              <div class="acto__hora">${esc(a.hora)}</div>
              <div>
                <h3 class="acto__titulo">${esc(a.titulo)}</h3>
                <p class="acto__texto">${esc(a.texto)}</p>
                <div class="acto__meta">
                  ${a.lugar ? `<span class="eti eti--lugar">${esc(a.lugar)}</span>` : ""}
                  ${a.publico ? `<span class="eti">${esc(a.publico)}</span>` : ""}
                </div>
              </div>
            </article>`).join("")}
        </div>
      </div>`).join("");

    const botones = $$(".dia", dias);

    function activar(indice, mover = true) {
      botones.forEach((b, i) => {
        const sel = i === indice;
        b.setAttribute("aria-selected", sel);
        b.tabIndex = sel ? 0 : -1;
        const panel = $(`#panel-${i}`);
        panel.dataset.activo = sel;
        panel.hidden = !sel;
      });
      if (mover) botones[indice].focus();
    }

    botones.forEach((b, i) => {
      b.addEventListener("click", () => activar(i, false));
      b.addEventListener("keydown", (e) => {
        const saltos = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: botones.length - 1 - i };
        if (!(e.key in saltos)) return;
        e.preventDefault();
        activar((i + saltos[e.key] + botones.length) % botones.length);
      });
    });

    // Si la semana ya ha empezado, abre el día que toca
    const inicio = new Date(DATOS.semana.inicio);
    if (!isNaN(inicio)) {
      const transcurridos = Math.floor((Date.now() - inicio.getTime()) / 86400000);
      if (transcurridos >= 0 && transcurridos < programa.length) activar(transcurridos, false);
    }
  }

  /* ─── 7. Proyectos del curso ────────────────────────────────────────────── */
  function pintarProyectos() {
    const cont = $("#proyectos-lista");
    if (!cont) return;
    cont.innerHTML = (DATOS.proyectos || []).map((p) => `
      <article class="proyecto reveal">
        <p class="proyecto__eti">${esc(p.etiqueta)}</p>
        <h3 class="proyecto__titulo">${esc(p.titulo)}</h3>
        <p class="proyecto__resumen">${esc(p.resumen)}</p>
        <ul class="proyecto__acciones">
          ${(p.acciones || []).map((a) => `<li>${esc(a)}</li>`).join("")}
        </ul>
        <div class="proyecto__etapas">
          ${(p.etapas || []).map((e) => `<span class="eti">${esc(e)}</span>`).join("")}
        </div>
      </article>`).join("");
  }

  /* ─── 8. Galería y visor ────────────────────────────────────────────────── */
  // Dibuja unos anillos de árbol distintos para cada recuerdo aún sin fotografía
  function marcoIlustrado(anio, indice = 0) {
    const cuantos = 4 + (indice % 4);            // entre 4 y 7 anillos
    const cx = 100 + ((indice % 3) - 1) * 14;    // el corazón del tronco se desplaza
    const cy = 75 + ((indice % 2) ? 5 : -5);
    const anillos = Array.from({ length: cuantos }, (_, i) => {
      const r = 62 - i * (50 / cuantos);
      const rx = r * (1 + (i % 2 ? 0.06 : -0.04));
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx.toFixed(1)}" ry="${r.toFixed(1)}"
               style="opacity:${(0.9 - i * 0.1).toFixed(2)}"/>`;
    }).join("");
    return `<div class="marco" role="img" aria-label="Recuerdo de ${esc(anio)} pendiente de fotografía">
      <svg viewBox="0 0 200 150" aria-hidden="true">${anillos}</svg>
    </div>`;
  }

  function pintarGaleria() {
    const cont = $("#galeria-rejilla");
    if (!cont) return;

    // Si hay fotos reales subidas a assets/galeria/, mandan sobre los ejemplos
    const subidas = typeof GALERIA_AUTO !== "undefined" ? GALERIA_AUTO : [];
    const fotos = subidas.length ? subidas : (DATOS.galeria || []);

    cont.innerHTML = fotos.map((f, i) => `
      <button class="foto reveal" type="button" data-indice="${i}"
              aria-label="Ampliar: ${esc(f.titulo)}${f.anio ? ", " + esc(f.anio) : ""}">
        ${f.src
          ? `<img src="${esc(f.mini || f.src)}" alt="${esc(f.titulo)}" loading="lazy" decoding="async">`
          : marcoIlustrado(f.anio, i)}
        <span class="foto__pie">
          <span class="foto__titulo">${esc(f.titulo)}</span>
          <span class="foto__anio">${esc(f.anio)}</span>
        </span>
      </button>`).join("");

    const visor = $("#visor");
    const medio = $("#visor-medio");
    const pie = $("#visor-pie");
    if (!visor) return;

    cont.addEventListener("click", (e) => {
      const boton = e.target.closest(".foto");
      if (!boton) return;
      const f = fotos[Number(boton.dataset.indice)];
      medio.innerHTML = f.src
        ? `<img src="${esc(f.src)}" alt="${esc(f.titulo)}">`
        : marcoIlustrado(f.anio, Number(boton.dataset.indice));
      pie.textContent = f.anio ? `${f.titulo} · ${f.anio}` : f.titulo;
      if (typeof visor.showModal === "function") visor.showModal();
    });

    $("#visor-cerrar").addEventListener("click", () => visor.close());
    visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
  }

  /* ─── 9. Participa ──────────────────────────────────────────────────────── */
  const ICONOS = {
    foto: '<rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.6"/><path d="M8 5l1.4-2h5.2L16 5"/>',
    voz:  '<path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M8 11h8M8 15h5"/>',
    mano: '<path d="M12 21a7 7 0 0 0 7-7v-4a1.6 1.6 0 0 0-3.2 0V8a1.6 1.6 0 0 0-3.2 0V6.5a1.6 1.6 0 0 0-3.2 0V14"/><path d="M9.4 14V9.5a1.6 1.6 0 0 0-3.2 0V16"/>',
    sobre: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>'
  };

  function pintarParticipa() {
    const cont = $("#participa-lista");
    if (!cont) return;
    const correo = DATOS.centro.email;

    cont.innerHTML = (DATOS.participa || []).map((p) => {
      const destino = p.enlace || (correo ? `mailto:${correo}?subject=${encodeURIComponent(p.titulo)}` : "");
      return `
      <article class="tarjeta reveal">
        <div class="tarjeta__icono">
          <svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[p.icono] || ICONOS.sobre}</svg>
        </div>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.texto)}</p>
        ${destino ? `<a class="tarjeta__enlace" href="${esc(destino)}">${esc(p.textoEnlace || "Saber más")}</a>` : ""}
      </article>`;
    }).join("");
  }

  /* ─── 10. Pie: contacto y cápsula del tiempo ────────────────────────────── */
  function pintarPie() {
    const lista = $("#pie-contacto");
    if (lista) {
      const c = DATOS.centro;
      const filas = [];
      if (c.email) filas.push(`<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`);
      if (c.telefono) filas.push(`<li><a href="tel:${esc(c.telefono.replace(/\s/g, ""))}">${esc(c.telefono)}</a></li>`);
      if (c.direccion) filas.push(`<li>${esc(c.direccion)}</li>`);
      if (c.web) filas.push(`<li><a href="${esc(c.web)}" rel="noopener">Web del centro</a></li>`);
      lista.innerHTML = filas.join("");
    }

    const capsula = $("#anio-capsula");
    if (capsula) {
      const base = Number(DATOS.aniversario.anioFundacion);
      if (!isNaN(base)) capsula.textContent = base + 50;
    }
  }

  /* ─── 11. Navegación: menú, cabecera fija y sección activa ──────────────── */
  function iniciarNavegacion() {
    const cabecera = $("#cabecera");
    const nav = $("#nav");
    const btnMenu = $("#btn-menu");

    const alHacerScroll = () => cabecera.classList.toggle("cabecera--fija", window.scrollY > 20);
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });

    function cerrarMenu() {
      nav.classList.remove("abierto");
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.setAttribute("aria-label", "Abrir menú");
    }

    btnMenu.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", String(abierto));
      btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    $$("#nav a").forEach((a) => a.addEventListener("click", cerrarMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

    // Marca en el menú la sección que se está viendo
    const enlaces = $$("#nav a[href^='#']");
    const secciones = enlaces
      .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);

    if ("IntersectionObserver" in window && secciones.length) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          enlaces.forEach((a) =>
            a.classList.toggle("activo", a.getAttribute("href") === `#${entrada.target.id}`));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      secciones.forEach((s) => observador.observe(s));
    }
  }

  /* ─── 12. Modo claro / oscuro ───────────────────────────────────────────── */
  function iniciarTema() {
    const raiz = document.documentElement;
    const btn = $("#btn-tema");
    const guardado = localStorage.getItem("tema-aniversario");
    const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

    function aplicar(tema) {
      raiz.dataset.tema = tema;
      btn.setAttribute("aria-label", tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.content = tema === "oscuro" ? "#0c1611" : "#12341f";
    }

    aplicar(guardado || (prefiereOscuro ? "oscuro" : "claro"));

    btn.addEventListener("click", () => {
      const nuevo = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
      aplicar(nuevo);
      localStorage.setItem("tema-aniversario", nuevo);
    });
  }

  /* ─── 13. Aparición al hacer scroll ─────────────────────────────────────── */
  function iniciarRevelado() {
    const elementos = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada, i) => {
        if (!entrada.isIntersecting) return;
        setTimeout(() => entrada.target.classList.add("visible"), i * 70);
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    elementos.forEach((el) => observador.observe(el));

  }

  /* ─── Arranque ──────────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    try {
      iniciarTema();
      pintarDatos();
      pintarAnillos();
      pintarCifras();
      pintarHitos();
      pintarPrograma();
      pintarProyectos();
      pintarGaleria();
      pintarParticipa();
      pintarPie();
      iniciarCuentaAtras();
      iniciarNavegacion();
      iniciarRevelado();
    } catch (error) {
      console.error("Error al construir la página:", error);
      // Si algo falla, mostramos todo el contenido: nunca una página en blanco.
      $$(".reveal").forEach((el) => el.classList.add("visible"));
    }
  });
})();
