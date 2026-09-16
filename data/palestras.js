/*
 * Catálogo do portal. Para adicionar conteúdo, edite prioritariamente este arquivo.
 * Tipos aceitos: "ppt" (URL incorporável) e "html" (arquivo local).
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
        id: "apresentacao-dinamica",
        titulo: "01 — Apresentação interativa",
        descricao: "A palestra em uma narrativa contínua e interativa.",
        tipo: "html",
        src: "./presentations/depressao-trabalho/apresentacao-dinamica.html"
      },
      {
        id: "powerpoint-original",
        titulo: "02 — PowerPoint original",
        descricao: "Versão original incorporada do Microsoft 365.",
        tipo: "ppt",
        src: "https://tegma-my.sharepoint.com/personal/franciosi911676_tegma_com_br/_layouts/15/Doc.aspx?sourcedoc={ae2a3c65-e15a-401a-9d8c-7f649187dd16}&action=embedview&wdAr=1.7777777777777777"
      },
      {
        id: "conteudo",
        titulo: "03 — Conteúdo principal",
        descricao: "Sinais, impactos e caminhos de apoio.",
        tipo: "html",
        src: "./presentations/depressao-trabalho/conteudo.html"
      },
      {
        id: "dinamica",
        titulo: "04 — Dinâmica",
        descricao: "Um convite breve à reflexão.",
        tipo: "html",
        src: "./presentations/depressao-trabalho/dinamica.html"
      },
      {
        id: "encerramento",
        titulo: "05 — Encerramento",
        descricao: "Acolher também é cuidar.",
        tipo: "html",
        src: "./presentations/depressao-trabalho/encerramento.html"
      }
    ]
  }
];
