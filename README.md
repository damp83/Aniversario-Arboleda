# 25 Aniversario · CEIP La Arboleda

Web conmemorativa del **25 aniversario** del centro. Sirve como hilo conductor de
todo el curso escolar y reúne el programa de la semana de actos de finales de octubre,
la historia del centro, el himno del aniversario, los proyectos por trimestre y un
álbum de recuerdos.

Está hecha con **HTML, CSS y JavaScript puro**: no necesita instalar nada, no depende
de librerías externas y se publica gratis en **GitHub Pages**.

---

## ✏️ Cómo cambiar el contenido

Casi todo se edita en un único archivo: **`js/datos.js`**.

Ábrelo (desde GitHub: clic en el archivo → icono del lápiz ✏️), cambia el texto entre
comillas, y guarda con *Commit changes*. En 1–2 minutos la web se actualiza sola.

| Qué quieres cambiar | Apartado en `js/datos.js` |
|---|---|
| Nombre del centro, localidad, curso, correo del centro | `centro` |
| Lema, texto de presentación, año de fundación | `aniversario` |
| **Himno**: título, archivo de audio, duración, créditos y letra | `himno` |
| **Correo al que llegan las fotos y los recuerdos** | `aniversario.email` |
| Fechas de la semana de actos y la **cuenta atrás** | `semana` |
| Actividades de cada día | `programa` |
| Hitos de la línea del tiempo | `hitos` |
| Proyectos de cada trimestre | `proyectos` |
| Fotos del álbum | `galeria` |
| Recuerdos que se publican en la web | `recuerdos` |
| Formularios y llamadas a participar | `participa` |
| Cifras destacadas (alumnado, docentes…) | `cifras` |

> ⚠️ **Pendiente de sustituir por contenido real:** los **hitos de la línea del
> tiempo** de 2004 en adelante y el **programa de la semana**, que ahora son
> ejemplos inventados. Los datos del centro (nombre, dirección, contacto) y el
> año de apertura (curso 2001/2002) sí están confirmados.

### Reglas de oro al editar

1. Cambia solo lo que hay **entre comillas**.
2. No borres las comas `,` ni los corchetes `[ ]` y llaves `{ }`.
3. Las fechas van en formato `AAAA-MM-DDTHH:MM` → `"2026-10-26T09:00"`.

---

## 📷 Cómo añadir fotos

**Solo hay que subir el archivo.** En GitHub: entra en `assets/galeria/`, pulsa
*Add file → Upload files*, arrastra las fotos y guarda. Nada más.

A partir de ahí se hace todo solo, en un par de minutos:

| Paso automático | Por qué importa |
|---|---|
| Endereza la foto | Las de móvil se publican giradas si no se corrige |
| **Borra los metadatos** | Las fotos de móvil llevan **las coordenadas GPS** del lugar donde se tomaron |
| Reduce el tamaño (máx. 1600 px) | Una foto de 8 MB haría la web inusable con datos móviles |
| Crea una miniatura (600 px) | La rejilla carga ligera; la foto grande solo al ampliarla |
| Actualiza la galería | Sin editar código, así que no se puede romper nada |

### El nombre del archivo es el título

```
2004-el-patio-en-obras.jpg   →   "El patio en obras", año 2004
merienda-de-antiguos.jpg     →   "Merienda de antiguos", sin año
```

**¿Una foto sin ninguna información?** Súbela tal cual. Los nombres que ponen
solos el móvil, la cámara o WhatsApp (`IMG_20240312_101512.jpg`,
`WhatsApp Image 2024-03-12 at 10.15.32.jpg`…) se detectan y la foto aparece
como **«Recuerdo del centro»**, sin año: la fecha de esos nombres es la del
archivo o la del envío, no la del recuerdo, y mostrarla sería dar una fecha
falsa. Si conoces el año, basta con renombrarla a `2004.jpg`.

