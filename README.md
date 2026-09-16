# Contos & Psicologia

Portal em HTML, CSS e JavaScript puro para organizar palestras e suas apresentações. O frontend continua sem framework; o cadastro compartilhado usa Netlify Functions e Netlify Blobs.

## Executar localmente

Instale as dependências com `npm install`, configure as variáveis de `.env.example` no Netlify e execute `npx netlify dev`. O acesso inicial é definido no painel do Netlify por `PORTAL_USERNAME` e `PORTAL_PASSWORD`; o nome de usuário não diferencia maiúsculas e minúsculas.

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

## Cadastrar uma nova palestra

Após o login, use **Nova palestra**. O cadastro mantém quatro etapas: Entrada, Abertura, Apresentação e Encerramento. O rascunho é salvo durante o preenchimento.

- **Entrada:** imagem, título e texto curto.
- **Abertura:** URL de vídeo ou, sem vídeo, imagem, título e texto.
- **Apresentação:** PowerPoint incorporável, cenas HTML (imagem, título e texto) ou ambos. Quando houver os dois, o player permite alternar entre “Experiência HTML” e “PowerPoint”.
- **Encerramento:** imagem, frase de agradecimento/motivação e texto complementar.

Imagens podem vir do computador ou de uma URL. Ao salvar, as imagens locais e a palestra são enviadas ao catálogo compartilhado do Netlify e ficam disponíveis em outros dispositivos autenticados. Rascunhos permanecem locais até o salvamento. Registros antigos encontrados no navegador podem ser enviados pelo botão de migração; o catálogo padrão em `data/palestras.js` continua separado.

## Netlify

O [netlify.toml](netlify.toml) publica a raiz e prepara as Functions em `netlify/functions`. No painel Netlify, configure `PORTAL_USERNAME`, `PORTAL_PASSWORD` e `SESSION_SECRET` (um valor longo e aleatório) para cada contexto de deploy. A branch `demanda/homologacao` deve usar Deploy Preview e suas próprias variáveis antes de qualquer merge na `main`. As palestras e imagens usam um armazenamento persistente por site, portanto não são removidas em novos deploys.
