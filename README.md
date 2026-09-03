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

> ⚠️ **Antes de publicar**, revisa los textos marcados como *EJEMPLO*: el nombre del
> centro, el correo de contacto y sobre todo los **hitos de la línea del tiempo**,
> que ahora contienen fechas inventadas de muestra.

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

El código ya está en la rama **`main`** y el flujo de publicación está listo.
Solo falta **un paso manual**, porque GitHub no permite que un robot active
Pages por primera vez:

1. Entra en **Settings → Pages** del repositorio.
2. En *Build and deployment → Source*, elige **GitHub Actions**.
3. Ve a la pestaña **Actions → Publicar en GitHub Pages → Run workflow**
   (o guarda cualquier cambio en `main`: se publica solo).

A partir de ahí, cada cambio en `main` republica la web automáticamente.

> **Recomendado:** en *Settings → General → Default branch*, marca `main` como
> rama principal. Ahora mismo la rama por defecto es la de trabajo, porque fue
> la primera que se subió al repositorio.

> El despliegue está configurado para la rama `main`. Si prefieres publicar desde
> otra rama, cambia el nombre en `.github/workflows/deploy.yml` (línea `branches:`).

La dirección será:
`https://damp83.github.io/Aniversario-Arboleda/`

Para verla en tu ordenador antes de publicar, abre `index.html` con doble clic, o bien
levanta un servidor local:

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

---

## 🖼️ Imagen de previsualización (WhatsApp, redes)

`assets/og.svg` es la imagen que se ve al compartir el enlace. Muchas apps
—WhatsApp entre ellas— **no admiten SVG**. Para que se vea la previsualización:

1. Abre `assets/og.svg` en el navegador y guárdalo como **PNG de 1200 × 630 px**
   (o pásalo por cualquier conversor SVG → PNG).
2. Sube el resultado como `assets/og.png`.
3. En `index.html`, cambia `content="assets/og.svg"` por `content="assets/og.png"`.

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