Empieza por el año en cuatro cifras si lo conoces y separa las palabras con
guiones. Para cambiar un título, renombra la foto. Las fotos se ordenan solas
por año, y las que no lo llevan van al final.

Se admiten `.jpg`, `.png`, `.webp` y `.heic` (iPhone). Sube el original del
tamaño que sea. La carpeta `mini/` se genera sola: no la toques.

Mientras no haya ninguna foto subida, la galería muestra las tarjetas
ilustradas de `js/datos.js`, para que nunca se vea vacía. En cuanto subas la
primera foto real, esas tarjetas desaparecen.

> ⚠️ **Esto no es el archivo del centro.** Aquí solo van las fotos que se
> publican; guardad los originales en vuestra carpeta privada. Y comprobad la
> autorización de imagen antes de subir nada: lo que se publica aquí es
> público en internet e indexable por los buscadores.

---

## 💬 Cómo publicar un recuerdo

Los recuerdos llegan por correo a `25aniversarioarboleda@gmail.com`. El mensaje
viene ya con el nombre, la promoción y **la autorización para publicarlo**,
porque el botón de la web abre el correo con esa plantilla.

Para publicar uno, añádelo al apartado `recuerdos` de `js/datos.js`:

```js
{ texto: "Aún me acuerdo del olor de la biblioteca recién estrenada.", autor: "María G.", relacion: "Promoción 2009" },
```

- `texto` — el recuerdo. **Recórtalo a unas cuatro líneas** (400 caracteres):
  la gente escribe largo y en pantalla se lee mucho mejor lo breve. Ese límite
  se le indica a quien escribe, pero conviene revisarlo igualmente.
- `autor` — nombre. **Solo si lo ha autorizado.** Si no, déjalo vacío o pon
  algo genérico como "Una familia".
- `relacion` — "Promoción 2009", "Familia", "Maestra 2003-2011"… Lo que sitúe
  a esa persona en la historia del centro.

En la portada se ven **los seis primeros**, y el botón *Abrir el libro de
visitas* lleva a todos (ver más abajo). Mientras no haya ningún recuerdo, la
sección muestra en su lugar una invitación a abrir el libro y escribir el
primero. El libro tiene además su propia entrada en el menú principal.

## 📖 El libro de visitas

`recuerdos.html` reúne **todos** los recuerdos en forma de libro: tapa verde con
letras doradas, guardas con los anillos, portadilla con el escudo y hojas
pautadas con la firma de cada persona. Las páginas se pasan pulsando sobre la
hoja, con las flechas del teclado, con los botones o deslizando el dedo.

- **En el ordenador** se ve abierto, a doble página. **En el móvil**, de una en una.
- **Buscador**: por nombre, promoción o cualquier palabra. Es lo primero que
  hará mucha gente: buscar su propio recuerdo.
- **Leer todo seguido**: todos los recuerdos en una sola hoja larga, sin pasar
  páginas.
- **Botón PDF**: abre la ventana de impresión con el libro maquetado para papel
  (A4): tapa verde a sangre, portadilla con el escudo, los recuerdos a dos
  columnas con páginas numeradas y un colofón con la fecha de la edición.
  Para obtener el archivo, elige **«Guardar como PDF»** como impresora; en el
  móvil, desde esa misma ventana se puede guardar o compartir. Si hay una
  búsqueda activa, el PDF incluye solo esos recuerdos, y la portadilla lo indica.
  También funciona con Ctrl+P.
- Los recuerdos se reparten solos en páginas según lo que ocupa cada uno, y
  **nunca se cortan** entre una página y otra.

No hay que mantenerlo aparte: lee exactamente los mismos recuerdos que la
portada (los de `datos.js` y los de la hoja del formulario). Va en orden de
llegada, como un libro de visitas de verdad: primero los escritos a mano y
después los del formulario, del más antiguo al más reciente.

Dirección: `https://damp83.github.io/Aniversario-Arboleda/recuerdos.html`

