#!/usr/bin/env python3
"""
Gera os mockups do TRENNIX reaproveitando a moldura do Forja.

Importa gerar-mockups-forja.py em vez de copiar o código: a moldura
(bezel, brilho na borda, reflexo no vidro, halo verde e sombra) fica
definida num lugar só, então os dois apps continuam idênticos se algum
dia eu mexer no desenho do aparelho.

Saídas:
  img/trennix/<tela>.png e -sm.png  -> blocos do modal
  img/trennix-1..5.webp e -sm       -> slider do card no bento

Uso:
    python3 gerar-mockups-trennix.py
"""
import importlib.util
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
ENTRADA = "/root/.claude/uploads/9f9e2c5f-1499-5425-a3cb-efa2fdde75fb"

# carrega o script do Forja (o hífen no nome impede um import normal)
_spec = importlib.util.spec_from_file_location(
    "mockups_forja", os.path.join(AQUI, "gerar-mockups-forja.py"))
forja = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(forja)

# print original -> nome da tela, na ordem em que aparecem no slider
TELAS = [
    ("dd6868e4-image.jpg", "perfil"),      # Configurações / perfil
    ("496251ef-image.jpg", "biblioteca"),  # Biblioteca — treinos em casa
    ("6d178aeb-image.jpg", "academia"),    # Biblioteca — treinos na academia
    ("a149ff0c-image.jpg", "agenda"),      # Agenda semanal
    ("335f5446-image.jpg", "chat"),        # Chat IA
    ("54592831-image.jpg", "provedor"),    # Escolha de provedor de IA
]


def main():
    saida = os.path.join(AQUI, "trennix")
    os.makedirs(saida, exist_ok=True)

    for i, (arq, nome) in enumerate(TELAS, start=1):
        caminho = os.path.join(ENTRADA, arq)
        if not os.path.exists(caminho):
            print(f"  faltando: {arq}")
            continue

        # telas do modal (PNG com alfa, para o CSS posicionar livremente)
        for larg, sufixo in [(620, ""), (340, "-sm")]:
            m = forja.montar(caminho, larg)
            m.save(os.path.join(saida, f"{nome}{sufixo}.png"), "PNG", optimize=True)

        print(f"  ok: {nome}.png  {m.size}")

    print(f"\nmockups em {saida}")


if __name__ == "__main__":
    main()
