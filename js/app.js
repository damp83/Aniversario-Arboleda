/* =============================================================================
   APP.JS · Da vida a la web con el contenido de datos.js
   No hace falta tocar este archivo para actualizar la web.
   ============================================================================= */
(function () {
  "use strict";

  if (typeof DATOS === "undefined" || typeof ANIV === "undefined") {
    console.error("No se han cargado datos.js o comun.js");
    return;
  }
  const { $, $$, esc } = ANIV;

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

  /* ─── 5b. Himno: disco, reproductor y letra ─────────────────────────────── */
  const aSegundos = (texto) => {
    const [m, s] = String(texto || "").split(":").map(Number);
    return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : 0;
  };
  const aMinutos = (seg) => {
    const s = Math.max(0, Math.floor(Number(seg) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // Un disco hecho de anillos de árbol, con el título alrededor de la etiqueta
  function discoHimno(titulo) {
    const anillos = Array.from({ length: 13 }, (_, i) => {
      const r = 46 + i * 3.9;
      const cx = 100 + ((i * 37) % 7 - 3) * 0.22;     // anillos algo irregulares,
      const cy = 100 + ((i * 53) % 5 - 2) * 0.22;     // como en la madera
      const rx = r * (1 + ((i % 3) - 1) * 0.012);
      return `<ellipse class="disco__anillo" cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}"
               rx="${rx.toFixed(2)}" ry="${r.toFixed(2)}" style="opacity:${(0.2 + (i % 4) * 0.09).toFixed(2)}"/>`;
    }).join("");
    const vuelta = (2 * Math.PI * 31 - 3).toFixed(1);
    return `<svg viewBox="0 0 200 200" focusable="false">
      <defs><path id="disco-curva" d="M100 69a31 31 0 1 1 0 62a31 31 0 1 1 0-62"/></defs>
      <circle class="disco__fondo" cx="100" cy="100" r="98"/>
      ${anillos}
      <circle class="disco__etiqueta" cx="100" cy="100" r="40"/>
      <text class="disco__texto"><textPath href="#disco-curva" textLength="${vuelta}"
        lengthAdjust="spacing">${esc(`${titulo} · `.toUpperCase())}</textPath></text>
      <text class="disco__cifra" x="100" y="110">${esc(DATOS.aniversario.numero)}</text>
    </svg>`;
  }

  // Estrofas separadas por una línea en blanco. «[Estribillo]» encabeza un
  // bloque destacado; si va solo, marca que se repite.
  const ICONO_REPETIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2.5l3 3-3 3"/><path d="M4 11.5v-1a5 5 0 0 1 5-5h11"/><path d="M7 21.5l-3-3 3-3"/><path d="M20 12.5v1a5 5 0 0 1-5 5H4"/></svg>';

  function letraHimno(texto) {
    const vistos = {};
    return String(texto || "").trim().split(/\n\s*\n/)
      .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
      .filter((b) => b.length)
      .map((lineas) => {
        const marca = lineas[0].match(/^\[(.+)\]$/);
        const eti = marca ? marca[1].trim() : "";
        const versos = marca ? lineas.slice(1) : lineas;
        const clase = /estribillo/i.test(eti) ? " estrofa--estribillo" : "";
        if (eti && !versos.length) {
          const original = vistos[eti.toLowerCase()];
          return `<div class="estrofa estrofa--repite${clase}">
            <p class="estrofa__eti">${ICONO_REPETIR}${esc(eti)}<span class="solo-lector"> (se repite)</span></p>
            ${original ? `<p class="estrofa__eco">${esc(original[0])}…</p>` : ""}
          </div>`;
        }
        if (eti) vistos[eti.toLowerCase()] = versos;
        return `<div class="estrofa${clase}">
          ${eti ? `<p class="estrofa__eti">${esc(eti)}</p>` : ""}
          <p>${versos.map((v) => `<span class="verso">${esc(v)}</span>`).join("")}</p>
        </div>`;
      }).join("");
  }

  function iniciarHimno() {
    const h = DATOS.himno;
    const seccion = $("#himno");
    if (!seccion) return;
    if (!h || !h.archivo) {
      // Sin himno en datos.js: fuera la sección y sus accesos
      seccion.hidden = true;
      $$('a[href="#himno"]').forEach((a) => (a.closest("li") || a).setAttribute("hidden", ""));
      return;
    }

    const audio = $("#himno-audio");
    const boton = $("#himno-play");
    const barra = $("#himno-barra");
    const actual = $("#himno-actual");
    const total = $("#himno-total");
    const aviso = $("#himno-aviso");
    const cuerpo = document.body;

    $("#himno-disco").innerHTML = discoHimno(h.titulo || "Himno");
    $("#himno-letra").innerHTML = letraHimno(h.letra);

    const descarga = $("#himno-descarga");
    descarga.href = h.archivo;
    descarga.setAttribute("download", `${h.titulo || "Himno"} - himno del ${DATOS.aniversario.numero} aniversario.mp3`);
    const creditos = $("#himno-creditos");
    if (h.creditos) { creditos.textContent = h.creditos; creditos.hidden = false; }

    // El reproductor propio sustituye al del navegador
    if (audio.getAttribute("src") !== h.archivo) audio.src = h.archivo;
    audio.controls = false;
    audio.hidden = true;
    $("#himno-controles").hidden = false;

    const duracion = () =>
      Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : aSegundos(h.duracion);
    let arrastrando = false;
    let pendiente = null;      // posición elegida antes de que cargue el audio

    function pintarPosicion(seg) {
      const max = duracion() || 1;
      barra.max = Math.ceil(max);
      barra.value = seg;
      barra.style.setProperty("--progreso", `${Math.min(100, (seg / max) * 100)}%`);
      barra.setAttribute("aria-valuetext", `${aMinutos(seg)} de ${aMinutos(max)}`);
      actual.textContent = aMinutos(seg);
      total.textContent = aMinutos(max);
    }
    pintarPosicion(0);

    function mostrarAviso(texto) {
      aviso.textContent = texto;
      aviso.hidden = !texto;
    }

    function reproducir() {
      mostrarAviso("");
      const promesa = audio.play();
      if (promesa && promesa.catch) promesa.catch((e) => {
        if (e && e.name === "NotSupportedError") {
          mostrarAviso("No se ha podido cargar la canción. Prueba a descargarla.");
        }
      });
    }

    boton.addEventListener("click", () => (audio.paused ? reproducir() : audio.pause()));

    barra.addEventListener("input", () => {
      arrastrando = true;
      pintarPosicion(Number(barra.value));
    });
    barra.addEventListener("change", () => {
      arrastrando = false;
      const seg = Number(barra.value);
      if (audio.readyState >= 1) audio.currentTime = seg;
      else pendiente = seg;
      pintarPosicion(seg);
    });

    audio.addEventListener("loadedmetadata", () => {
      if (pendiente !== null) { audio.currentTime = pendiente; pendiente = null; }
      pintarPosicion(audio.currentTime);
    });
    audio.addEventListener("timeupdate", () => { if (!arrastrando) pintarPosicion(audio.currentTime); });
    audio.addEventListener("play", () => {
      cuerpo.classList.add("sonando-himno");
      boton.setAttribute("aria-label", "Pausar el himno");
      prepararControlesSistema();
    });
    audio.addEventListener("pause", () => {
      cuerpo.classList.remove("sonando-himno");
      seccion.classList.remove("himno--cargando");
      boton.setAttribute("aria-label", "Escuchar el himno");
    });
    audio.addEventListener("ended", () => pintarPosicion(0));
    audio.addEventListener("waiting", () => seccion.classList.add("himno--cargando"));
    audio.addEventListener("playing", () => seccion.classList.remove("himno--cargando"));
    audio.addEventListener("error", () => {
      seccion.classList.remove("himno--cargando");
      mostrarAviso("No se ha podido cargar la canción. Prueba a descargarla.");
    });

    // Controles del móvil (pantalla bloqueada, auriculares, notificaciones)
    let sistemaListo = false;
    function prepararControlesSistema() {
      if (sistemaListo || !("mediaSession" in navigator)) return;
      sistemaListo = true;
      try {
        if (typeof MediaMetadata === "function") {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: h.titulo,
            artist: DATOS.centro.nombre,
            album: `${DATOS.aniversario.numero} aniversario`,
            artwork: [{ src: new URL("assets/icono-180.png", location.href).href, sizes: "180x180", type: "image/png" }]
          });
        }
        const acciones = {
          play: () => reproducir(),
          pause: () => audio.pause(),
          seekbackward: (d) => { audio.currentTime = Math.max(0, audio.currentTime - (d.seekOffset || 10)); },
          seekforward: (d) => { audio.currentTime = Math.min(duracion(), audio.currentTime + (d.seekOffset || 10)); },
          seekto: (d) => { audio.currentTime = d.seekTime; }
        };
        Object.entries(acciones).forEach(([accion, fn]) => {
          try { navigator.mediaSession.setActionHandler(accion, fn); } catch (e) { /* acción no admitida */ }
        });
      } catch (e) { /* sin controles del sistema, el reproductor funciona igual */ }
    }

    // El acceso de la portada lleva a la sección y empieza a sonar
    const acceso = $("#escucha-himno");
    if (acceso) acceso.addEventListener("click", () => { if (audio.paused) reproducir(); });

    // Letra plegada en el móvil
    const letra = $("#letra");
    const desplegar = $("#himno-desplegar");
    desplegar.addEventListener("click", () => {
      const plegada = letra.dataset.plegada === "true";
      letra.dataset.plegada = String(!plegada);
      desplegar.setAttribute("aria-expanded", String(plegada));
      desplegar.textContent = plegada ? "Plegar la letra" : "Ver toda la letra";
      if (!plegada) letra.scrollIntoView({ block: "start" });
    });

    // Imprimir solo la letra, en una hoja con el escudo
    const imprimir = $("#himno-imprimir");
    imprimir.hidden = false;
    imprimir.addEventListener("click", () => {
      const raiz = document.documentElement;
      raiz.classList.add("imprimir-letra");
      window.addEventListener("afterprint", () => raiz.classList.remove("imprimir-letra"), { once: true });
      window.print();
    });
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

  /* ─── 9. Recuerdos: vista previa y enlace al libro de visitas ───────────── */
  const RECUERDOS_PORTADA = 6;    // el resto se lee en el libro de visitas

  function pintarRecuerdos(lista) {
    const cont = $("#recuerdos-lista");
    const vacio = $("#recuerdos-vacio");
    const mas = $("#recuerdos-mas");
    if (!cont) return;

    // Sin recuerdos, la sección invita a abrir el libro y escribir el primero
    const hayRecuerdos = lista.length > 0;
    if (vacio) vacio.hidden = hayRecuerdos;
    if (mas) mas.hidden = !hayRecuerdos;
    if (!hayRecuerdos) {
      cont.replaceChildren();
      const escribir = $("#escribir-recuerdo");
      const voz = (DATOS.participa || []).find((p) => p.icono === "voz");
      const destino = voz && ANIV.destinoParticipa(voz);
      if (escribir && destino) escribir.href = destino;
      return;
    }

    cont.innerHTML = lista.slice(0, RECUERDOS_PORTADA).map((r) => `
      <figure class="recuerdo reveal">
        <blockquote>${esc(r.texto)}</blockquote>
        <figcaption>
          ${r.autor ? `<span class="recuerdo__autor">${esc(r.autor)}</span>` : ""}
          ${r.relacion ? `<span class="recuerdo__rel">${esc(r.relacion)}</span>` : ""}
        </figcaption>
      </figure>`).join("");

    const enlace = $("#abrir-libro");
    if (enlace) {
      const n = lista.length;
      enlace.textContent = `Abrir el libro de visitas · ${n} recuerdo${n === 1 ? "" : "s"}`;
    }
  }

  // Primero los escritos a mano en datos.js (los destacados); después los de
  // la hoja, del más reciente al más antiguo.
  async function cargarRecuerdos() {
    pintarRecuerdos((DATOS.recuerdos || []).filter((r) => r && r.texto));
    const { manuales, deHoja } = await ANIV.obtenerRecuerdos();
    if (!deHoja.length) return;
    pintarRecuerdos([...manuales, ...deHoja.slice().reverse()]);
    $$("#recuerdos .reveal:not(.visible)").forEach((el) => revelar(el));
  }

  /* ─── 10. Participa ──────────────────────────────────────────────────────── */
  const ICONOS = {
    foto: '<rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.6"/><path d="M8 5l1.4-2h5.2L16 5"/>',
    voz:  '<path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M8 11h8M8 15h5"/>',
    mano: '<path d="M12 21a7 7 0 0 0 7-7v-4a1.6 1.6 0 0 0-3.2 0V8a1.6 1.6 0 0 0-3.2 0V6.5a1.6 1.6 0 0 0-3.2 0V14"/><path d="M9.4 14V9.5a1.6 1.6 0 0 0-3.2 0V16"/>',
    sobre: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>'
  };

  function pintarParticipa() {
    const cont = $("#participa-lista");
    if (!cont) return;
    cont.innerHTML = (DATOS.participa || []).map((p) => {
      const destino = ANIV.destinoParticipa(p);
      return `
      <article class="tarjeta reveal">
        <div class="tarjeta__icono">
          <svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[p.icono] || ICONOS.sobre}</svg>
        </div>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.texto)}</p>
        ${p.nota ? `<p class="tarjeta__nota">${esc(p.nota)}</p>` : ""}
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

  /* ─── 13. Aparición al hacer scroll ─────────────────────────────────────── */
  let observadorRevelado = null;

  // Observa un elemento para que aparezca al entrar en pantalla. Sirve también
  // para contenido que llega después de cargar la página (recuerdos de la hoja).
  function revelar(el) {
    if (observadorRevelado) observadorRevelado.observe(el);
    else el.classList.add("visible");
  }

  function iniciarRevelado() {
    if ("IntersectionObserver" in window) {
      observadorRevelado = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada, i) => {
          if (!entrada.isIntersecting) return;
          setTimeout(() => entrada.target.classList.add("visible"), i * 70);
          obs.unobserve(entrada.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $$(".reveal:not(.visible)").forEach(revelar);
  }

  /* ─── Arranque ──────────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    try {
      ANIV.iniciarTema();
      pintarDatos();
      pintarAnillos();
      pintarCifras();
      pintarHitos();
      iniciarHimno();
      pintarPrograma();
      pintarProyectos();
      pintarGaleria();
      cargarRecuerdos();
      pintarParticipa();
      ANIV.pintarCompartir($("#compartir-portada"), {
        texto: `🌳 ${DATOS.aniversario.numero} años del ${DATOS.centro.nombre}. Programa de la semana conmemorativa, historia, fotos y libro de visitas:`
      });
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
