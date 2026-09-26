/* =============================================================================
   LIBRO.JS · El libro de visitas (recuerdos.html)
   Lee los mismos recuerdos que la portada: los de datos.js y, si está
   configurada, la hoja del formulario. No hace falta tocar este archivo.

   Cómo está hecho: el libro es una lista de "caras" (tapa, guardas, portadilla,
   páginas de recuerdos, cierre, contratapa). En pantalla ancha se ven de dos en
   dos, como un libro abierto; en el móvil, de una en una. Al pasar página, una
   hoja volante con la cara de delante y la de detrás gira sobre el lomo.
   ============================================================================= */
(function () {
  "use strict";
  if (typeof DATOS === "undefined" || typeof ANIV === "undefined") return;
  const { $, esc, normalizar, fechaLegible } = ANIV;

  const mqDoble = window.matchMedia("(min-width: 820px)");
  const mqQuieto = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DURACION = 850;                                  // igual que en libro.css

  const ui = {
    escenario: $("#escenario"), libro: $("#libro"), izq: $("#lado-izq"), der: $("#lado-der"),
    sonda: $("#sonda"), anterior: $("#anterior"), siguiente: $("#siguiente"),
    posicion: $("#posicion"), progreso: $("#progreso"), paso: $("#paso"), ayuda: $("#ayuda"),
    buscar: $("#buscar"), estadoBusqueda: $("#estado-busqueda"),
    modoLista: $("#modo-lista"), lista: $("#lista"), escribir: $("#escribir"),
    imprimir: $("#imprimir"), imprimirTexto: $("#imprimir-texto"), impresion: $("#impresion")
  };

  const participar = (DATOS.participa || []).find((p) => p.icono === "voz") || {};
  const destinoEscribir = ANIV.destinoParticipa(participar);
  const anioInicio = Number(DATOS.aniversario.anioFundacion) || 2001;
  const anioFin = anioInicio + (Number(DATOS.aniversario.numero) || 25);

  let todos = [];          // todos los recuerdos publicados
  let visibles = [];       // los que pasan la búsqueda
  let caras = [{ tipo: "portada" }];
  let modo = "doble";      // "doble": libro abierto · "simple": una página
  let estado = 0;          // doble: nº de pliego · simple: nº de cara
  let animando = false, cargando = true, consulta = "", clave = "", pendiente = null;

  const esperar = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ─── Piezas ────────────────────────────────────────────────────────────── */

  const anillos = (n, clase) =>
    `<svg class="${clase}" viewBox="0 0 100 100" aria-hidden="true">` +
    Array.from({ length: n }, (_, i) => `<circle cx="50" cy="50" r="${(47 - i * (40 / n)).toFixed(1)}"/>`).join("") +
    `<circle class="nucleo" cx="50" cy="50" r="3.2"/></svg>`;

  function crearEntrada(r) {
    const fig = document.createElement("figure");
    fig.className = "entrada" + (r.apretada ? " entrada--apretada" : "");
    const meta = [r.relacion, fechaLegible(r.fecha)].filter(Boolean).join(" · ");
    fig.innerHTML = `<p class="entrada__texto">${esc(r.texto)}</p>` +
      (r.autor || meta
        ? `<figcaption>${r.autor ? `<span class="entrada__firma">${esc(r.autor)}</span>` : ""}` +
          `${meta ? `<span class="entrada__meta">${esc(meta)}</span>` : ""}</figcaption>`
        : "");
    return fig;
  }

  const CON_NUMERO = ["entradas", "final", "sinresultados"];
  const numero = (i) => i - 2;                    // la primera página tras la portadilla es la 1
  const lado = (i) => (modo === "doble" ? (i % 2 ? "izq" : "der") : "der");

  function crearCara(cara, i, ladoCara) {
    const hoja = document.createElement("div");
    hoja.className = `folio folio--${cara.tipo} folio--${ladoCara}`;
    const cabeza = `<div class="folio__cabeza">Libro de visitas</div>`;
    const pie = `<div class="folio__pie">${CON_NUMERO.includes(cara.tipo) && i >= 0 ? numero(i) : ""}</div>`;
    const botonEscribir = destinoEscribir
      ? `<a class="cierre__boton" href="${esc(destinoEscribir)}">${esc(participar.textoEnlace || "Escribir mi recuerdo")}</a>` : "";

    switch (cara.tipo) {
      case "portada":
        hoja.innerHTML = `
          <div class="tapa">
            ${anillos(6, "tapa__anillos")}
            <p class="tapa__super">${esc(DATOS.centro.nombre)}</p>
            <p class="tapa__cifra">${esc(DATOS.aniversario.numero)}</p>
            <p class="tapa__titulo">Libro de visitas</p>
            <p class="tapa__fechas">${anioInicio} · ${anioFin}</p>
          </div>
          <span class="tapa__abrir">Pulsa para abrir</span>`;
        break;

      case "contraportada":
        hoja.innerHTML = `
          <div class="contratapa">
            ${anillos(4, "tapa__anillos")}
            <p>${esc(DATOS.centro.nombre)}<br>${esc(DATOS.centro.localidad || "")}</p>
          </div>`;
        break;

      case "guarda":
      case "blanca":
        break;

      case "titulo": {
        const total = todos.length;
        const cuenta = !total ? "Todavía sin recuerdos"
          : consulta ? `${visibles.length} de ${total} recuerdos`
          : `${total} recuerdo${total === 1 ? "" : "s"}`;
        hoja.innerHTML = `
          <img class="portadilla__escudo" src="assets/escudo.png" alt="" width="180" height="200">
          <p class="portadilla__titulo">Libro de visitas</p>
          <p class="portadilla__sub">${esc(DATOS.aniversario.numero)} aniversario<br>${esc(DATOS.centro.nombre)}</p>
          <span class="portadilla__raya" aria-hidden="true"></span>
          <p class="portadilla__texto">Aquí quedan escritos los recuerdos de quienes han pasado por el colegio entre ${anioInicio} y ${anioFin}.</p>
          <p class="portadilla__cuenta">${esc(cuenta)}</p>`;
        break;
      }

      case "entradas": {
        hoja.innerHTML = `${cabeza}<div class="folio__cuerpo"></div>${pie}`;
        const cuerpo = hoja.querySelector(".folio__cuerpo");
        cara.entradas.forEach((r) => cuerpo.appendChild(crearEntrada(r)));
        break;
      }

      case "sinresultados":
        hoja.innerHTML = `${cabeza}
          <div class="folio__cuerpo">
            <p class="cierre__titulo">Nada por aquí</p>
            <p class="cierre__texto">Ningún recuerdo contiene «${esc(consulta)}». Prueba con otro nombre o con el año de la promoción.</p>
            <button class="cierre__boton" type="button" data-accion="limpiar">Ver todos los recuerdos</button>
          </div>${pie}`;
        break;

      case "final":
        hoja.innerHTML = `${cabeza}
          <div class="folio__cuerpo">
            ${anillos(3, "cierre__anillos")}
            <p class="cierre__titulo">${todos.length ? "Tu recuerdo también cabe aquí" : "Este libro acaba de abrirse"}</p>
            <p class="cierre__texto">${todos.length
              ? "El libro sigue abierto durante todo el curso. Escribe el tuyo y, en cuanto lo revisemos, se añadirá a estas páginas."
              : "Todavía no hay recuerdos publicados. El primero puede ser el tuyo."}</p>
            ${botonEscribir}
            ${participar.nota ? `<p class="cierre__nota">${esc(participar.nota)}</p>` : ""}
          </div>${pie}`;
        break;
    }
    return hoja;
  }

  /* ─── Reparto en páginas ────────────────────────────────────────────────── */

  // Coloca los recuerdos uno a uno en una página invisible del tamaño real y
  // salta a la siguiente cuando ya no caben. Así ningún recuerdo queda cortado.
  function paginar(lista) {
    const medidor = crearCara({ tipo: "entradas", entradas: [] }, -1, "der");
    medidor.classList.add("folio--medidor");
    medidor.setAttribute("aria-hidden", "true");
    ui.escenario.appendChild(medidor);
    const cuerpo = medidor.querySelector(".folio__cuerpo");
    const desborda = () => cuerpo.scrollHeight > cuerpo.clientHeight + 1;

    const paginas = [];
    let actual = [];
    for (const r of lista) {
      r.apretada = false;
      cuerpo.appendChild(crearEntrada(r));
      if (desborda() && actual.length) {
        paginas.push(actual);
        actual = [];
        cuerpo.replaceChildren(crearEntrada(r));
      }
      if (desborda()) {                              // no cabe ni sola: letra algo menor
        r.apretada = true;
        cuerpo.replaceChildren(crearEntrada(r));
      }
      actual.push(r);
    }
    if (actual.length) paginas.push(actual);
    medidor.remove();
    return paginas;
  }

  const claveTamano = () => `${mqDoble.matches ? "d" : "s"}${Math.round(ui.sonda.getBoundingClientRect().width)}`;
  const ultimo = () => (modo === "doble" ? Math.floor(caras.length / 2) : caras.length - 1);
  const carasEnVista = () => (modo === "doble"
    ? [2 * estado - 1, 2 * estado] : [estado]).filter((i) => i >= 0 && i < caras.length);

  // Dónde está el lector, de forma que sobreviva a un nuevo reparto de páginas
  function posicionActual() {
    for (const i of carasEnVista()) {
      const c = caras[i];
      if (c.entradas && c.entradas.length) return { id: c.entradas[0].id };
    }
    const i = carasEnVista().slice(-1)[0] ?? 0;
    return i <= 2 ? { cara: i } : { desdeFinal: caras.length - 1 - i };
  }

  function construir(pos = { cara: 0 }) {
    if (animando) { pendiente = pos; return; }
    if (ui.escenario.hidden) return;
    modo = mqDoble.matches ? "doble" : "simple";
    ui.escenario.dataset.modo = modo;

    caras = [{ tipo: "portada" }, { tipo: "guarda" }, { tipo: "titulo" }];
    if (consulta && !visibles.length) caras.push({ tipo: "sinresultados" });
    paginar(visibles).forEach((entradas) => caras.push({ tipo: "entradas", entradas }));
    caras.push({ tipo: "final" });
    if ((caras.length - 2) % 2) caras.push({ tipo: "blanca" });   // la guarda final va a la derecha
    caras.push({ tipo: "guarda" }, { tipo: "contraportada" });
    clave = claveTamano();

    let i = 0;
    if (pos.id != null) i = Math.max(0, caras.findIndex((c) => c.entradas && c.entradas.some((r) => r.id === pos.id)));
    else if (pos.desdeFinal != null) i = caras.length - 1 - pos.desdeFinal;
    else i = pos.cara || 0;
    i = Math.max(0, Math.min(i, caras.length - 1));
    estado = modo === "doble" ? Math.ceil(i / 2) : i;
    pintar();
  }

  /* ─── Pintar lo que se ve ───────────────────────────────────────────────── */

  function colocar(hueco, i) {
    hueco.replaceChildren();
    if (i == null || i < 0 || i >= caras.length) return;
    hueco.appendChild(crearCara(caras[i], i, lado(i)));
  }

  function cerrarSegun(s) {
    ui.libro.classList.toggle("libro--portada", modo === "doble" && s === 0);
    ui.libro.classList.toggle("libro--contraportada", modo === "doble" && !cargando && s === ultimo());
  }

  function pintar() {
    if (modo === "doble") {
      colocar(ui.izq, estado > 0 ? 2 * estado - 1 : null);
      colocar(ui.der, 2 * estado);
    } else {
      ui.izq.replaceChildren();
      colocar(ui.der, estado);
    }
    cerrarSegun(estado);
    actualizarControles();
  }

  const NOMBRES = { portada: "Portada", guarda: "Guardas", titulo: "Portadilla", blanca: "Guardas", contraportada: "Contraportada" };

  function actualizarControles() {
    const fin = ultimo();
    ui.anterior.disabled = cargando || estado <= 0;
    ui.siguiente.disabled = cargando || estado >= fin;
    if (cargando) { ui.posicion.textContent = "Abriendo el libro…"; return; }

    const total = caras.reduce((m, c, i) => (CON_NUMERO.includes(c.tipo) ? numero(i) : m), 0);
    const enVista = carasEnVista();
    const nums = enVista.filter((i) => CON_NUMERO.includes(caras[i].tipo)).map(numero);
    ui.posicion.textContent = nums.length === 2 ? `Páginas ${nums[0]} y ${nums[1]} de ${total}`
      : nums.length === 1 ? `Página ${nums[0]} de ${total}`
      : NOMBRES[caras[enVista[enVista.length - 1]]?.tipo] || "";
    ui.progreso.style.width = `${fin ? (estado / fin) * 100 : 0}%`;
  }

  /* ─── Pasar página ──────────────────────────────────────────────────────── */

  function crearVolante(ladoVolante, iFrente, iDorso) {
    const volante = document.createElement("div");
    volante.className = `volante volante--${ladoVolante}`;
    volante.setAttribute("aria-hidden", "true");
    const cara = (i, clase, ladoCara) => {
      const envoltura = document.createElement("div");
      envoltura.className = `volante__cara volante__cara--${clase}`;
      envoltura.appendChild(i != null && i >= 0 && i < caras.length
        ? crearCara(caras[i], i, ladoCara)
        : crearCara({ tipo: "blanca" }, -1, ladoCara));
      return envoltura;
    };
    volante.append(
      cara(iFrente, "frente", modo === "doble" ? lado(iFrente) : "der"),
      cara(iDorso, "dorso", modo === "doble" ? lado(iDorso) : "izq"));
    return volante;
  }

  function girar(el, destino) {
    return new Promise((listo) => {
      let hecho = false;
      const fin = () => { if (!hecho) { hecho = true; listo(); } };
      el.getBoundingClientRect();                   // fija la posición de partida
      el.style.transition = "";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.addEventListener("transitionend", (e) => { if (e.target === el) fin(); });
        el.style.transform = destino;
        setTimeout(fin, DURACION + 250);           // por si el navegador no avisa
      }));
    });
  }

  // Si el libro no se ve entero, la página se desplaza para centrarlo
  function asegurarVista() {
    const r = ui.escenario.getBoundingClientRect();
    const cabecera = document.querySelector(".cabecera")?.offsetHeight || 0;
    if (r.top < cabecera || r.bottom > window.innerHeight) {
      ui.escenario.scrollIntoView({ block: "center", behavior: mqQuieto.matches ? "auto" : "smooth" });
    }
  }

  async function pasar(dir) {
    if (animando || cargando) return;
    const destino = estado + dir;
    if (destino < 0 || destino > ultimo()) return;
    asegurarVista();
    if (mqQuieto.matches) { estado = destino; pintar(); return; }

    animando = true;
    try {
      const s = estado;
      let volante;
      if (modo === "doble" && dir > 0) {
        volante = crearVolante("der", 2 * s, 2 * s + 1);        // la hoja derecha gira a la izquierda
        colocar(ui.der, 2 * destino);
      } else if (modo === "doble") {
        volante = crearVolante("izq", 2 * s - 1, 2 * s - 2);    // la hoja izquierda vuelve a la derecha
        colocar(ui.izq, destino > 0 ? 2 * destino - 1 : null);
      } else if (dir > 0) {
        volante = crearVolante("der", s, null);                 // en el móvil, la página se levanta
        colocar(ui.der, destino);
      } else {
        volante = crearVolante("der", destino, null);           // y la anterior vuelve a posarse
        volante.style.transition = "none";
        volante.style.transform = "rotateY(-180deg)";
      }
      ui.libro.appendChild(volante);
      cerrarSegun(destino);
      const giro = modo === "doble"
        ? (dir > 0 ? "rotateY(-180deg)" : "rotateY(180deg)")
        : (dir > 0 ? "rotateY(-180deg)" : "rotateY(0deg)");
      await girar(volante, giro);
      volante.remove();
    } finally {
      estado = destino;
      animando = false;
      pintar();
      if (pendiente) { const p = pendiente; pendiente = null; construir(p); }
    }
  }

  function irA(i) {
    if (animando || cargando) return;
    i = Math.max(0, Math.min(i, caras.length - 1));
    estado = modo === "doble" ? Math.ceil(i / 2) : i;
    asegurarVista();
    pintar();
  }

  /* ─── Búsqueda y lectura seguida ────────────────────────────────────────── */

  function filtrar() {
    const q = normalizar(consulta);
    visibles = q ? todos.filter((r) => r.busqueda.includes(q)) : todos.slice();
  }

  function pintarLista() {
    const papel = ui.lista.querySelector(".lista__papel");
    papel.replaceChildren();
    if (!visibles.length) {
      papel.innerHTML = `<p class="lista__vacia">${consulta
        ? `Ningún recuerdo contiene «${esc(consulta)}».` : "Todavía no hay recuerdos publicados."}</p>`;
      return;
    }
    visibles.forEach((r) => papel.appendChild(crearEntrada({ ...r, apretada: false })));
  }

  function aplicarBusqueda() {
    consulta = ui.buscar.value.trim();
    filtrar();
    const n = visibles.length;
    ui.estadoBusqueda.textContent = !consulta ? ""
      : n ? `${n} recuerdo${n === 1 ? "" : "s"} con «${consulta}»`
      : `Ningún recuerdo contiene «${consulta}»`;
    if (!ui.lista.hidden) pintarLista();
    actualizarImprimir();
    // Con búsqueda, directos a la primera página de resultados; sin ella, a la portadilla
    construir({ cara: consulta ? 3 : 2 });
  }

  function alternarLista() {
    const enLista = ui.modoLista.getAttribute("aria-pressed") !== "true";
    ui.modoLista.setAttribute("aria-pressed", String(enLista));
    ui.modoLista.textContent = enLista ? "Ver como libro" : "Leer todo seguido";
    ui.lista.hidden = !enLista;
    ui.escenario.hidden = ui.paso.hidden = ui.ayuda.hidden = enLista;
    if (enLista) pintarLista();
    else construir(posicionActual());
  }

  /* ─── Imprimir o guardar en PDF ─────────────────────────────────────────── */

  // Un libro maquetado para papel, no una foto de la pantalla: tapa, portadilla,
  // los recuerdos a dos columnas y un colofón. Incluye los que se están viendo:
  // todos, o solo los de la búsqueda si hay una activa (y la portadilla lo dice).
  function pintarImpresion() {
    if (!ui.impresion) return;
    const total = todos.length;
    const hoy = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    const cuenta = !total ? "Todavía sin recuerdos"
      : consulta ? `${visibles.length} de ${total} recuerdos`
      : `${total} recuerdo${total === 1 ? "" : "s"}`;
    // La dirección oficial de la página, aunque se imprima desde una copia local
    const direccion = document.querySelector('link[rel="canonical"]')?.href || location.href.split(/[?#]/)[0];

    ui.impresion.innerHTML = `
      <section class="imp-portada">
        <div class="tapa">
          ${anillos(6, "tapa__anillos")}
          <p class="tapa__super">${esc(DATOS.centro.nombre)}</p>
          <p class="tapa__cifra">${esc(DATOS.aniversario.numero)}</p>
          <p class="tapa__titulo">Libro de visitas</p>
          <p class="tapa__fechas">${anioInicio} · ${anioFin}</p>
        </div>
      </section>

      <section class="imp-portadilla">
        <img class="portadilla__escudo" src="assets/escudo.png" alt="" width="180" height="200">
        <p class="portadilla__titulo">Libro de visitas</p>
        <p class="portadilla__sub">${esc(DATOS.aniversario.numero)} aniversario<br>${esc(DATOS.centro.nombre)}</p>
        <span class="portadilla__raya"></span>
        <p class="portadilla__texto">Aquí quedan escritos los recuerdos de quienes han pasado por el colegio entre ${anioInicio} y ${anioFin}.</p>
        <p class="portadilla__cuenta">${esc(cuenta)}</p>
        ${consulta ? `<p class="imp-nota">Selección de los recuerdos que contienen «${esc(consulta)}»</p>` : ""}
      </section>

      <section class="imp-recuerdos"></section>

      <section class="imp-colofon">
        ${anillos(3, "cierre__anillos")}
        <p class="cierre__titulo">Este libro sigue abierto</p>
        <p class="cierre__texto">Durante todo el curso ${esc(DATOS.centro.curso || "")} se siguen añadiendo recuerdos.
          Puedes leerlos, y dejar el tuyo, en la web del aniversario.</p>
        <p class="imp-direccion">${esc(direccion)}</p>
        <p class="imp-edicion">Edición del ${esc(hoy)}<br>${esc(DATOS.centro.nombre)} · ${esc(DATOS.centro.localidad || "")}</p>
      </section>`;

    const lista = ui.impresion.querySelector(".imp-recuerdos");
    if (!visibles.length) lista.remove();
    else visibles.forEach((r) => lista.appendChild(crearEntrada({ ...r, apretada: false })));
  }

  async function imprimir() {
    pintarImpresion();
    // El escudo tiene que estar cargado antes de abrir el diálogo, o saldría en blanco
    const escudo = ui.impresion.querySelector("img");
    if (escudo && escudo.decode) { try { await escudo.decode(); } catch (e) { /* se imprime sin él */ } }

    // El título de la página es el nombre que el navegador propone para el PDF
    const titulo = document.title;
    document.title = consulta
      ? `Libro de visitas - ${consulta.replace(/[\\/:*?"<>|]/g, "")}`
      : "Libro de visitas del 25 aniversario - CEIP La Arboleda";
    window.addEventListener("afterprint", () => { document.title = titulo; }, { once: true });
    window.print();
  }

  function actualizarImprimir() {
    if (!ui.imprimir) return;
    ui.imprimir.disabled = cargando || !visibles.length;
    ui.imprimir.title = !visibles.length && !cargando
      ? (consulta ? "No hay recuerdos en esta búsqueda que imprimir" : "Todavía no hay recuerdos que imprimir")
      : "Abre la ventana de impresión. Para obtener el PDF, elige «Guardar como PDF» como impresora.";
    ui.imprimirTexto.textContent = consulta ? "PDF de la búsqueda" : "PDF";
    ui.imprimir.setAttribute("aria-label", consulta
      ? "Imprimir o guardar en PDF los recuerdos de la búsqueda"
      : "Imprimir o guardar en PDF el libro de visitas");
  }

  /* ─── Eventos ───────────────────────────────────────────────────────────── */

  function escuchar() {
    ui.anterior.addEventListener("click", () => pasar(-1));
    ui.siguiente.addEventListener("click", () => pasar(1));
    ui.buscar.addEventListener("input", esperar(aplicarBusqueda, 250));
    ui.modoLista.addEventListener("click", alternarLista);

    // Pulsar sobre la hoja: la derecha avanza, la izquierda retrocede
    let toque = null, ignorarClic = false;
    ui.escenario.addEventListener("pointerdown", (e) => {
      toque = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
    });
    ui.escenario.addEventListener("pointerup", (e) => {
      if (!toque) return;
      const dx = e.clientX - toque.x, dy = e.clientY - toque.y;
      toque = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {   // deslizar el dedo
        ignorarClic = true;
        setTimeout(() => { ignorarClic = false; }, 450);
        pasar(dx < 0 ? 1 : -1);
      }
    });
    ui.escenario.addEventListener("click", (e) => {
      const accion = e.target.closest("[data-accion='limpiar']");
      if (accion) { ui.buscar.value = ""; aplicarBusqueda(); ui.buscar.focus(); return; }
      if (ignorarClic || e.target.closest("a, button, input")) return;
      if (modo === "doble") {
        if (e.target.closest("#lado-der")) pasar(1);
        else if (e.target.closest("#lado-izq")) pasar(-1);
      } else if (e.target.closest("#lado-der")) {
        const r = ui.der.getBoundingClientRect();
        pasar(e.clientX > r.left + r.width * 0.35 ? 1 : -1);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (ui.escenario.hidden || e.target.closest("input, textarea, select")) return;
      const enLibro = ui.escenario.contains(document.activeElement) || ui.paso.contains(document.activeElement);
      const teclas = {
        ArrowRight: () => pasar(1), ArrowLeft: () => pasar(-1),
        PageDown: enLibro && (() => pasar(1)), PageUp: enLibro && (() => pasar(-1)),
        Home: enLibro && (() => irA(0)), End: enLibro && (() => irA(caras.length - 1))
      };
      if (teclas[e.key]) { e.preventDefault(); teclas[e.key](); }
    });

    window.addEventListener("resize", esperar(() => {
      if (!cargando && !ui.escenario.hidden && claveTamano() !== clave) construir(posicionActual());
    }, 200));
    ui.imprimir.addEventListener("click", imprimir);
    window.addEventListener("beforeprint", pintarImpresion);     // también con Ctrl+P
  }

  /* ─── Arranque ──────────────────────────────────────────────────────────── */

  // Las medidas dependen de las tipografías: se espera a que carguen (con límite)
  function tipografias() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const cargas = Promise.all([
      document.fonts.load(`400 17px "Fraunces"`),
      document.fonts.load(`600 24px "Caveat"`)
    ]).catch(() => {});
    return Promise.race([cargas, new Promise((ok) => setTimeout(ok, 2500))]);
  }

  async function iniciar() {
    ANIV.iniciarTema();
    if (destinoEscribir) ui.escribir.href = destinoEscribir;
    else ui.escribir.hidden = true;

    modo = mqDoble.matches ? "doble" : "simple";
    ui.escenario.dataset.modo = modo;
    pintar();                                        // la tapa, mientras se cargan los recuerdos
    ANIV.pintarCompartir($("#compartir-libro"), {
      texto: `📖 ¿Estudiaste, trabajaste o llevaste a tus hijos al ${DATOS.centro.nombre}? Deja tu recuerdo en el libro de visitas del ${DATOS.aniversario.numero} aniversario:`
    });
    actualizarImprimir();
    escuchar();

    const [{ manuales, deHoja }] = await Promise.all([ANIV.obtenerRecuerdos(), tipografias()]);
    todos = [...manuales, ...deHoja].map((r, id) => ({
      ...r, id, busqueda: normalizar([r.texto, r.autor, r.relacion].join(" "))
    }));
    filtrar();
    cargando = false;
    actualizarImprimir();
    construir({ cara: 0 });

    // Si alguna tipografía llega tarde, se reparte de nuevo sin perder el sitio
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!ui.escenario.hidden) construir(posicionActual()); });
    }
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
