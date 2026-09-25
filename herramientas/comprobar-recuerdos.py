#!/usr/bin/env python3
"""
Comprueba que la hoja de recuerdos y el formulario están bien configurados.

GitHub lo ejecuta solo cada vez que cambia js/datos.js, y se puede lanzar a
mano desde Actions → «Comprobar la hoja de recuerdos» → Run workflow. El
resultado aparece en el resumen de la ejecución.

Comprueba:
  1. Que la pestaña publicada responde y tiene las columnas que espera la web.
  2. Que la web puede leerla desde otro dominio (cabecera CORS).
  3. Que NO está publicada la hoja de respuestas completa (privacidad).
  4. Que el formulario se abre sin obligar a iniciar sesión.
"""

import csv
import io
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.request

ORIGEN_WEB = "https://damp83.github.io"
COLUMNAS_WEB = {"fecha", "texto", "autor", "relacion"}
# Encabezados que solo tiene la hoja de respuestas: si aparecen, se está publicando de más
SOLO_EN_RESPUESTAS = ("marca temporal", "timestamp", "autoriz", "publicar")

informe, fallos = [], 0


def linea(texto=""):
    informe.append(texto)
    print(texto)


def mal(texto):
    global fallos
    fallos += 1
    linea(f"- ❌ {texto}")


def bien(texto):
    linea(f"- ✅ {texto}")


def normaliza(t):
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn").strip().lower()


def pedir(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (comprobador del 25 aniversario)",
                                                "Origin": ORIGEN_WEB})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.headers, r.read().decode("utf-8", "replace"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, e.headers, "", url
    except Exception as e:                                     # sin conexión, DNS…
        return 0, {}, str(e), url


def main():
    datos = open(os.path.join(os.path.dirname(__file__), "..", "js", "datos.js"), encoding="utf-8").read()
    m = re.search(r'hojaRecuerdos:\s*"([^"]*)"', datos)
    hoja = m.group(1).strip() if m else ""
    m = re.search(r'icono:\s*"voz".*?enlace:\s*"([^"]*)"', datos, re.S)
    formulario = m.group(1).strip() if m else ""

    linea("## Comprobación de la hoja de recuerdos")
    linea()
    if not hoja:
        linea("ℹ️ No hay hoja configurada (`hojaRecuerdos` está vacío en js/datos.js). Nada que comprobar.")
        return 0

    # 1 y 2 · La pestaña publicada
    linea("### Pestaña publicada")
    estado, cabeceras, cuerpo, _ = pedir(hoja)
    if estado != 200:
        mal(f"La hoja no responde (HTTP {estado or 'sin conexión'}). ¿Sigue publicada en la web?")
    else:
        filas = list(csv.reader(io.StringIO(cuerpo)))
        encabezado = [normaliza(c) for c in (filas[0] if filas else [])]
        if "texto" not in encabezado:
            mal(f"No tiene la columna «texto». Encabezados recibidos: {filas[0] if filas else '(vacía)'}. "
                "Revisa la fórmula de la pestaña «web».")
        else:
            bien(f"Responde y tiene las columnas: {', '.join(filas[0])}")
            sobran = [c for c in encabezado if c and c not in COLUMNAS_WEB]
            if sobran:
                mal(f"Publica columnas de más: {', '.join(sobran)}. Solo deberían salir fecha, texto, autor y relacion.")
            recuerdos = [f for f in filas[1:] if any(v.strip() for v in f)]
            bien(f"Recuerdos aprobados publicados: {len(recuerdos)}")
            for f in recuerdos[:10]:
                fila = dict(zip(encabezado, f))
                linea(f"  - {fila.get('fecha', '')} · {fila.get('autor') or '(sin firma)'} · "
                      f"{fila.get('relacion', '')} · «{fila.get('texto', '')[:70]}»")
            if "fecha" in encabezado and any(not re.match(r"\d{4}-\d{2}-\d{2}", dict(zip(encabezado, f)).get("fecha", ""))
                                               for f in recuerdos):
                mal("Alguna fecha no tiene el formato AAAA-MM-DD: revisa el final de la fórmula (format A 'yyyy-mm-dd').")
        permiso = (cabeceras.get("Access-Control-Allow-Origin") or "").strip()
        if permiso in ("*", ORIGEN_WEB):
            bien(f"La web tiene permiso para leerla desde otro dominio (CORS: {permiso})")
        else:
            mal(f"La hoja no permite que la web la lea (CORS: «{permiso or 'ausente'}»).")

    # 3 · Privacidad: la hoja de respuestas completa no debe ser pública
    linea()
    linea("### Privacidad")
    base = hoja.split("?")[0]
    expuesta = False
    for prueba in (f"{base}?output=csv", f"{base}?gid=0&single=true&output=csv"):
        estado, _, cuerpo, _ = pedir(prueba)
        if estado == 200 and cuerpo:
            primera = normaliza(cuerpo.splitlines()[0]) if cuerpo.splitlines() else ""
            if any(p in primera for p in SOLO_EN_RESPUESTAS):
                expuesta = True
    if expuesta:
        mal("¡La hoja de RESPUESTAS completa es pública! Se ven también los recuerdos sin aprobar. "
            "En Archivo → Compartir → Publicar en la web, publica solo la pestaña «web».")
    else:
        bien("La hoja de respuestas completa no es pública: solo se ve la pestaña «web»")

    # 4 · El formulario
    linea()
    linea("### Formulario")
    if not formulario:
        linea("ℹ️ La tarjeta «Cuéntanos tu recuerdo» no enlaza a ningún formulario (usa el correo).")
    else:
        estado, _, cuerpo, final = pedir(formulario)
        if estado != 200:
            mal(f"El formulario no se abre (HTTP {estado or 'sin conexión'}): {formulario}")
        elif "accounts.google.com" in final or "ServiceLogin" in final:
            mal("El formulario obliga a iniciar sesión. En Configuración → Respuestas, desactiva «Limitar a 1 respuesta».")
        else:
            titulo = re.search(r"<title>(.*?)</title>", cuerpo, re.S)
            bien(f"Se abre sin iniciar sesión: «{(titulo.group(1).strip() if titulo else formulario)}»")
            if "no longer accepting responses" in cuerpo or "ya no acepta respuestas" in cuerpo:
                mal("El formulario está cerrado: no acepta respuestas.")

    linea()
    linea("**Resultado:** " + ("todo correcto ✅" if not fallos else f"{fallos} problema(s) que revisar ❌"))
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write("\n".join(informe) + "\n")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