## 🤖 Recuerdos automáticos con un formulario de Google

En lugar de copiar cada recuerdo a mano, la web puede leerlos de una hoja de
cálculo. Solo aparecen los que tú marques. Se configura una vez, con la cuenta
`25aniversarioarboleda@gmail.com`:

### 1. El formulario

En [forms.google.com](https://forms.google.com), con la cuenta del aniversario,
crea un formulario en blanco con estas preguntas, **en este orden**:

| # | Pregunta | Tipo | Ajustes |
|---|---|---|---|
| 1 | Tu recuerdo | Párrafo | Obligatoria · ⋮ → *Validación de respuestas* → *Longitud* → *Número máximo de caracteres* → `400` |
| 2 | Nombre | Respuesta corta | Opcional (si se deja vacío, el recuerdo sale sin firma) |
| 3 | Promoción o relación con el centro | Respuesta corta | Opcional. Ej.: promoción 2009, familia, maestra 2003-2011 |
| 4 | Autorización | Casillas, una sola opción: *Autorizo a publicar este recuerdo y mi nombre en la web del 25 aniversario* | Obligatoria |

En la pestaña **Configuración → Respuestas**:
- *Recopilar direcciones de correo electrónico* → **No recopilar**.
- *Limitar a 1 respuesta* → **desactivado**: si lo activas, Google obliga a
  iniciar sesión y mucha gente no podrá responder.

Opcional pero recomendable: en *Personalizar tema* (icono de la paleta), sube la
imagen `assets/cabecera-formulario.png` y elige el color verde `#1c6b3f`.

### 2. La hoja de respuestas

1. En la pestaña *Respuestas* del formulario, pulsa **Vincular con Hojas** →
   *Crear una hoja de cálculo nueva*.
2. En la hoja, escribe `Publicar` en la celda **F1**.
3. Selecciona el rango **F2:F1000** (sin el título) → *Insertar → Casilla de
   verificación*.
4. Crea una pestaña nueva (el **+** de abajo a la izquierda), llámala **`web`**
   y escribe en su celda A1:

   ```
   =QUERY('Respuestas de formulario 1'!A:F; "select A, B, C, D where F = true label A 'fecha', B 'texto', C 'autor', D 'relacion' format A 'yyyy-mm-dd'"; 1)
   ```

   Esa pestaña contiene solo los recuerdos con la casilla marcada, y solo
   texto, nombre, relación y el día en que se escribió. Nunca la hora, la
   autorización ni nada más.

> Si la fórmula da error: si la pestaña de respuestas tiene otro nombre (en
> inglés es *Form Responses 1*), cámbialo en la fórmula; y si la hoja está
> configurada en inglés, cambia los `;` por `,`.

> ⚠️ **No añadas preguntas al formulario después de este paso.** Google
> insertaría una columna nueva y la de *Publicar* dejaría de estar en la F. Si
> hace falta, se puede, pero hay que ajustar la fórmula.

### 3. Publicar la pestaña y conectarla a la web

1. *Archivo → Compartir → Publicar en la web*.
2. En el primer desplegable elige **solo la pestaña `web`** (¡no «Todo el
   documento»!: publicaría también los recuerdos sin aprobar) y en el segundo,
   **Valores separados por comas (.csv)**.
3. Comprueba que en *Contenido publicado y configuración* está marcado
   *Volver a publicar automáticamente cuando se realicen cambios*.
4. Pulsa *Publicar* y copia el enlace.
5. En `js/datos.js`, pega ese enlace en `hojaRecuerdos`, dentro de `aniversario`.
6. Pega el enlace **del formulario** (botón *Enviar* → icono del enlace) en el
   campo `enlace` de la tarjeta «Cuéntanos tu recuerdo», dentro de `participa`.
   Así los botones de la web llevan al formulario en vez de abrir el correo.

### Comprobar que todo está bien

Cada vez que cambia `js/datos.js`, GitHub comprueba solo la hoja y el
formulario: que la web puede leer la pestaña publicada, que **no** es pública
la hoja de respuestas completa y que el formulario se abre sin iniciar sesión.
También se puede lanzar a mano en cualquier momento, por ejemplo si un
recuerdo no aparece: **Actions → Comprobar la hoja de recuerdos → Run
workflow**. El resultado se lee en el resumen de la ejecución.

### A partir de ahí

Llega un recuerdo → marcas su casilla **Publicar** → aparece en la web en unos
minutos (Google tarda hasta cinco en actualizar la versión publicada). Para
retirarlo, desmarca la casilla. No hay que volver a tocar GitHub.

En la portada, los recuerdos de la hoja van después de los escritos a mano en
`recuerdos`, del más reciente al más antiguo; en el libro de visitas, en orden
de llegada. Si la hoja fallara, la web sigue
funcionando con los de `datos.js`. Los textos se muestran siempre como texto:
aunque alguien escribiera código en el formulario, no se ejecuta.

## 🎵 El himno del aniversario

La canción está en `assets/audio/himno-25-aniversario.mp3` y se escucha en la
sección **Himno** de la portada (justo después de la historia). También hay un
acceso directo, *Escucha el himno*, bajo los botones de la portada: lleva a la
sección y empieza a sonar.

- **Reproductor propio**: disco que gira mientras suena, barra para avanzar o
  retroceder (también con las flechas del teclado) y controles en la pantalla
  bloqueada del móvil. El audio **no se descarga hasta que alguien pulsa
  reproducir**, así que no gasta datos a quien solo visita la web.
- **Sección compacta**: el título y el reproductor van en una sola franja, y
  **la letra está plegada** bajo el botón *Ver la letra*. Al abrirla se reparte
  en tres columnas en el ordenador (una en el móvil). Los estribillos se
  destacan y sus repeticiones aparecen como una marca breve.
- **Imprimir la letra**: una hoja A4 con el escudo, el título y la letra a dos
  columnas, lista para fotocopiar y repartir en clase.
- **Descargar la canción**: baja el MP3 con un nombre claro.

**Cambiar la letra o los créditos.** En `js/datos.js`, apartado `himno`. La
letra va entre las comillas invertidas `` ` ``: una estrofa por bloque, separadas
por una línea en blanco. Un bloque que empieza por `[Estribillo]` se destaca;
si pone solo `[Estribillo]`, indica que se repite. Los créditos (`creditos`)
aparecen en letra pequeña bajo el reproductor; si lo dejas vacío (`""`), no se
muestra nada.

**Sustituir la canción** (una versión nueva, grabada por el coro…). Sube el
archivo a `assets/audio/` con el mismo nombre, o con otro y cambia `archivo` en
`datos.js`. Actualiza también `duracion` (formato `"2:49"`), que se muestra
antes de que cargue el audio. Si borras el apartado `himno`, la sección y sus
accesos desaparecen solos.

> El MP3 se ha publicado tal cual se recibió: conserva sus datos internos
> (título, letra, carátula y la credencial de contenido de Suno), que se
> perderían al modificarlo.

## 📣 Difundir: compartir y carteles

**Botones para compartir.** En la sección *Participa* de la portada y al final
del libro de visitas hay botones para enviar el enlace por **WhatsApp** o
**copiarlo**. En el móvil aparece además el menú de compartir del propio
teléfono. Cada botón lleva ya un mensaje escrito, pensado para que el enlace
llegue al antiguo alumnado.

**Carteles con código QR** (`cartel.html`, enlazado en el pie de la portada).
Dos carteles listos para imprimir en A4, o en A3 eligiéndolo en la ventana de
impresión:

- **Web del aniversario**: el 25, las fechas de la semana y un QR a la portada.
- **Deja tu recuerdo**: un QR directo al formulario del libro de visitas.

Los códigos se generan en la propia página a partir de `js/datos.js`: si cambia
el enlace del formulario, el cartel cambia solo. Se ha comprobado que ambos se
leen correctamente, en pantalla y en el PDF impreso. La librería del QR
(`js/vendor/qrcode.js`, licencia MIT) va incluida en el repositorio, sin
depender de servicios externos.

## 🚀 Cómo publicar la web (solo la primera vez)

✅ **La web ya está publicada:** https://damp83.github.io/Aniversario-Arboleda/

### ¿Cómo se actualiza?

Editas `js/datos.js` desde la web de GitHub (icono del lápiz ✏️), guardas con
*Commit changes*, y en un par de minutos la web se republica sola.

GitHub Pages solo permite publicar desde la **rama por defecto** del
repositorio, que es justamente donde se guardan los cambios que haces desde la
web. El flujo de publicación detecta esa rama automáticamente, así que funciona
sin tocar nada aunque más adelante cambies cuál es la principal.

También puedes lanzar la publicación a mano desde
**Actions → Publicar en GitHub Pages → Run workflow**.

La dirección será:
`https://damp83.github.io/Aniversario-Arboleda/`

Para verla en tu ordenador antes de publicar, abre `index.html` con doble clic, o bien
levanta un servidor local:

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

---

## 🖼️ Identidad visual

El **escudo oficial del centro** aparece en la cabecera y, con su rótulo
completo, en el pie de página. Los **anillos de crecimiento** (uno por curso)
se mantienen como emblema propio del aniversario: portada, línea del tiempo y
tarjetas de la galería.

| Archivo | Para qué sirve |
|---|---|
| `assets/escudo.png` | El árbol del logotipo, en la cabecera |
| `assets/logo-centro.png` | El logotipo completo con su rótulo, en el pie |
| `assets/favicon.png` | Icono de la pestaña del navegador |
| `assets/icono-180.png` | Icono al guardar la web en el móvil |
| `assets/og.png` | Vista previa al compartir el enlace (1200 × 630 px) |

Todos se han generado a partir del logotipo oficial, recortado y con el fondo
blanco eliminado. Si el centro os facilita el logotipo en **SVG**, avisad: se
sustituye y ganará nitidez en pantallas grandes.

---

## 🗂️ Estructura del proyecto

```
index.html                 La portada del aniversario
recuerdos.html             El libro de visitas
css/estilos.css            Todo el diseño (colores, tipografías, responsive)
css/libro.css              El diseño del libro de visitas
js/datos.js                👈 EL CONTENIDO: aquí edita el equipo del centro
js/comun.js                Lo que comparten portada y libro (recuerdos, tema…)
js/app.js                  Funcionamiento de la portada (cuenta atrás, galería…)
js/libro.js                Funcionamiento del libro (páginas, búsqueda…)
cartel.html · js/cartel.js Carteles con código QR para imprimir
js/vendor/                 Librería del código QR (MIT)
js/galeria.js              Lista de fotos (se genera sola, no editar)
herramientas/              Procesador automático de las fotos
assets/                    Logo, favicon, imagen para compartir
assets/audio/              El himno del aniversario (MP3)
assets/galeria/            Fotografías del álbum
.github/workflows/         Publicación automática en GitHub Pages
```

---

## ♿ Accesibilidad y detalles técnicos

- Navegación completa con teclado y textos alternativos en todas las imágenes.
- Pestañas del programa con patrón ARIA (flechas, `Inicio` y `Fin`).
- Reproductor del himno manejable con teclado y lector de pantalla; sin
  JavaScript se muestra el reproductor del propio navegador.
- Modo claro y **modo oscuro**, con la preferencia del sistema como punto de partida.
- Respeta `prefers-reduced-motion`: sin animaciones para quien las desactiva.
- Diseño adaptable de móvil a pantalla grande y **hoja de estilos para imprimir**
  el programa (Ctrl+P).
- Cero dependencias externas salvo las tipografías de Google Fonts.
