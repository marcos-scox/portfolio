#!/usr/bin/env python3
"""
Gera mockups de celular a partir dos prints do Forja.

O que faz em cada print:
  1. corta a barra de status do Android (hora, bateria, wifi) e a barra
     de gestos de baixo — o que sobra é só a interface do app
  2. arredonda os cantos como a tela real
  3. monta uma moldura de aparelho (bezel escuro, brilho na borda,
     reflexo diagonal sutil no vidro)
  4. exporta PNG com fundo transparente, para o CSS posicionar,
     rotacionar e sobrepor os aparelhos livremente

Uso:
    python3 gerar-mockups-forja.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True     # prints de celular chegam truncados

AQUI = os.path.dirname(os.path.abspath(__file__))
ENTRADA = "/root/.claude/uploads/9f9e2c5f-1499-5425-a3cb-efa2fdde75fb"

# print original -> nome de saída
TELAS = {
    "96922387-image.jpg": "treinos",
    "3fa854d5-image.jpg": "cardio",
    "39454faa-image.jpg": "coach",
    "fd7d5ac6-image.jpg": "historico",
    "280feb1c-image.jpg": "ajustes",
}

# fração da altura ocupada pela barra de status (topo) e de gestos (base)
CORTE_TOPO = 0.038
CORTE_BASE = 0.008

LARGURA_FINAL = 620          # largura da tela dentro da moldura


def cantos_arredondados(img, raio):
    mascara = Image.new("L", img.size, 0)
    ImageDraw.Draw(mascara).rounded_rectangle(
        [0, 0, img.size[0] - 1, img.size[1] - 1], raio, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mascara)
    return out


def reflexo(tamanho, raio):
    """Faixa diagonal clara, como luz batendo no vidro."""
    w, h = tamanho
    camada = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(camada)
    d.polygon([(-w * 0.1, 0), (w * 0.42, 0), (-w * 0.05, h), (-w * 0.6, h)], fill=26)
    camada = camada.filter(ImageFilter.GaussianBlur(w * 0.05))
    limite = Image.new("L", (w, h), 0)
    ImageDraw.Draw(limite).rounded_rectangle([0, 0, w - 1, h - 1], raio, fill=255)
    camada = ImageChops.multiply(camada, limite)
    brilho = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    brilho.putalpha(camada)
    return brilho


def montar(caminho, largura_tela=LARGURA_FINAL):
    tela = Image.open(caminho).convert("RGB")
    w, h = tela.size

    # 1. tira barra de status e barra de gestos
    tela = tela.crop((0, round(h * CORTE_TOPO), w, round(h * (1 - CORTE_BASE))))

    # 2. redimensiona
    altura_tela = round(tela.height * largura_tela / tela.width)
    tela = tela.resize((largura_tela, altura_tela), Image.LANCZOS)

    raio_tela = round(largura_tela * 0.085)
    tela = cantos_arredondados(tela, raio_tela)
    tela = Image.alpha_composite(tela, reflexo(tela.size, raio_tela))

    # 3. moldura do aparelho
    bezel = max(9, round(largura_tela * 0.021))
    lw, lh = largura_tela + bezel * 2, altura_tela + bezel * 2
    raio_ap = raio_tela + bezel

    # margem extra para caber o brilho externo sem cortar
    folga = round(largura_tela * 0.13)
    canvas = Image.new("RGBA", (lw + folga * 2, lh + folga * 2), (0, 0, 0, 0))

    # brilho verde suave atrás do aparelho
    halo = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(halo).rounded_rectangle(
        [folga, folga, folga + lw, folga + lh], raio_ap, fill=(185, 242, 39, 62))
    canvas = Image.alpha_composite(canvas, halo.filter(ImageFilter.GaussianBlur(folga * 0.72)))

    # sombra projetada
    sombra = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rounded_rectangle(
        [folga, folga + round(bezel * 2.2), folga + lw, folga + lh + round(bezel * 2.2)],
        raio_ap, fill=(0, 0, 0, 165))
    canvas = Image.alpha_composite(canvas, sombra.filter(ImageFilter.GaussianBlur(folga * 0.42)))

    # corpo do aparelho
    corpo = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(corpo)
    cd.rounded_rectangle([folga, folga, folga + lw, folga + lh], raio_ap, fill=(16, 18, 20, 255))
    # borda clara em cima, escura embaixo: dá volume ao metal
    cd.rounded_rectangle([folga, folga, folga + lw, folga + lh], raio_ap,
                         outline=(78, 84, 90, 255), width=2)
    cd.arc([folga, folga, folga + lw, folga + lh], 185, 355, fill=(122, 130, 138, 255), width=2)
    canvas = Image.alpha_composite(canvas, corpo)

    canvas.paste(tela, (folga + bezel, folga + bezel), tela)

    # câmera frontal (furo na tela)
    fd = ImageDraw.Draw(canvas)
    r = max(5, round(largura_tela * 0.011))
    cx = folga + bezel + largura_tela // 2
    cy = folga + bezel + round(largura_tela * 0.043)
    fd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(6, 7, 8, 255))
    fd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(40, 44, 48, 255), width=1)

    return canvas


def main():
    saida = os.path.join(AQUI, "forja")
    os.makedirs(saida, exist_ok=True)
    for arq, nome in TELAS.items():
        caminho = os.path.join(ENTRADA, arq)
        if not os.path.exists(caminho):
            print(f"  faltando: {arq}")
            continue
        for larg, sufixo in [(620, ""), (340, "-sm")]:
            m = montar(caminho, larg)
            destino = os.path.join(saida, f"{nome}{sufixo}.png")
            m.save(destino, "PNG", optimize=True)
        print(f"  ok: {nome}.png  {m.size}")
    print(f"\nmockups em {saida}")


if __name__ == "__main__":
    main()
