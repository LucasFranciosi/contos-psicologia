/*
 * Catálogo do portal. Para adicionar conteúdo, edite prioritariamente este arquivo.
 * Tipos aceitos: "video" (YouTube), "ppt" (URL incorporável), "html"
 * (arquivo local) e "visualizacoes" (alternância entre fontes).
 */
const palestras = [
  {
    id: "depressao-trabalho",
    titulo: "Depressão e Trabalho",
    subtitulo: "Setembro Amarelo",
    mensagem: "Escutar é estar presente",
    descricao: "Sinais de alerta, crises, impactos no ambiente de trabalho, autocuidado e caminhos para buscar apoio.",
    capa: "",
    apresentacoes: [
      {
        id: "entrada",
        titulo: "01 — Entrada",
        descricao: "Imagem de acolhimento antes do início.",
        tipo: "html",
        trilha: 0.018,
        src: "./presentations/depressao-trabalho/entrada.html"
      },
      {
        id: "abertura",
        titulo: "02 — Abertura",
        descricao: "Abertura em vídeo, com possibilidade de troca futura.",
        tipo: "video",
        trilha: 0.045,
        src: "https://youtu.be/nD2otwou0bU?is=vmZa7TixmJvbVjcb"
      },
      {
        id: "apresentacao",
        titulo: "03 — Apresentação",
        descricao: "Escolha a experiência HTML dinâmica ou o PowerPoint original.",
        tipo: "visualizacoes",
        trilha: 0.010,
        visualizacoes: [
          { id: "html", rotulo: "Experiência HTML", tipo: "html", src: "./presentations/depressao-trabalho/apresentacao-setembro.html" },
          { id: "ppt", rotulo: "PowerPoint", tipo: "ppt", src: "https://tegma-my.sharepoint.com/personal/franciosi911676_tegma_com_br/_layouts/15/Doc.aspx?sourcedoc={ae2a3c65-e15a-401a-9d8c-7f649187dd16}&action=embedview&wdAr=1.7777777777777777" }
        ]
      },
      {
        id: "encerramento",
        titulo: "04 — Encerramento",
        descricao: "Agradecimento, cuidado e contatos profissionais.",
        tipo: "html",
        trilha: 0.014,
        src: "./presentations/depressao-trabalho/encerramento-final.html"
      }
    ]
  }
];
