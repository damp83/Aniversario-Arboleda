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
    anioFundacion: 2001,
    lema: "25 años sembrando futuro",
    entradilla:
      "Un cuarto de siglo de patios, de primeras letras, de excursiones y de " +
      "abrazos en la puerta. Celebramos 25 cursos de comunidad educativa con " +
      "un proyecto que recorrerá todo el año.",
    hashtag: "#25AñosArboleda"
  },

  /* ---------------------------------------------------------------------------
     3. LA SEMANA CONMEMORATIVA  ·  Formato de fecha: AAAA-MM-DDTHH:MM
        La cuenta atrás de la portada apunta a "inicio".
     --------------------------------------------------------------------------- */
  semana: {
    titulo: "Semana del 25 Aniversario",
    inicio: "2026-10-26T09:00",
    fin: "2026-10-30T14:00",
    fechaTexto: "26 – 30 de octubre de 2026",
    descripcion:
      "Cinco días de actos conmemorativos abiertos al alumnado, a las familias " +
      "y a todas las personas que han pasado por el centro."
  },

  /* ---------------------------------------------------------------------------
     4. PROGRAMA DE LA SEMANA  ·  Un bloque por día, con sus actividades
        publico: "Alumnado" | "Familias" | "Toda la comunidad" | "Antiguo alumnado"
     --------------------------------------------------------------------------- */
  programa: [
    {
      dia: "Lunes 26",
      lema: "El día de la semilla",
      resumen: "Arrancamos la semana plantando: memoria, árboles e ilusión.",
      actividades: [
        { hora: "09:15", titulo: "Acto de apertura en el patio", lugar: "Patio central", publico: "Toda la comunidad",
          texto: "Izado de la bandera del 25 aniversario y lectura del manifiesto escrito por el alumnado de 6.º." },
        { hora: "11:00", titulo: "Plantación del árbol conmemorativo", lugar: "Jardín de entrada", publico: "Alumnado",
          texto: "Cada clase aporta un puñado de tierra y un deseo para los próximos 25 años." },
        { hora: "15:30", titulo: "Apertura de la exposición fotográfica", lugar: "Sala de usos múltiples", publico: "Familias",
          texto: "25 años en imágenes: fotografías cedidas por familias, docentes y antiguo alumnado." }
      ]
    },
    {
      dia: "Martes 27",
      lema: "El día de la memoria",
      resumen: "Escuchamos a quienes escribieron los primeros capítulos del centro.",
      actividades: [
        { hora: "10:00", titulo: "Encuentro con el profesorado fundador", lugar: "Biblioteca", publico: "Alumnado",
          texto: "Charla-coloquio con maestras y maestros que abrieron el centro en 2001." },
        { hora: "12:00", titulo: "Radio Arboleda: 25 años en directo", lugar: "Aula de música", publico: "Alumnado",
          texto: "Programa de radio escolar con entrevistas, cuñas publicitarias de época y música." },
        { hora: "17:00", titulo: "Café con las familias fundadoras", lugar: "Comedor", publico: "Familias",
          texto: "Merienda intergeneracional y recogida de recuerdos para el archivo del centro." }
      ]
    },
    {
      dia: "Miércoles 28",
      lema: "El día del juego",
      resumen: "Los juegos de ayer y los de hoy comparten patio.",
      actividades: [
        { hora: "09:30", titulo: "Gymkana de las 25 pruebas", lugar: "Todo el centro", publico: "Alumnado",
          texto: "Equipos mixtos de Infantil y Primaria recorren 25 estaciones, una por curso." },
        { hora: "12:30", titulo: "Patio retro: juegos populares", lugar: "Pista deportiva", publico: "Toda la comunidad",
          texto: "Comba, gomas, chapas y peonzas dinamizados por familias voluntarias." }
      ]
    },
    {
      dia: "Jueves 29",
      lema: "El día de la creación",
      resumen: "El centro entero se convierte en taller.",
      actividades: [
        { hora: "09:30", titulo: "Mural colaborativo del 25 aniversario", lugar: "Fachada del gimnasio", publico: "Alumnado",
          texto: "Diseño del alumnado de 5.º y 6.º pintado por todos los niveles a lo largo del día." },
        { hora: "11:30", titulo: "Talleres intergeneracionales", lugar: "Aulas de Primaria", publico: "Toda la comunidad",
          texto: "Abuelas y abuelos, familias y docentes comparten oficios, recetas y saberes." },
        { hora: "16:30", titulo: "Sellado de la cápsula del tiempo", lugar: "Vestíbulo", publico: "Toda la comunidad",
          texto: "Guardamos cartas, dibujos y objetos para abrir en el 50 aniversario." }
      ]
    },
    {
      dia: "Viernes 30",
      lema: "El día de la fiesta",
      resumen: "Cerramos la semana con la gran celebración de comunidad.",
      actividades: [
        { hora: "10:00", titulo: "Festival del 25 aniversario", lugar: "Pista cubierta", publico: "Toda la comunidad",
          texto: "Cada nivel presenta su número: danza, teatro, coro y percusión corporal." },
        { hora: "12:30", titulo: "Foto de familia: 25 años juntos", lugar: "Patio central", publico: "Toda la comunidad",
          texto: "Toda la comunidad educativa formando el número 25 vista desde el aire." },
        { hora: "18:00", titulo: "Verbena solidaria y reencuentro", lugar: "Patio central", publico: "Antiguo alumnado",
          texto: "Música, barra de la AMPA y reencuentro de las promociones desde 2001." }
      ]
    }
  ],

  /* ---------------------------------------------------------------------------
     5. LÍNEA DEL TIEMPO  ·  Los hitos del centro (⚠️ EJEMPLOS: sustitúyelos)
     --------------------------------------------------------------------------- */
  hitos: [
    { anio: "2001", titulo: "Se abren las puertas", texto: "El centro recibe a su primera promoción de alumnado de Infantil y Primaria." },
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
      texto: "Un profesor, una excursión, un patio. Recogemos los recuerdos que formarán el libro del aniversario.",
      enlace: "",
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
     9. CIFRAS  ·  Datos destacados del cuarto de siglo
     --------------------------------------------------------------------------- */
  cifras: [
    { valor: "25", texto: "cursos escolares" },
    { valor: "18", texto: "unidades de Infantil y Primaria" },
    { valor: "2001", texto: "año de apertura" },      // ⚠️ confirmar en secretaría
    { valor: "1", texto: "comunidad educativa" }
  ]
};
