#!/usr/bin/env python3
"""
Prepara las fotografías de la galería del 25 aniversario.

Qué hace con cada imagen que dejéis en assets/galeria/:

  1. Corrige la orientación (las fotos de móvil se ven giradas si no).
  2. Borra los metadatos, incluida la ubicación GPS que incrusta el móvil.
  3. Reduce el tamaño para que la web cargue rápido, y crea una miniatura.
  4. Deduce el título y el año a partir del nombre del archivo:
         2004-el-patio-en-obras.jpg  ->  "El patio en obras", 2004
  5. Escribe js/galeria.js, que es lo que leen la galería y el álbum.

No hace falta ejecutarlo a mano: GitHub lo lanza solo al subir fotos.
Para probarlo en tu ordenador:  python3 herramientas/preparar-galeria.py
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

# Compatibilidad con las fotos .HEIC del iPhone, si la biblioteca está instalada
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass

RAIZ = Path(__file__).resolve().parent.parent
GALERIA = RAIZ / "assets" / "galeria"
MINIATURAS = GALERIA / "mini"
SALIDA = RAIZ / "js" / "galeria.js"

ANCHO_GRANDE = 1600      # para el visor a pantalla completa
ANCHO_MINI = 600         # para la rejilla de la galería
CALIDAD = 82
PESO_ACEPTABLE = 900_000  # si ya pesa menos, no se vuelve a comprimir

EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
# Palabras que ponen solos el móvil, la cámara o WhatsApp: no describen nada
PALABRAS_DE_CAMARA = {
    "img", "dsc", "dscn", "dscf", "pxl", "mvimg", "vid", "photo", "foto", "fotos",
    "image", "imagen", "whatsapp", "wa", "at", "screenshot", "captura", "de",
    "pantalla", "p", "copia", "copy", "edited", "editada", "scan", "escaneo",
    "sin", "titulo", "título", "untitled", "n",
}
TITULO_GENERICO = "Recuerdo del centro"

# Cuatro cifras que son un año razonable para el colegio (1990-2039)
_ANIO = r"(?:19[9]\d|20[0-3]\d)"


def es_nombre_automatico(texto: str) -> bool:
    """True si el nombre lo puso el aparato y no una persona (IMG_2024..., etc.)."""
    palabras = re.findall(r"[a-záéíóúñü]+", texto.lower())
    return not any(p not in PALABRAS_DE_CAMARA for p in palabras)


def busca_anio(nombre: str) -> tuple[str, str]:
    """Busca el año en cualquier parte del nombre y lo quita del texto.
    Devuelve (año, resto del nombre). Entiende:
      2004-el-patio · COMENIUS 2011 275 · Mural_2026 · 2010-2011 delantales
      claustro26-27 (curso 2026/27) · 20160908_162421 (fecha de la cámara)
    Pero no usa la fecha de WhatsApp o de una captura (IMG-20240312-WA0001):
    es la del envío, no la del recuerdo."""
    bajo = nombre.lower()
    if re.search(r"(^|[^a-z])(wa\d|whatsapp|screenshot|captura)", bajo):
        return "", nombre
    # Curso con dos años: 2010-2011, 2010/11, 2010-11
    m = re.search(rf"(?<!\d)({_ANIO})\s*[-/_]\s*(\d{{2}}|{_ANIO})(?!\d)", nombre)
    if m and int(m.group(2)[-2:]) == (int(m.group(1)) + 1) % 100:
        return m.group(1), nombre[:m.start()] + " " + nombre[m.end():]
    # Fecha de cámara: 20160908_162421 o 20160908
    m = re.search(rf"(?<!\d)({_ANIO})(0[1-9]|1[0-2])([0-2]\d|3[01])(?:[_-]?\d{{6}})?(?!\d)", nombre)
    if m:
        return m.group(1), nombre[:m.start()] + " " + nombre[m.end():]
    # Un año suelto, como palabra propia
    m = re.search(rf"(?<!\d)({_ANIO})(?!\d)", nombre)
    if m:
        return m.group(1), nombre[:m.start()] + " " + nombre[m.end():]
    # Curso abreviado: 26-27 → 2026
    m = re.search(r"(?<!\d)(\d{2})\s*[-/]\s*(\d{2})(?!\d)", nombre)
    if m and int(m.group(2)) == (int(m.group(1)) + 1) % 100 and int(m.group(1)) <= 39:
        return f"20{m.group(1)}", nombre[:m.start()] + " " + nombre[m.end():]
    return "", nombre


def titulo_desde_nombre(nombre: str) -> tuple[str, str]:
    """'2004-el-patio-en-obras' -> ('El patio en obras', '2004')
       'Docentes 10'            -> ('Docentes', '')
       'IMG_20240312_101512'    -> ('Recuerdo del centro', '2024')
       '4b807b36-13a3-…'        -> ('Recuerdo del centro', '')"""
    nombre = unicodedata.normalize("NFC", nombre).strip()
    anio, resto = busca_anio(nombre)

    texto = re.sub(r"\(\d+\)", " ", resto)                 # copias: «foto (1)»
    texto = re.sub(r"[-_.]+", " ", texto)
    # Identificadores sin sentido: códigos hexadecimales y números largos
    texto = re.sub(r"\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{4,}\b", " ", texto, flags=re.I)
    texto = re.sub(r"\b\d+\b", " ", texto)                   # contadores: «Docentes 10», «0067»
    texto = re.sub(r"(?<=[a-záéíóúñ])\d+\b", "", texto, flags=re.I)  # «Huerto2»
    texto = re.sub(r"\s+", " ", texto).strip()
    if not texto or es_nombre_automatico(texto):
        return TITULO_GENERICO, anio
    if texto.isupper():                                       # «COMENIUS» → «Comenius»
        texto = texto.lower()
    return texto[0].upper() + texto[1:], anio


def redimensiona(img: Image.Image, ancho_max: int) -> Image.Image:
    if img.width <= ancho_max:
        return img
    alto = round(img.height * ancho_max / img.width)
    return img.resize((ancho_max, alto), Image.LANCZOS)


def guarda(img: Image.Image, destino: Path) -> None:
    """Guarda sin metadatos. JPEG progresivo salvo que haga falta transparencia."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    if destino.suffix.lower() == ".png":
        img.save(destino, "PNG", optimize=True)
    else:
        img.convert("RGB").save(destino, "JPEG", quality=CALIDAD,
                                optimize=True, progressive=True)


