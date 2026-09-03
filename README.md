# 25 Aniversario · CEIP La Arboleda

Web conmemorativa del **25 aniversario** del centro. Sirve como hilo conductor de
todo el curso escolar y reúne el programa de la semana de actos de finales de octubre,
la historia del centro, los proyectos por trimestre y un álbum de recuerdos.

Está hecha con **HTML, CSS y JavaScript puro**: no necesita instalar nada, no depende
de librerías externas y se publica gratis en **GitHub Pages**.

---

## ✏️ Cómo cambiar el contenido

Casi todo se edita en un único archivo: **`js/datos.js`**.

Ábrelo (desde GitHub: clic en el archivo → icono del lápiz ✏️), cambia el texto entre
comillas, y guarda con *Commit changes*. En 1–2 minutos la web se actualiza sola.

| Qué quieres cambiar | Apartado en `js/datos.js` |
|---|---|
| Nombre del centro, localidad, curso, correo | `centro` |
| Lema, texto de presentación, año de fundación | `aniversario` |
| Fechas de la semana de actos y la **cuenta atrás** | `semana` |
| Actividades de cada día | `programa` |
| Hitos de la línea del tiempo | `hitos` |
| Proyectos de cada trimestre | `proyectos` |
| Fotos del álbum | `galeria` |
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

1. Sube las imágenes a la carpeta `assets/galeria/` (en GitHub: *Add file → Upload files*).
2. Añade cada una en el apartado `galeria` de `js/datos.js`:

```js
{ src: "assets/galeria/patio-2004.jpg", titulo: "El patio en obras", anio: "2004" },
```

Si dejas `src: ""`, se muestra una tarjeta ilustrada con anillos de árbol hasta que
consigáis la fotografía. Así la galería nunca se ve rota.

---

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
index.html                 La página completa
css/estilos.css            Todo el diseño (colores, tipografías, responsive)
js/datos.js                👈 EL CONTENIDO: aquí edita el equipo del centro
js/app.js                  Funcionamiento (cuenta atrás, pestañas, galería…)
assets/                    Logo, favicon, imagen para compartir
assets/galeria/            Fotografías del álbum
.github/workflows/         Publicación automática en GitHub Pages
```

---

## ♿ Accesibilidad y detalles técnicos

- Navegación completa con teclado y textos alternativos en todas las imágenes.
- Pestañas del programa con patrón ARIA (flechas, `Inicio` y `Fin`).
- Modo claro y **modo oscuro**, con la preferencia del sistema como punto de partida.
- Respeta `prefers-reduced-motion`: sin animaciones para quien las desactiva.
- Diseño adaptable de móvil a pantalla grande y **hoja de estilos para imprimir**
  el programa (Ctrl+P).
- Cero dependencias externas salvo las tipografías de Google Fonts.
