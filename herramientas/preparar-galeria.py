#!/usr/bin/env python3
"""
Prepara las fotografías de la galería del 25 aniversario.

Qué hace con cada imagen que dejéis en assets/galeria/:

  1. Corrige la orientación (las fotos de móvil se ven giradas si no).
  2. Borra los metadatos, incluida la ubicación GPS que incrusta el móvil.
  3. Reduce el tamaño para que la web cargue rápido, y crea una miniatura.
  4. Deduce el título y el año a partir del nombre del archivo:
         2004-el-patio-en-obras.jpg  ->  "El patio en obras", 2004
  5. Escribe js/galeria.js, que es lo que lee la web.

No hace falta ejecutarlo a mano: GitHub lo lanza solo al subir fotos.
Para probarlo en tu ordenador:  python3 herramientas/preparar-galeria.py
"""

import json
import re
import sys
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
ANIO = re.compile(r"^(1[89]\d{2}|20\d{2})[-_ .]+(.*)$")


def titulo_desde_nombre(nombre: str) -> tuple[str, str]:
    """'2004-el-patio-en-obras' -> ('El patio en obras', '2004')"""
    coincide = ANIO.match(nombre)
    anio, resto = (coincide.group(1), coincide.group(2)) if coincide else ("", nombre)
    texto = re.sub(r"[-_]+", " ", resto).strip()
    texto = re.sub(r"\s+", " ", texto)
    if not texto:
        texto = f"Recuerdo de {anio}" if anio else "Recuerdo"
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

            hay_que_tocarla = (
                destino != origen
                or ancho_original > ANCHO_GRANDE
                or origen.stat().st_size > PESO_ACEPTABLE
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

            titulo, anio = titulo_desde_nombre(destino.stem)
            return {
                "src": f"assets/galeria/{destino.name}",
                "mini": f"assets/galeria/mini/{mini.name}",
                "titulo": titulo,
                "anio": anio,
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