def procesa(origen: Path) -> dict | None:
    try:
        with Image.open(origen) as img:
            img = ImageOps.exif_transpose(img)      # endereza según el sensor
            img.load()
            ancho_original, tiene_alfa = img.width, img.mode in ("RGBA", "LA", "P")

            # Formatos que el navegador no entiende: se pasan a JPEG
            destino = origen
            if origen.suffix.lower() in {".heic", ".heif"}:
                destino = origen.with_suffix(".jpg")
            elif origen.suffix.lower() == ".png" and not tiene_alfa:
                destino = origen.with_suffix(".jpg")

            # Una foto ya preparada (tiene miniatura) no se vuelve a comprimir por
            # su peso: cada pasada le quitaría un poco de calidad
            ya_preparada = (MINIATURAS / (destino.stem + destino.suffix)).exists()
            hay_que_tocarla = (
                destino != origen
                or ancho_original > ANCHO_GRANDE
                or (origen.stat().st_size > PESO_ACEPTABLE and not ya_preparada)
                or bool(img.getexif())
            )
            if hay_que_tocarla:
                guarda(redimensiona(img, ANCHO_GRANDE), destino)
                if destino != origen:
                    origen.unlink()
                print(f"  · {origen.name}: {ancho_original}px -> {destino.name}")

            mini = MINIATURAS / (destino.stem + destino.suffix)
            if not mini.exists():
                guarda(redimensiona(img, ANCHO_MINI), mini)

            # Medidas de la foto tal como se publica: el álbum las usa para
            # colocar juntas dos verticales o una horizontal sobre otra
            ancho, alto = img.size
            if ancho > ANCHO_GRANDE:
                ancho, alto = ANCHO_GRANDE, round(alto * ANCHO_GRANDE / ancho)

            titulo, anio = titulo_desde_nombre(destino.stem)
            return {
                "src": f"assets/galeria/{destino.name}",
                "mini": f"assets/galeria/mini/{mini.name}",
                "titulo": titulo,
                "anio": anio,
                "ancho": ancho,
                "alto": alto,
            }
    except Exception as error:                      # una foto rota no tumba el resto
        print(f"  ! No se ha podido procesar {origen.name}: {error}", file=sys.stderr)
        return None


def main() -> int:
    GALERIA.mkdir(parents=True, exist_ok=True)
    fotos = [f for f in sorted(GALERIA.iterdir())
             if f.is_file() and f.suffix.lower() in EXTENSIONES]

    print(f"Fotografías encontradas: {len(fotos)}")
    entradas = [e for e in (procesa(f) for f in fotos) if e]
    # Orden cronológico; las que no traen año, al final
    entradas.sort(key=lambda e: (e["anio"] or "9999", e["titulo"]))

    # Limpia miniaturas de fotos ya borradas
    if MINIATURAS.exists():
        vigentes = {Path(e["mini"]).name for e in entradas}
        for m in MINIATURAS.iterdir():
            if m.is_file() and m.name not in vigentes:
                m.unlink()
                print(f"  · miniatura huérfana eliminada: {m.name}")

    cuerpo = json.dumps(entradas, ensure_ascii=False, indent=2)
    SALIDA.write_text(
        "/* Archivo generado automáticamente al subir fotos a assets/galeria/.\n"
        "   No lo edites a mano: se sobrescribe solo.\n"
        "   Para cambiar el título o el año de una foto, renombra su archivo. */\n"
        f"const GALERIA_AUTO = {cuerpo};\n",
        encoding="utf-8",
    )
    print(f"js/galeria.js actualizado con {len(entradas)} fotografías")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
