# RL PROJECTS — site

Site estático (HTML, CSS e JS puros, sem build nem dependências).

```sh
cd site && python3 -m http.server 8000   # abrir http://127.0.0.1:8000
```

Funciona em GitHub Pages, Netlify, Vercel, Cloudflare Pages ou qualquer
hospedagem estática: é só publicar a pasta.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | página (PT-BR): slides "Construindo o futuro com…" e o catálogo de projetos |
| `assets/css/style.css` | estilos; paleta e tipografia no topo do arquivo |
| `assets/js/main.js` | slides (avanço automático, setas, teclado, swipe), catálogo e galeria |
| `assets/img/slides/` | fotos de fundo dos slides (imagens dos próprios projetos) |
| `assets/img/openshooter/` | screenshots do OpenShooter |
| `assets/fonts/` | Poppins e Newsreader (SIL OFL) |

## Slides

- Avançam sozinhos a cada 8 s enquanto estão na tela; param de vez quando a
  pessoa usa as setas, o teclado (← →) ou arrasta.
- Com `prefers-reduced-motion`, não avançam sozinhos nem animam.
- Para trocar uma foto, substitua o arquivo em `assets/img/slides/` e a
  legenda no atributo `data-caption` do slide em `index.html`.

Pré-visualização: `?slide=2` abre direto no slide 2, sem transições.
