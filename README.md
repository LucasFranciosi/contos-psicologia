# Contos & Psicologia

Portal estático para organizar palestras e suas apresentações. Ele usa somente HTML, CSS e JavaScript puro; não requer build, dependências ou servidor de aplicação.

## Executar localmente

Abra `index.html` no navegador ou sirva a pasta por um servidor estático, por exemplo `npx serve .`. O acesso inicial é `Socorro` / `gubilu`.

## Conteúdo

Todo o catálogo fica em [data/palestras.js](data/palestras.js). Para criar uma palestra, adicione um objeto com `id`, `titulo`, `descricao` e `apresentacoes`. Cada apresentação aceita:

- `tipo: "ppt"`: defina `src` como uma URL incorporável do Microsoft 365/SharePoint. A URL fica apenas no catálogo e é exibida em iframe responsivo.
- `tipo: "html"`: defina `src` com o caminho relativo de um arquivo local, por exemplo `./presentations/minha-palestra/abertura.html`.

Palestras com várias apresentações mostram a tela de seleção. No player, os botões `Anterior` e `Próxima` mudam a apresentação. As setas ficam reservadas ao conteúdo aberto no iframe: elas avançam os slides do PowerPoint ou a narrativa de uma apresentação HTML. `F` alterna tela cheia e `Escape` sai dela ou volta.

## Criar slides HTML

Em um HTML local, importe os arquivos compartilhados e use uma seção por slide:

```html
<link rel="stylesheet" href="../../presentation-engine/presentation.css">
<section class="slide active">...</section>
<section class="slide">...</section>
<script src="../../presentation-engine/presentation.js"></script>
```

Os slides ocupam a área inteira, têm transição suave e respondem a `→`, `←` e clique nas metades direita/esquerda. Ao pressionar `→` no último slide, o motor envia `{ type: "presentation-finished" }` ao player com `window.parent.postMessage`. No primeiro slide, `←` envia `presentation-previous`; o player mantém a etapa atual até que alguém use seus botões de navegação.

## Acesso

Edite `credentials` em [js/auth.js](js/auth.js) para alterar usuário e senha. A sessão permanece apenas enquanto a aba/navegador mantiver o `sessionStorage`.

## Netlify

O [netlify.toml](netlify.toml) publica a raiz do repositório sem build. Conecte este repositório ao Netlify e escolha a branch `main`; cada push será publicado automaticamente. Também é possível usar `npx netlify deploy --prod` após autenticar na CLI.
