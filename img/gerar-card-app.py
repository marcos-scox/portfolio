#!/usr/bin/env python3
"""
Monta a imagem de card (1168x784) a partir de um print de celular.

Um print de celular é vertical; o card do site é horizontal. Colocar o print
direto no card cortaria quase tudo. Este script compõe: fundo escuro na
paleta do site + o print dentro de uma moldura de celular, centralizado.

Uso:
    python3 gerar-card-app.py print-do-celular.png forja

Gera forja.webp (1168x784) e forja-sm.webp (640x430) nesta pasta.
Se houver 2 ou 3 prints, passe todos que ele posiciona lado a lado:
    python3 gerar-card-app.py tela1.png tela2.png tela3.png forja
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageFile

# prints vindos de celular/upload às vezes chegam com os últimos bytes
# faltando; sem isto o PIL recusa o arquivo inteiro
ImageFile.LOAD_TRUNCATED_IMAGES = True

LARG, ALT = 1168, 784
BG_TOPO, BG_BASE = (24, 34, 46), (11, 15, 20)   # mesmo gradiente do card vazio
ACENTO = (137, 170, 204)                         # --a1 do site


def fundo():
    """Gradiente vertical + leve brilho no topo."""
    img = Image.new("RGB", (LARG, ALT), BG_BASE)
    d = ImageDraw.Draw(img)
    for y in range(ALT):
        t = (y / ALT) ** 0.75
        d.line([(0, y), (LARG, y)], fill=tuple(
            round(BG_TOPO[i] + (BG_BASE[i] - BG_TOPO[i]) * t) for i in range(3)))
    # brilho suave atrás dos celulares
    glow = Image.new("RGB", (LARG, ALT), BG_BASE)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([LARG*0.15, -ALT*0.35, LARG*0.85, ALT*0.75], fill=(30, 44, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    return Image.blend(img, glow, 0.45)


def cantos(img, raio):
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, img.size[0]-1, img.size[1]-1], raio, fill=255)
    out = img.convert("RGBA"); out.putalpha(m)
    return out


def celular(print_path, altura):
    """Print recortado com cantos arredondados e uma borda fina."""
    tela = Image.open(print_path).convert("RGB")
    larg = round(tela.width * altura / tela.height)
    tela = tela.resize((larg, altura), Image.LANCZOS)
    raio = max(14, round(larg * 0.075))
    tela = cantos(tela, raio)
    # moldura: 3px do tom do fundo claro
    b = 3
    moldura = Image.new("RGBA", (larg + b*2, altura + b*2), (0, 0, 0, 0))
    ImageDraw.Draw(moldura).rounded_rectangle(
        [0, 0, larg + b*2 - 1, altura + b*2 - 1], raio + b, fill=(58, 69, 83, 255))
    moldura.paste(tela, (b, b), tela)
    return moldura


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__); sys.exit(1)
    *prints, nome = args
    for p in prints:
        if not os.path.exists(p):
            print(f"não encontrei: {p}"); sys.exit(1)

    base = fundo().convert("RGBA")

    # O card usa object-fit:cover com o topo alinhado, então os ~54px de baixo
    # somem no recorte. E o texto do card (título + descrição) ocupa a faixa
    # inferior esquerda. Por isso os celulares ficam à direita e bem acima da base.
    AREA_VISIVEL = 730                     # altura que sobrevive ao recorte
    altura = {1: 560, 2: 520, 3: 470}.get(len(prints), 440)
    fotos = [celular(p, altura) for p in prints]

    espaco = 30
    total = sum(f.width for f in fotos) + espaco * (len(fotos) - 1)
    if len(prints) == 1:
        x = round(LARG * 0.60)             # à direita, deixando a esquerda livre pro texto
        x = min(x, LARG - total - 60)
    else:
        x = LARG - total - 60              # encostados à direita
    x = max(x, 40)
    y = (AREA_VISIVEL - altura) // 2       # centralizado só na área que aparece

    for f in fotos:
        sombra = Image.new("RGBA", base.size, (0, 0, 0, 0))
        sombra.paste((0, 0, 0, 170), (x + 6, y + 16), f.split()[3])
        base = Image.alpha_composite(base, sombra.filter(ImageFilter.GaussianBlur(26)))
        base.paste(f, (x, y), f)
        x += f.width + espaco

    final = base.convert("RGB")
    saida = os.path.dirname(os.path.abspath(__file__))
    final.save(os.path.join(saida, f"{nome}.webp"), "WEBP", quality=84, method=6)
    final.resize((640, round(640 * ALT / LARG)), Image.LANCZOS).save(
        os.path.join(saida, f"{nome}-sm.webp"), "WEBP", quality=82, method=6)
    print(f"gerado: {nome}.webp ({LARG}x{ALT}) e {nome}-sm.webp")


if __name__ == "__main__":
    main()
