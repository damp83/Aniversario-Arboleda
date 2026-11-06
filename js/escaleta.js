/* =============================================================================
   ESCALETA DEL ACTO · escaleta.html
   Proyecta el orden del acto institucional con su horario. Según la hora,
   marca solo el momento en curso y el siguiente; si el acto se retrasa o se
   adelanta, se lleva a mano con las flechas (y «Automático» vuelve al reloj).
   Los momentos se editan en js/datos.js, en «escaleta».
   ============================================================================= */
(function () {
  "use strict";

  const { $, esc } = ANIV;
  const E = DATOS.escaleta;
  const ui = {
    lista: $("#momentos"), reloj: $("#reloj"), aviso: $("#aviso"), qr: $("#qr"),
    auto: $("#auto"), completa: $("#completa"), mandos: $("#mandos")
  };
  const momentos = E.momentos || [];
  const minutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

  // Para probarla antes del acto: escaleta.html?hora=19:10 hace como si fuera esa hora
  const horaFingida = new URLSearchParams(location.search).get("hora");
  function ahora() {
    const d = new Date();
    if (horaFingida && /^\d{1,2}:\d{2}$/.test(horaFingida)) {
      const [h, m] = horaFingida.split(":").map(Number);
      return { esElDia: true, min: h * 60 + m, texto: horaFingida.padStart(5, "0") };
    }
    const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      esElDia: hoy === E.fecha,
      min: d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60,
      texto: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
    };
  }

  // Cuándo empieza cada momento, para saber cuál toca. Los que comparten hora
  // o van «a continuación» se reparten el tiempo hasta la siguiente hora
  // fijada; el último sin hora, unos minutos después del anterior.
  const comienzos = (() => {
    const fijos = momentos.map((m) => (m.hora ? minutos(m.hora) : null));
    const res = [];
    let i = 0;
    while (i < momentos.length) {
      let j = i + 1;
      while (j < momentos.length && (fijos[j] === null || fijos[j] === fijos[i])) j++;
      const desde = fijos[i] ?? (res.length ? res[res.length - 1] + 5 : 0);
      const hasta = j < momentos.length ? fijos[j] : desde + 10 * (j - i);
      for (let k = i; k < j; k++) res.push(desde + ((hasta - desde) * (k - i)) / (j - i));
      i = j;
    }
    return res;
  })();

  let manual = null;          // índice elegido a mano, o null si va con el reloj

  function enCurso() {
    if (manual !== null) return manual;
    const t = ahora();
    if (!t.esElDia || t.min < comienzos[0]) return -1;
    let k = 0;
    while (k + 1 < momentos.length && comienzos[k + 1] <= t.min) k++;
    return k;
  }

  function pintarLista() {
    ui.lista.innerHTML = momentos.map((m, i) => `
      <li class="momento" data-i="${i}">
        <span class="momento__hora${m.hora ? "" : " momento__hora--sigue"}">${m.hora ? esc(m.hora) : "A continuación"}</span>
        <span class="momento__texto">
          <span class="momento__titulo">${esc(m.titulo)}</span>
          ${m.detalle ? `<span class="momento__detalle">${esc(m.detalle)}</span>` : ""}
        </span>
        <span class="momento__estado" aria-hidden="true"></span>
      </li>`).join("");
  }

  function actualizar() {
    const t = ahora();
    ui.reloj.textContent = t.texto;
    const k = enCurso();
    ui.lista.querySelectorAll(".momento").forEach((li, i) => {
      li.classList.toggle("momento--hecho", k >= 0 && i < k);
      li.classList.toggle("momento--ahora", i === k);
      li.classList.toggle("momento--despues", i === k + 1);
      li.querySelector(".momento__estado").textContent = i === k ? "Ahora" : i === k + 1 ? "A continuación" : "";
      if (i === k) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    // Fuera del día del acto, se dice claramente que es una vista previa
    const aviso = !t.esElDia && manual === null
      ? `Vista previa · El acto es el ${E.fechaTexto.charAt(0).toLowerCase() + E.fechaTexto.slice(1)}`
      : t.esElDia && manual === null && k < 0 ? `Comenzamos a las ${momentos[0].hora}` : "";
    ui.aviso.textContent = aviso;
    ui.aviso.hidden = !aviso;
    ui.auto.setAttribute("aria-pressed", String(manual === null));
    ui.auto.textContent = manual === null ? "Automático" : "Volver al horario";
  }

  function mover(dir) {
    const actual = enCurso();
    manual = Math.max(0, Math.min(momentos.length - 1, (actual < 0 ? -1 : actual) + dir));
    actualizar();
    despertar();
  }

  // Los mandos solo aparecen al mover el ratón o tocar la pantalla
  let quieto = null;
  function despertar() {
    document.body.classList.remove("escaleta--quieta");
    clearTimeout(quieto);
    quieto = setTimeout(() => document.body.classList.add("escaleta--quieta"), 3000);
  }

  // Que la pantalla no se apague durante el acto
  let bloqueo = null;
  function mantenerPantalla() {
    if (!navigator.wakeLock || bloqueo) return;
    navigator.wakeLock.request("screen").then((b) => {
      bloqueo = b;
      b.addEventListener("release", () => { bloqueo = null; });
    }).catch(() => {});
  }

  function iniciar() {
    $("#titulo").textContent = E.titulo || "Acto institucional";
    $("#eti").textContent = `${DATOS.aniversario.numero} aniversario · ${DATOS.centro.nombre}`;
    $("#fecha").textContent = E.fechaTexto || "";
    pintarLista();

    // El QR del libro de visitas, para que se deje un recuerdo durante el acto
    const voz = (DATOS.participa || []).find((p) => p.icono === "voz") || {};
    const destino = /^https?:/i.test(voz.enlace || "") ? voz.enlace
      : new URL("recuerdos.html", location.href).href;
    const qr = ANIV.codigoQR(destino);
    if (qr) {
      ui.qr.innerHTML = `${qr}<p><strong>Deja tu recuerdo</strong>Escanea con el móvil</p>`;
      ui.qr.hidden = false;
    }

    actualizar();
    setInterval(actualizar, 15000);
    despertar();
    mantenerPantalla();

    $("#ant").addEventListener("click", () => mover(-1));
    $("#sig").addEventListener("click", () => mover(1));
    ui.auto.addEventListener("click", () => { manual = null; actualizar(); despertar(); });
    ui.completa.hidden = !ANIV.puedePantallaCompleta;
    ui.completa.addEventListener("click", () => {
      if (ANIV.enPantallaCompleta()) ANIV.salirPantallaCompleta(); else ANIV.pantallaCompleta();
    });
    ANIV.alCambiarPantallaCompleta(() => {
      ui.completa.setAttribute("aria-label", ANIV.enPantallaCompleta() ? "Salir de la pantalla completa" : "Pantalla completa");
    });
    // Un toque en cualquier parte la pone a pantalla completa (el navegador
    // solo lo permite tras un toque o un clic)
    document.addEventListener("pointerdown", (e) => {
      despertar();
      mantenerPantalla();
      if (!e.target.closest("button") && !ANIV.enPantallaCompleta()) ANIV.pantallaCompleta();
    });
    document.addEventListener("pointermove", despertar);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") { actualizar(); mantenerPantalla(); }
    });
    document.addEventListener("keydown", (e) => {
      const teclas = {
        ArrowRight: () => mover(1), ArrowDown: () => mover(1), PageDown: () => mover(1), " ": () => mover(1),
        ArrowLeft: () => mover(-1), ArrowUp: () => mover(-1), PageUp: () => mover(-1),
        a: () => { manual = null; actualizar(); },
        f: () => (ANIV.enPantallaCompleta() ? ANIV.salirPantallaCompleta() : ANIV.pantallaCompleta())
      };
      if (teclas[e.key] && !(e.key === " " && e.target.closest("button"))) { e.preventDefault(); teclas[e.key](); despertar(); }
    });
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
