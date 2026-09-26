/* =============================================================================
   ALBUM.JS · El álbum de fotos (album.html)
   Usa las mismas fotos que la galería de la portada: las que se suben a
   assets/galeria/ (js/galeria.js se genera solo). No hace falta tocar este archivo.

   Se hojea igual que el libro de visitas (el mismo mecanismo que libro.js):
   una lista de "caras" (tapa, guardas, portadilla, páginas de fotos, cierre,
   contratapa), a doble página en pantalla ancha y de una en una en el móvil.
   Cada año empieza en una página nueva. Una foto por página, para que se vea
   grande; a doble página, dos verticales comparten página, una junto a otra.
   ============================================================================= */
(function () {
  "use strict";
  if (typeof DATOS === "undefined" || typeof ANIV === "undefined") return;
  const { $, esc, marcoIlustrado } = ANIV;

  const mqDoble = window.matchMedia("(min-width: 820px)");
  const mqQuieto = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DURACION = 850;                                  // igual que en libro.css

  const ui = {
    escenario: $("#escenario"), libro: $("#libro"), izq: $("#lado-izq"), der: $("#lado-der"),
    anterior: $("#anterior"), siguiente: $("#siguiente"), posicion: $("#posicion"),
    progreso: $("#progreso"), paso: $("#paso"), ayuda: $("#ayuda"), estado: $("#estado"),
    irAnio: $("#ir-anio"), modoRejilla: $("#modo-rejilla"), rejilla: $("#rejilla"),
    enviar: $("#enviar"), abrirPase: $("#abrir-pase"),
    visor: $("#visor"), visorMedio: $("#visor-medio"), visorPie: $("#visor-pie"),
    visorCuenta: $("#visor-cuenta"), visorAnt: $("#visor-ant"), visorSig: $("#visor-sig"),
    pase: $("#pase"), paseCapas: [...document.querySelectorAll(".pase__capa")],
    paseRotulo: $("#pase-rotulo"), paseProgreso: $("#pase-progreso"), pasePlay: $("#pase-play"),
    paseMusica: $("#pase-musica")
  };

  const participar = (DATOS.participa || []).find((p) => p.icono === "foto") || {};
  const destinoEnviar = ANIV.destinoParticipa(participar);
  const anioInicio = Number(DATOS.aniversario.anioFundacion) || 2001;
  const anioFin = anioInicio + (Number(DATOS.aniversario.numero) || 25);
  const OTROS = "Otros recuerdos";                      // las fotos sin año, al final

  // Todas las fotos en orden cronológico, numeradas; las que no tienen año, al final
  const { fotos: originales, reales } = ANIV.fotosGaleria();
  const lista = originales
    .map((f, orden) => ({ ...f, orden }))
    .sort((a, b) => (a.anio || "9999").localeCompare(b.anio || "9999") || a.orden - b.orden)
    .map((f, n) => ({ ...f, n }));

  // Agrupadas por año
  const grupos = [];
  lista.forEach((f) => {
    let g = grupos[grupos.length - 1];
    if (!g || g.anio !== (f.anio || "")) {
      g = { anio: f.anio || "", etiqueta: f.anio || OTROS, clave: f.anio || "otros", fotos: [] };
      grupos.push(g);
    }
    g.fotos.push(f);
  });

  const etiquetaFoto = (f) => (f.anio ? `${f.titulo} · ${f.anio}` : f.titulo);
  const proporcion = (f) => (f.ancho && f.alto ? f.ancho / f.alto : f.medida || 4 / 3);
  const cuantas = (n) => `${n} foto${n === 1 ? "" : "s"}`;

  let caras = [{ tipo: "portada" }];
  let modo = "doble";      // "doble": álbum abierto · "simple": una página
  let estado = 0;          // doble: nº de pliego · simple: nº de cara
  let animando = false, pendiente = null;

  const anillos = (n, clase) =>
    `<svg class="${clase}" viewBox="0 0 100 100" aria-hidden="true">` +
    Array.from({ length: n }, (_, i) => `<circle cx="50" cy="50" r="${(47 - i * (40 / n)).toFixed(1)}"/>`).join("") +
    `<circle class="nucleo" cx="50" cy="50" r="3.2"/></svg>`;

  /* ─── Páginas ───────────────────────────────────────────────────────────── */

  // Cada foto, con su marco blanco, sus esquineras y el título escrito a mano
  const GIROS = [-1.4, 1, -0.6, 1.3, -1, 0.7, -1.7, 0.4];

  function crearFoto(f) {
    return `<div class="hueco">
      <figure class="foto-album" style="--ar:${proporcion(f).toFixed(3)};--giro:${GIROS[f.n % GIROS.length]}deg">
        <button class="foto-album__marco" type="button" data-foto="${f.n}"
                aria-label="Ver en grande: ${esc(etiquetaFoto(f))}">
          ${f.src ? `<img src="${esc(f.mini || f.src)}" alt="" decoding="async" draggable="false">`
                  : marcoIlustrado(f.anio, f.n)}
        </button>
        <figcaption class="foto-album__pie">${esc(f.titulo)}</figcaption>
      </figure>
    </div>`;
  }

  // Si una foto no trae sus medidas, se toman al cargar para no deformarla
  function medirFotos(hoja) {
    hoja.querySelectorAll(".foto-album__marco img").forEach((img) => {
      const f = lista[Number(img.parentElement.dataset.foto)];
      if (f.ancho && f.alto) return;
      const ajustar = () => {
        if (!img.naturalWidth) return;
        f.medida = img.naturalWidth / img.naturalHeight;
        img.closest(".foto-album").style.setProperty("--ar", f.medida.toFixed(3));
      };
      if (img.complete) ajustar(); else img.addEventListener("load", ajustar, { once: true });
    });
  }

  const CON_NUMERO = ["fotos", "final"];
  const numero = (i) => i - 2;                    // la primera página tras la portadilla es la 1
  const lado = (i) => (modo === "doble" ? (i % 2 ? "izq" : "der") : "der");

  function crearCara(cara, i, ladoCara) {
    const hoja = document.createElement("div");
    hoja.className = `folio folio--${cara.tipo} folio--${ladoCara}`;
    const pie = `<div class="folio__pie">${CON_NUMERO.includes(cara.tipo) && i >= 0 ? numero(i) : ""}</div>`;

    switch (cara.tipo) {
      case "portada":
        hoja.innerHTML = `
          <div class="tapa">
            ${anillos(6, "tapa__anillos")}
            <p class="tapa__super">${esc(DATOS.centro.nombre)}</p>
            <p class="tapa__cifra">${esc(DATOS.aniversario.numero)}</p>
            <p class="tapa__titulo">Álbum de fotos</p>
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

      case "titulo":
        hoja.innerHTML = `
          <img class="portadilla__escudo" src="assets/escudo.png" alt="" width="180" height="200">
          <p class="portadilla__titulo">Álbum de fotos</p>
          <p class="portadilla__sub">${esc(DATOS.aniversario.numero)} aniversario<br>${esc(DATOS.centro.nombre)}</p>
          <span class="portadilla__raya" aria-hidden="true"></span>
          <p class="portadilla__texto">Veinticinco cursos en imágenes, de ${anioInicio} a ${anioFin}, ordenados por año.</p>
          <p class="portadilla__cuenta">${reales ? esc(cuantas(lista.length)) : "Esperando las primeras fotos"}</p>`;
        break;

      case "fotos": {
        const clases = ["folio__cuerpo", "album-hoja"];
        if (cara.fotos.length === 1) clases.push("album-hoja--una");
        if (cara.juntas) clases.push("album-hoja--juntas");
        if (cara.primera) clases.push("album-hoja--anio");
        hoja.innerHTML = `
          <div class="folio__cabeza">${cara.primera ? "Álbum de fotos" : esc(cara.etiqueta)}</div>
          <div class="${clases.join(" ")}">
            ${cara.primera ? `<p class="album-hoja__anio">${esc(cara.etiqueta)}</p>` : ""}
            ${cara.fotos.map(crearFoto).join("")}
          </div>${pie}`;
        medirFotos(hoja);
        break;
      }

      case "final":
        hoja.innerHTML = `
          <div class="folio__cabeza">Álbum de fotos</div>
          <div class="folio__cuerpo">
            ${anillos(3, "cierre__anillos")}
            <p class="cierre__titulo">${reales ? "¿Tienes fotos de estos 25 años?" : "Este álbum acaba de abrirse"}</p>
            <p class="cierre__texto">${reales
              ? "El álbum sigue abierto todo el curso. Envíanos las tuyas y se añadirán a estas páginas, en su año."
              : "Todavía no se ha subido ninguna foto. Las primeras pueden ser las tuyas."}</p>
            ${destinoEnviar ? `<a class="cierre__boton" href="${esc(destinoEnviar)}">Enviar fotos</a>` : ""}
            <p class="cierre__nota">Si sabes el año y qué se celebraba, cuéntanoslo.</p>
          </div>${pie}`;
        break;
    }
    return hoja;
  }

  /* ─── Reparto en páginas ────────────────────────────────────────────────── */

  // Cada año empieza en una página nueva, con una foto por página. A doble
  // página, una vertical espera a la siguiente vertical del mismo año para
  // compartir hoja con ella, una al lado de la otra.
  function paginar() {
    const paginas = [];
    grupos.forEach((g) => {
      const hojas = [];
      let abierta = null;                         // hoja con una vertical sin pareja
      g.fotos.forEach((f) => {
        const vertical = modo === "doble" && proporcion(f) < 0.9;
        if (vertical && abierta) { abierta.push(f); abierta = null; return; }
        const hoja = [f];
        hojas.push(hoja);
        if (vertical) abierta = hoja;
      });
      hojas.forEach((fotosHoja, i) => paginas.push({
        tipo: "fotos", anio: g.anio, clave: g.clave, etiqueta: g.etiqueta,
        primera: i === 0, fotos: fotosHoja, juntas: fotosHoja.length === 2
      }));
    });
    return paginas;
  }

  const ultimo = () => (modo === "doble" ? Math.floor(caras.length / 2) : caras.length - 1);
  const carasEnVista = () => (modo === "doble"
    ? [2 * estado - 1, 2 * estado] : [estado]).filter((i) => i >= 0 && i < caras.length);
  const caraDeFoto = (n) => caras.findIndex((c) => c.fotos && c.fotos.some((f) => f.n === n));

  // Dónde está el lector, de forma que sobreviva al cambio entre móvil y ordenador
  function posicionActual() {
    for (const i of carasEnVista()) if (caras[i].fotos) return { foto: caras[i].fotos[0].n };
    const i = carasEnVista().slice(-1)[0] ?? 0;
    return i <= 2 ? { cara: i } : { desdeFinal: caras.length - 1 - i };
  }

  function construir(pos = { cara: 0 }) {
    if (animando) { pendiente = pos; return; }
    if (ui.escenario.hidden) return;
    modo = mqDoble.matches ? "doble" : "simple";
    ui.escenario.dataset.modo = modo;

    caras = [{ tipo: "portada" }, { tipo: "guarda" }, { tipo: "titulo" }, ...paginar(), { tipo: "final" }];
    if ((caras.length - 2) % 2) caras.push({ tipo: "blanca" });   // la guarda final va a la derecha
    caras.push({ tipo: "guarda" }, { tipo: "contraportada" });

    let i = pos.cara || 0;
    if (pos.foto != null) i = Math.max(0, caraDeFoto(pos.foto));
    else if (pos.desdeFinal != null) i = caras.length - 1 - pos.desdeFinal;
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
    ui.libro.classList.toggle("libro--contraportada", modo === "doble" && s === ultimo());
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
    ui.anterior.disabled = estado <= 0;
    ui.siguiente.disabled = estado >= fin;

    const total = caras.reduce((m, c, i) => (CON_NUMERO.includes(c.tipo) ? numero(i) : m), 0);
    const enVista = carasEnVista();
    const nums = enVista.filter((i) => CON_NUMERO.includes(caras[i].tipo)).map(numero);
    // El año que se muestra es el de la página de la derecha, la más reciente
    const conFotos = enVista.map((i) => caras[i]).filter((c) => c.fotos);
    const reciente = conFotos[conFotos.length - 1];
    const anio = reciente ? reciente.etiqueta : "";
    const texto = nums.length === 2 ? `Páginas ${nums[0]} y ${nums[1]} de ${total}`
      : nums.length === 1 ? `Página ${nums[0]} de ${total}`
      : NOMBRES[caras[enVista[enVista.length - 1]]?.tipo] || "";
    ui.posicion.textContent = anio ? `${texto} · ${anio}` : texto;
    ui.progreso.style.width = `${fin ? (estado / fin) * 100 : 0}%`;
    // El selector de año indica también en qué año está el álbum abierto
    ui.irAnio.value = reciente ? reciente.clave : "";
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

  // Si el álbum no se ve entero, la página se desplaza para centrarlo
  function asegurarVista() {
    const r = ui.escenario.getBoundingClientRect();
    const cabecera = document.querySelector(".cabecera")?.offsetHeight || 0;
    if (r.top < cabecera || r.bottom > window.innerHeight) {
      ui.escenario.scrollIntoView({ block: "center", behavior: mqQuieto.matches ? "auto" : "smooth" });
    }
  }

  async function pasar(dir) {
    if (animando) return;
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

  function irA(i, centrar = true) {
    if (animando) return;
    i = Math.max(0, Math.min(i, caras.length - 1));
    estado = modo === "doble" ? Math.ceil(i / 2) : i;
    if (centrar) asegurarVista();
    pintar();
  }

  /* ─── Selector de año y vista de todas las fotos ────────────────────────── */

  function pintarSelector() {
    ui.irAnio.insertAdjacentHTML("beforeend", grupos.map((g) =>
      `<option value="${esc(g.clave)}">${esc(g.etiqueta)} · ${cuantas(g.fotos.length)}</option>`).join(""));
    ui.irAnio.disabled = !grupos.length;
  }

  function irAlAnio() {
    const clave = ui.irAnio.value;
    if (!clave) return;
    if (!ui.rejilla.hidden) {
      document.getElementById(`anio-${clave}`)?.scrollIntoView({ behavior: mqQuieto.matches ? "auto" : "smooth" });
      return;
    }
    const i = caras.findIndex((c) => c.tipo === "fotos" && c.primera && c.clave === clave);
    if (i >= 0) irA(i);
  }

  function pintarRejilla() {
    ui.rejilla.innerHTML = grupos.map((g) => `
      <section class="rejilla__anio" id="anio-${esc(g.clave)}" aria-labelledby="titulo-${esc(g.clave)}">
        <h2 class="rejilla__titulo" id="titulo-${esc(g.clave)}">${esc(g.etiqueta)} <small>${cuantas(g.fotos.length)}</small></h2>
        <div class="rejilla__fotos">
          ${g.fotos.map((f) => `
            <button class="rejilla__foto" type="button" data-foto="${f.n}" aria-label="Ver en grande: ${esc(etiquetaFoto(f))}">
              ${f.src ? `<img src="${esc(f.mini || f.src)}" alt="" loading="lazy" decoding="async">` : marcoIlustrado(f.anio, f.n)}
              <span class="rejilla__pie">${esc(f.titulo)}</span>
            </button>`).join("")}
        </div>
      </section>`).join("");
  }

  function alternarRejilla() {
    const enRejilla = ui.modoRejilla.getAttribute("aria-pressed") !== "true";
    ui.modoRejilla.setAttribute("aria-pressed", String(enRejilla));
    ui.modoRejilla.textContent = enRejilla ? "Ver como álbum" : "Ver todas las fotos";
    ui.rejilla.hidden = !enRejilla;
    ui.escenario.hidden = ui.paso.hidden = ui.ayuda.hidden = enRejilla;
    if (enRejilla) {
      if (!ui.rejilla.childElementCount) pintarRejilla();
      const clave = ui.irAnio.value;             // se abre por el año que se estaba viendo
      if (clave) document.getElementById(`anio-${clave}`)?.scrollIntoView();
    } else {
      construir(posicionActual());
    }
  }

  /* ─── Visor: una foto en grande ─────────────────────────────────────────── */

  let enVisor = 0;

  function pintarVisor() {
    const f = lista[enVisor];
    ui.visorMedio.innerHTML = f.src
      ? `<img src="${esc(f.src)}" alt="${esc(f.titulo)}">`
      : marcoIlustrado(f.anio, f.n);
    ui.visorPie.textContent = etiquetaFoto(f);
    ui.visorCuenta.textContent = `${enVisor + 1} de ${lista.length}`;
    ui.visorAnt.disabled = enVisor === 0;
    ui.visorSig.disabled = enVisor === lista.length - 1;
    const siguiente = lista[enVisor + 1];                  // se adelanta la carga
    if (siguiente && siguiente.src) new Image().src = siguiente.src;
  }

  function abrirVisor(n) {
    enVisor = n;
    pintarVisor();
    if (!ui.visor.open) ui.visor.showModal();
  }

  function moverVisor(dir) {
    const n = enVisor + dir;
    if (n < 0 || n >= lista.length) return;
    enVisor = n;
    pintarVisor();
  }

  // Al cerrar, el álbum queda abierto por la página de la última foto vista
  function alCerrarVisor() {
    if (ui.escenario.hidden) return;
    const i = caraDeFoto(enVisor);
    if (i >= 0 && !carasEnVista().includes(i)) irA(i, false);
  }

  /* ─── Presentación a pantalla completa, con el himno ────────────────────── */

  const PAUSA_FOTO = 5500;                 // lo que dura cada foto en pantalla
  const PAUSA_ROTULO = 4000;               // la portada y el cierre
  const diapos = [{ tipo: "portada" }, ...lista.filter((f) => f.src).map((foto) => ({ tipo: "foto", foto })), { tipo: "cierre" }];
  const pase = { indice: 0, capa: 0, sonando: false, musica: true, temporizador: null, turno: 0, bloqueo: null, quieto: null };
  const himno = DATOS.himno && DATOS.himno.archivo ? new Audio() : null;
  const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));

  function rotuloEspecial(d) {
    if (d.tipo === "portada") {
      return `<div class="pase__portada">
        <img class="pase__escudo" src="assets/escudo.png" alt="" width="180" height="200">
        <p class="pase__super">${esc(DATOS.centro.nombre)}</p>
        <p class="pase__cifra">${esc(DATOS.aniversario.numero)}</p>
        <p class="pase__lema">años en imágenes</p>
        <p class="pase__fechas">${anioInicio} · ${anioFin}</p>
      </div>`;
    }
    return `<div class="pase__portada">
      ${anillos(4, "pase__anillos")}
      <p class="pase__lema">Gracias por formar parte<br>de estos ${esc(DATOS.aniversario.numero)} años</p>
      <p class="pase__fechas">${esc(DATOS.aniversario.hashtag || DATOS.centro.nombre)}</p>
    </div>`;
  }

  async function mostrarDiapo(k) {
    const turno = ++pase.turno;
    clearTimeout(pase.temporizador);
    pase.indice = (k + diapos.length) % diapos.length;
    const d = diapos[pase.indice];
    const capa = ui.paseCapas[pase.capa ^ 1];              // se prepara la capa oculta
    capa.dataset.tipo = d.tipo;
    capa.dataset.efecto = String(pase.indice % 4);
    if (d.tipo === "foto") {
      capa.innerHTML = `<img class="pase__fondo" src="${esc(d.foto.src)}" alt="">
        <img class="pase__img" src="${esc(d.foto.src)}" alt="${esc(d.foto.titulo)}">`;
      const img = capa.querySelector(".pase__img");
      try { await Promise.race([img.decode(), espera(4000)]); } catch (e) { /* se muestra igual */ }
    } else {
      capa.innerHTML = rotuloEspecial(d);
    }
    if (turno !== pase.turno || !ui.pase.open) return;     // llegó otra orden mientras cargaba

    capa.classList.add("pase__capa--visible");
    ui.paseCapas[pase.capa].classList.remove("pase__capa--visible");
    pase.capa ^= 1;

    ui.paseRotulo.innerHTML = d.tipo === "foto"
      ? `${d.foto.anio ? `<p class="pase__anio">${esc(d.foto.anio)}</p>` : ""}<p class="pase__titulo">${esc(d.foto.titulo)}</p>`
      : "";
    const fotosTotales = diapos.length - 2;
    const hecho = d.tipo === "portada" ? 0 : d.tipo === "cierre" ? 1 : d.foto.n / Math.max(1, fotosTotales - 1);
    ui.paseProgreso.style.width = `${Math.min(1, hecho) * 100}%`;

    const siguiente = diapos[(pase.indice + 1) % diapos.length];
    if (siguiente.tipo === "foto") new Image().src = siguiente.foto.src;
    programar();
  }

  function programar() {
    clearTimeout(pase.temporizador);
    if (!pase.sonando) return;
    const d = diapos[pase.indice];
    pase.temporizador = setTimeout(() => mostrarDiapo(pase.indice + 1), d.tipo === "foto" ? PAUSA_FOTO : PAUSA_ROTULO);
  }

  function sonarHimno() {
    if (!himno || !pase.musica || !pase.sonando) return;
    const promesa = himno.play();
    if (promesa && promesa.catch) promesa.catch(() => { /* sin música, la presentación sigue */ });
  }

  function alternarPase(sonar = !pase.sonando) {
    pase.sonando = sonar;
    ui.pase.classList.toggle("pase--pausado", !sonar);
    ui.pasePlay.setAttribute("aria-label", sonar ? "Pausar la presentación" : "Reanudar la presentación");
    if (sonar) { sonarHimno(); programar(); }
    else { clearTimeout(pase.temporizador); if (himno) himno.pause(); }
  }

  function alternarMusica() {
    pase.musica = !pase.musica;
    ui.paseMusica.setAttribute("aria-pressed", String(pase.musica));
    ui.paseMusica.setAttribute("aria-label", pase.musica ? "Quitar la música" : "Poner la música");
    if (pase.musica) sonarHimno(); else if (himno) himno.pause();
  }

  // Los mandos se ocultan solos cuando no se toca nada, para ver solo las fotos
  function despertarMandos() {
    ui.pase.classList.remove("pase--quieto");
    clearTimeout(pase.quieto);
    pase.quieto = setTimeout(() => ui.pase.classList.add("pase--quieto"), 2800);
  }

  function abrirPase() {
    if (diapos.length < 3) return;
    if (himno && !himno.src) { himno.src = DATOS.himno.archivo; himno.loop = true; }
    ui.paseCapas.forEach((c) => { c.classList.remove("pase__capa--visible"); c.replaceChildren(); });
    ui.paseRotulo.replaceChildren();
    ui.pase.showModal();
    alternarPase(true);                  // dentro del clic: si no, el navegador no deja sonar el himno
    mostrarDiapo(0);
    despertarMandos();
    if (ui.pase.requestFullscreen) ui.pase.requestFullscreen().catch(() => { /* se ve a toda ventana */ });
    // Que la pantalla no se apague mientras se proyecta
    if (navigator.wakeLock) navigator.wakeLock.request("screen").then((b) => { pase.bloqueo = b; }).catch(() => {});
  }

  function cerrarPase() {
    if (!ui.pase.open) return;
    pase.turno++;
    pase.sonando = false;
    clearTimeout(pase.temporizador);
    clearTimeout(pase.quieto);
    if (himno) { himno.pause(); himno.currentTime = 0; }
    if (pase.bloqueo) { pase.bloqueo.release().catch(() => {}); pase.bloqueo = null; }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    ui.pase.close();
    ui.paseCapas.forEach((c) => c.replaceChildren());
  }

  /* ─── Eventos ───────────────────────────────────────────────────────────── */

  // Deslizar el dedo a un lado u otro
  function alDeslizar(el, fn) {
    let toque = null;
    el.addEventListener("pointerdown", (e) => {
      toque = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
    });
    el.addEventListener("pointerup", (e) => {
      if (!toque) return;
      const dx = e.clientX - toque.x, dy = e.clientY - toque.y;
      toque = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) fn(dx < 0 ? 1 : -1);
    });
  }

  function escuchar() {
    ui.anterior.addEventListener("click", () => pasar(-1));
    ui.siguiente.addEventListener("click", () => pasar(1));
    ui.irAnio.addEventListener("change", irAlAnio);
    ui.modoRejilla.addEventListener("click", alternarRejilla);
    ui.rejilla.addEventListener("click", (e) => {
      const boton = e.target.closest("[data-foto]");
      if (boton) abrirVisor(Number(boton.dataset.foto));
    });

    // En el álbum: la foto se abre en grande; el margen de la hoja pasa página
    let ignorarClic = false;
    alDeslizar(ui.escenario, (dir) => {
      ignorarClic = true;
      setTimeout(() => { ignorarClic = false; }, 450);
      pasar(dir);
    });
    ui.escenario.addEventListener("click", (e) => {
      if (ignorarClic) return;
      const foto = e.target.closest("[data-foto]");
      if (foto) { abrirVisor(Number(foto.dataset.foto)); return; }
      if (e.target.closest("a, button, select")) return;
      if (modo === "doble") {
        if (e.target.closest("#lado-der")) pasar(1);
        else if (e.target.closest("#lado-izq")) pasar(-1);
      } else if (e.target.closest("#lado-der")) {
        const r = ui.der.getBoundingClientRect();
        pasar(e.clientX > r.left + r.width * 0.35 ? 1 : -1);
      }
    });

    // Visor
    ui.visorAnt.addEventListener("click", () => moverVisor(-1));
    ui.visorSig.addEventListener("click", () => moverVisor(1));
    $("#visor-cerrar").addEventListener("click", () => ui.visor.close());
    ui.visor.addEventListener("click", (e) => { if (e.target === ui.visor) ui.visor.close(); });
    ui.visor.addEventListener("close", alCerrarVisor);
    alDeslizar(ui.visor, moverVisor);

    // Presentación
    ui.abrirPase.addEventListener("click", abrirPase);
    ui.pasePlay.addEventListener("click", () => { alternarPase(); despertarMandos(); });
    ui.paseMusica.addEventListener("click", () => { alternarMusica(); despertarMandos(); });
    $("#pase-ant").addEventListener("click", () => { mostrarDiapo(pase.indice - 1); despertarMandos(); });
    $("#pase-sig").addEventListener("click", () => { mostrarDiapo(pase.indice + 1); despertarMandos(); });
    $("#pase-cerrar").addEventListener("click", cerrarPase);
    ui.pase.addEventListener("cancel", (e) => { e.preventDefault(); cerrarPase(); });
    ui.pase.addEventListener("pointermove", despertarMandos);
    ui.pase.addEventListener("pointerdown", despertarMandos);
    alDeslizar(ui.pase, (dir) => mostrarDiapo(pase.indice + dir));
    // Salir de la pantalla completa (tecla Esc) termina la presentación
    document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement) cerrarPase(); });

    document.addEventListener("keydown", (e) => {
      if (ui.pase.open) {
        // Espacio pausa, salvo sobre un botón, que ya lo pulsa por sí mismo
        const teclas = {
          ArrowRight: () => mostrarDiapo(pase.indice + 1), ArrowLeft: () => mostrarDiapo(pase.indice - 1),
          k: () => alternarPase(), m: () => alternarMusica(),
          " ": !e.target.closest("button") && (() => alternarPase())
        };
        if (teclas[e.key]) { e.preventDefault(); teclas[e.key](); despertarMandos(); }
        return;
      }
      if (ui.visor.open) {
        if (e.key === "ArrowRight") { e.preventDefault(); moverVisor(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); moverVisor(-1); }
        return;
      }
      if (ui.escenario.hidden || e.target.closest("input, textarea, select")) return;
      const enAlbum = ui.escenario.contains(document.activeElement) || ui.paso.contains(document.activeElement);
      const teclas = {
        ArrowRight: () => pasar(1), ArrowLeft: () => pasar(-1),
        PageDown: enAlbum && (() => pasar(1)), PageUp: enAlbum && (() => pasar(-1)),
        Home: enAlbum && (() => irA(0)), End: enAlbum && (() => irA(caras.length - 1))
      };
      if (teclas[e.key]) { e.preventDefault(); teclas[e.key](); }
    });

    // Al pasar de móvil a ordenador (o al girar la tableta), a una o dos páginas
    mqDoble.addEventListener("change", () => { if (!ui.escenario.hidden) construir(posicionActual()); });
  }

  /* ─── Arranque ──────────────────────────────────────────────────────────── */

  function iniciar() {
    ANIV.iniciarTema();
    if (destinoEnviar) ui.enviar.href = destinoEnviar;
    ANIV.pintarCompartir($("#compartir-album"), {
      texto: `📷 ${DATOS.aniversario.numero} años del ${DATOS.centro.nombre} en fotos. Hojea el álbum y, si guardas alguna foto del colegio, envíala para completarlo:`
    });
    if (!reales) {
      ui.estado.textContent = "Todavía no se ha subido ninguna foto: estos son los huecos que esperan la suya.";
    }
    ui.abrirPase.hidden = diapos.length < 3;
    pintarSelector();
    escuchar();
    construir({ cara: 0 });
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
