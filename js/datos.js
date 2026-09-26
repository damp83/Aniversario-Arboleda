/* =============================================================================
   DATOS.JS  ·  El único archivo que necesitas tocar para actualizar la web
   -----------------------------------------------------------------------------
   Todo el contenido del sitio (textos, fechas, programa, proyectos, galería)
   está aquí. Edita los valores entre comillas y guarda: la web se actualiza sola.

   ⚠️  Los textos marcados con "EJEMPLO" son de muestra: sustitúyelos por los
       datos reales del centro antes de publicar.
   ============================================================================= */

const DATOS = {

  /* ---------------------------------------------------------------------------
     1. EL CENTRO  ·  Cambia el nombre, la localidad y el curso escolar
     --------------------------------------------------------------------------- */
  centro: {
    nombre: "CEIP La Arboleda",
    nombreCorto: "La Arboleda",
    localidad: "Santiago y Zaraíche · Murcia",
    curso: "2026 / 2027",
    web: "https://ceiplaarboleda.murciaeduca.es/",
    email: "30013682@murciaeduca.es",
    telefono: "968 230 411",
    direccion: "Calle Guerreros, 6 · 30007 Murcia"
  },

  /* ---------------------------------------------------------------------------
     2. EL ANIVERSARIO
     --------------------------------------------------------------------------- */
  aniversario: {
    numero: 25,
    anioFundacion: 2001,        // confirmado: el colegio abrió en el curso 2001/2002
    lema: "25 años sembrando futuro",

    // Correo al que llegan las fotos y los recuerdos (botones de "Participa").
    // Es distinto del correo del centro (arriba), que sigue en el pie de página.
    email: "25aniversarioarboleda@gmail.com",

    // Enlace CSV de la pestaña "web" de la hoja de recuerdos (Archivo → Compartir
    // → Publicar en la web → pestaña "web" → CSV). Vacío = no se usa la hoja.
    hojaRecuerdos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgPzB7BpPZUfH8RaTUz-rKUjZud8Ls28vMd-LLu0krqCfRAE7YXvz1uvOYFHGJjoGosFdPnn19x_uP/pub?gid=887984231&single=true&output=csv",

    entradilla:
      "Un cuarto de siglo de patios, de primeras letras, de excursiones y de " +
      "abrazos en la puerta. Celebramos 25 cursos de comunidad educativa con " +
      "un proyecto que recorrerá todo el año.",
    hashtag: "#25AñosArboleda"
  },

  /* ---------------------------------------------------------------------------
     HIMNO DEL 25 ANIVERSARIO
     La letra: estrofas separadas por una línea en blanco. Un bloque que empieza
     por [Estribillo] se destaca; si solo pone [Estribillo], es una repetición.
     --------------------------------------------------------------------------- */
  himno: {
    titulo: "Veinticinco años, La Arboleda",
    archivo: "assets/audio/himno-25-aniversario.mp3",
    duracion: "2:49",
    creditos: "Canción creada con Suno para el 25 aniversario.",   // edítalo o déjalo vacío
    letra: `
Un nuevo día vuelve a empezar,
en cada aula hay un lugar.
Profes y alumnos en el viaje,
con mil sueños en el equipaje.

Ayer y hoy, de la mano,
creciendo juntos cada año.

[Estribillo]
¡Veinticinco años, La Arboleda!
Bajo tu sombra la vida se sueña.
Caminamos juntos, dejando huella,
nuestra casa, nuestra estrella.

Risas que flotan en el jardín,
una historia que no tiene fin.
Aprender a volar, aprender a sentir,
con la alegría de compartir.

Ayer y hoy, de la mano,
creciendo juntos cada año.

[Estribillo]

Sembrando futuro, mirando adelante,
con el corazón de cada estudiante.
Profes y alumnos, a una sola voz…

[Estribillo]

¡Colegio La Arboleda!
¡Veinticinco años juntos!
`
  },

  /* ---------------------------------------------------------------------------
     3. LA SEMANA CONMEMORATIVA  ·  Formato de fecha: AAAA-MM-DDTHH:MM
        La cuenta atrás de la portada apunta a "inicio".
     --------------------------------------------------------------------------- */
  semana: {
    titulo: "Semana del 25 Aniversario",
    inicio: "2026-10-26T09:00",
    fin: "2026-10-30T22:30",
    fechaTexto: "26 – 30 de octubre de 2026",
    descripcion:
      "Cada día, una idea: las raíces, la comunidad educativa, el futuro y la " +
      "solidaridad. La semana culmina el viernes 30 por la tarde con el acto " +
      "institucional del 25 aniversario."
  },

  /* ---------------------------------------------------------------------------
     4. PROGRAMA DE LA SEMANA  ·  Un bloque por día, con sus actividades
        (programa oficial del proyecto del 25 aniversario)
        hora: "09:00", o "Mañana" si la actividad no tiene hora fija
        lugar y publico son opcionales: si se dejan vacíos, no se muestran
     --------------------------------------------------------------------------- */
  programa: [
    {
      dia: "Lunes 26",
      lema: "Día de las Raíces",
      resumen: "Arrancamos la semana presentando el lema y volviendo a nuestros orígenes.",
      actividades: [
        { hora: "09:00", titulo: "Acto de apertura", lugar: "", publico: "Alumnado y personal",
          texto: "Presentación oficial del lema y de lo que significa cumplir 25 años. Entrega de diplomas y reparto del marcapáginas ganador." },
        { hora: "Mañana", titulo: "Exposición histórica", lugar: "Pasillos", publico: "",
          texto: "Fotografías desde 2001 en pantallas: el primer claustro, las primeras promociones y la evolución del barrio." },
        { hora: "Mañana", titulo: "«Nuestras raíces»", lugar: "Hall", publico: "Todas las clases",
          texto: "Cada clase aporta una hoja de cartulina con los valores del centro y lo que significa pertenecer a La Arboleda. Juntas forman un gran árbol mural." }
      ]
    },
    {
      dia: "Martes 27",
      lema: "Día de la Comunidad Educativa",
      resumen: "Mostramos lo que el colegio ha significado para el barrio y para Murcia, contado por su gente.",
      actividades: [
        { hora: "Mañana", titulo: "Bolsitas de aromáticas del huerto", lugar: "", publico: "Infantil y 1.º",
          texto: "Preparan bolsitas con plantas aromáticas del huerto para regalar en la celebración. El alumnado de 6.º diseña las tarjetas que las acompañan." },
        { hora: "Mañana", titulo: "Línea del tiempo ilustrada", lugar: "", publico: "2.º, 3.º y 4.º",
          texto: "La historia del colegio, contada en una gran línea del tiempo ilustrada." },
        { hora: "Mañana", titulo: "Entrevistas de radio a docentes veteranos", lugar: "", publico: "5.º y 6.º",
          texto: "Entrevistas a maestras y maestros con muchos años en el centro, grabadas en vídeo." },
        { hora: "Mañana", titulo: "Vídeo conmemorativo", lugar: "", publico: "",
          texto: "Grabación de testimonios para el vídeo del 25 aniversario." },
        { hora: "Mañana", titulo: "Foto aérea: el número 25", lugar: "", publico: "",
          texto: "Fotografía aérea con todo el colegio formando el número 25, si es posible hacerla." }
      ]
    },
    {
      dia: "Miércoles 28",
      lema: "Día del Futuro",
      resumen: "Miramos a 2051: escribimos al colegio del futuro, enterramos la cápsula del tiempo y plantamos un árbol.",
      actividades: [
        { hora: "Mañana", titulo: "Cartas al «CEIP La Arboleda 2051»", lugar: "", publico: "",
          texto: "Cada clase entrega sus cartas para el colegio de dentro de 25 años." },
        { hora: "Mañana", titulo: "Cápsula del tiempo", lugar: "", publico: "",
          texto: "Enterramos la foto oficial de 2026, la lista del alumnado matriculado, las listas de cada clase con sus nombres y firmas, una carta de la dirección y el periódico local del día." },
        { hora: "12:00", titulo: "Plantación del árbol conmemorativo", lugar: "Patio", publico: "",
          texto: "Lo plantan dos delegados de Unicef de 3.º a 6.º y dos alumnos de 1.º y 2.º, junto a la placa «25 años sembrando futuro – 2001–2026»." }
      ]
    },
    {
      dia: "Jueves 29",
      lema: "Día Solidario",
      resumen: "Una jornada para poner en práctica nuestros valores y cerrar la semana en cada clase.",
      actividades: [
        { hora: "Mañana", titulo: "Acto solidario: recogida de material escolar", lugar: "", publico: "Por cursos",
          texto: "Lo recaudado se destina a un proyecto social local: Azul en Acción." },
        { hora: "Mañana", titulo: "Juegos tradicionales cooperativos", lugar: "", publico: "Por ciclos",
          texto: "Espacios de juego tradicional y cooperativo para cada ciclo." },
        { hora: "Mañana", titulo: "Photocall oficial", lugar: "Entrada", publico: "",
          texto: "El photocall del 25 aniversario se instala en la entrada del colegio." },
        { hora: "Mañana", titulo: "Cierre de la semana en las aulas", lugar: "", publico: "",
          texto: "Reflexión sobre la semana, foto de grupo de cada clase y entrega del marcapáginas conmemorativo del 25 aniversario, elegido en el concurso de octubre." }
      ]
    },
    {
      dia: "Viernes 30",
      lema: "Acto institucional",
      resumen: "Por la tarde, el acto institucional del 25 aniversario, con autoridades, claustro actual y antiguo, AMPA, Consejo Escolar y la primera promoción (2007).",
      actividades: [
        { hora: "18:30", titulo: "Recepción", lugar: "", publico: "Adultos y 1.ª promoción",
          texto: "Acreditaciones, proyección audiovisual histórica y photocall." },
        { hora: "19:00", titulo: "Acto oficial", lugar: "", publico: "Adultos y 1.ª promoción",
          texto: "Bienvenida, intervención de la dirección y del representante municipal, reconocimiento al equipo fundador, intervención de la primera promoción, descubrimiento de la placa conmemorativa y actuación del coro." },
        { hora: "20:15", titulo: "Cóctel institucional", lugar: "", publico: "Adultos y 1.ª promoción",
          texto: "Encuentro, libro de firmas y espacio «Muro de los recuerdos». Cierre previsto hacia las 22:30." }
      ]
    }
  ],

  /* ---------------------------------------------------------------------------
     5. LÍNEA DEL TIEMPO  ·  Los hitos del centro
        El primero (2001, la apertura) está confirmado.
        ⚠️ Los demás son EJEMPLOS inventados: sustitúyelos por los hitos reales.
     --------------------------------------------------------------------------- */
  hitos: [
    { anio: "2001", titulo: "Se abren las puertas", texto: "El colegio abre en el curso 2001/2002 y recibe a su primera promoción de alumnado de Infantil y Primaria." },
    { anio: "2004", titulo: "Nace la AMPA", texto: "Las familias se organizan y ponen en marcha las primeras actividades extraescolares." },
    { anio: "2008", titulo: "La biblioteca escolar", texto: "Se inaugura la biblioteca y arranca el plan lector que aún hoy nos define." },
    { anio: "2012", titulo: "Centro bilingüe", texto: "Comienza el programa de enseñanza en lenguas extranjeras en Educación Primaria." },
    { anio: "2016", titulo: "El huerto escolar", texto: "El patio se transforma: huerto, compostera y las primeras aulas al aire libre." },
    { anio: "2020", titulo: "Escuela en la distancia", texto: "La comunidad educativa se reinventa y demuestra que el centro es la gente." },
    { anio: "2023", titulo: "Patios coeducativos", texto: "Rediseñamos los espacios de juego para que quepan todas las formas de jugar." },
    { anio: "2026", titulo: "25 aniversario", texto: "Un curso entero de celebración, memoria y proyectos compartidos." }
  ],

  /* ---------------------------------------------------------------------------
     6. HILO CONDUCTOR DEL CURSO  ·  Proyectos por trimestre
     --------------------------------------------------------------------------- */
  proyectos: [
    {
      etiqueta: "1.er trimestre",
      titulo: "Raíces: de dónde venimos",
      resumen: "Investigamos la historia del centro y del barrio con las familias como fuente principal.",
      etapas: ["Infantil", "Primaria", "Familias"],
      acciones: [
        "Entrevistas del alumnado a antiguo alumnado y a docentes fundadores.",
        "Archivo digital de fotografías y documentos cedidos por las familias.",
        "Exposición permanente en el vestíbulo con la línea del tiempo del centro."
      ]
    },
    {
      etiqueta: "2.º trimestre",
      titulo: "Tronco: quiénes somos hoy",
      resumen: "Miramos al centro que somos ahora: convivencia, lenguas, ciencia y arte.",
      etapas: ["Primaria", "Claustro"],
      acciones: [
        "Censo creativo: un retrato colectivo de las 25 promociones.",
        "Semana de la ciencia con talleres apadrinados por antiguo alumnado.",
        "Certamen literario y de ilustración '25 palabras para La Arboleda'."
      ]
    },
    {
      etiqueta: "3.er trimestre",
      titulo: "Ramas: hacia dónde crecemos",
      resumen: "Proyectamos el centro de los próximos 25 años y dejamos huella.",
      etapas: ["Infantil", "Primaria", "Comunidad"],
      acciones: [
        "Cápsula del tiempo con cartas al alumnado del 50 aniversario.",
        "Mural definitivo y señalética conmemorativa en el patio.",
        "Fiesta de fin de curso y entrega del libro del 25 aniversario."
      ]
    }
  ],

  /* ---------------------------------------------------------------------------
     7. GALERÍA  ·  Añade tus fotos en assets/galeria/ y pon aquí la ruta:
        { src: "assets/galeria/patio-2004.jpg", titulo: "...", anio: "2004" }
        Si dejas "src" vacío, se dibuja una tarjeta ilustrada de recuerdo.
     --------------------------------------------------------------------------- */
  galeria: [
    { src: "", titulo: "El primer día de clase", anio: "2001" },
    { src: "", titulo: "La obra de teatro de Navidad", anio: "2005" },
    { src: "", titulo: "Excursión a la sierra", anio: "2009" },
    { src: "", titulo: "Inauguración de la biblioteca", anio: "2012" },
    { src: "", titulo: "El huerto en primavera", anio: "2016" },
    { src: "", titulo: "Carnaval en el patio", anio: "2019" },
    { src: "", titulo: "El reencuentro", anio: "2022" },
    { src: "", titulo: "Graduación de 6.º", anio: "2025" }
  ],

  /* ---------------------------------------------------------------------------
     8. PARTICIPA  ·  Llamadas a la acción. Pon tus enlaces (formularios, correo…)
     --------------------------------------------------------------------------- */
  participa: [
    {
      icono: "foto",
      titulo: "Comparte tus fotos",
      texto: "¿Guardas fotografías de tu paso por el centro? Súbelas al archivo del 25 aniversario.",
      enlace: "",                    // pega aquí el enlace a tu formulario
      textoEnlace: "Subir fotografías"
    },
    {
      icono: "voz",
      titulo: "Cuéntanos tu recuerdo",
      texto: "Un profesor, una excursión, un patio. Los recuerdos se publican en esta web y formarán el libro del aniversario.",
      nota: "Máximo 400 caracteres, unas cuatro líneas.",
      // Plantilla del correo: solo se usa si se deja vacío el enlace al formulario
      cuerpo:
        "Escribe aquí tu recuerdo (máximo 400 caracteres, unas cuatro líneas):\n\n\n" +
        "Nombre:\n" +
        "Promoción o relación con el centro (por ejemplo: promoción 2009, familia, maestra 2003-2011):\n\n" +
        "¿Autorizas a publicar este recuerdo y tu nombre en la web del 25 aniversario?  SÍ / NO\n",
      enlace: "https://forms.gle/3PU3n8ZmHWQdmBBP9",   // el formulario de recuerdos
      textoEnlace: "Escribir mi recuerdo"
    },
    {
      icono: "mano",
      titulo: "Échanos una mano",
      texto: "Buscamos familias voluntarias para los talleres, la exposición y la verbena de clausura.",
      enlace: "",
      textoEnlace: "Quiero colaborar"
    }
  ],

  /* ---------------------------------------------------------------------------
     9. RECUERDOS  ·  Los testimonios que se publican en la web
        Mientras esta lista esté vacía, la sección no aparece en la web.
        Añade cada recuerdo así, y no olvides la coma final:

          { texto: "Aquí el recuerdo.", autor: "María G.", relacion: "Promoción 2009" },

        Recorta los textos a unas cuatro líneas: en pantalla se leen mejor.
        Publica el nombre solo si esa persona lo ha autorizado.
     --------------------------------------------------------------------------- */
  recuerdos: [
  ],

  /* ---------------------------------------------------------------------------
     10. CIFRAS  ·  Datos destacados del cuarto de siglo
     --------------------------------------------------------------------------- */
  cifras: [
    { valor: "25", texto: "cursos escolares" },
    { valor: "18", texto: "unidades de Infantil y Primaria" },
    { valor: "2001", texto: "año de apertura" },
    { valor: "1", texto: "comunidad educativa" }
  ]
};
