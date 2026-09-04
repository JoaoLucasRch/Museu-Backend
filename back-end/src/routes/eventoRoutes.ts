import { FastifyInstance } from "fastify";

import { verifyJWT } from "../middlewares/verifyJWT";
import { authorizeRole } from "../middlewares/authorizeRole";

import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  verificarEditalDisponivel,
  listarObrasDoEdital,
  listarEditaisDisponiveis,
} from "../controllers/eventoController";

export async function eventoRoutes(app: FastifyInstance) {
  // ==================== SCHEMA DE EVENTO ====================

  const eventoSchema = {
    type: "object",
    properties: {
      id_evento: {
        type: "number",
        example: 1,
      },

      titulo_evento: {
        type: "string",
        example: "Exposição de Arte Moderna",
      },

      descricao_evento: {
        type: "string",
        example:
          "Uma mostra com obras de artistas contemporâneos.",
      },

      local_evento: {
        type: "string",
        example: "Museu da Cidade",
      },

      imagem_evento: {
        anyOf: [
          {
            type: "string",
            example: "https://example.com/imagem.jpg",
          },
          {
            type: "null",
          },
        ],
      },

      data_hora_inicio: {
        type: "string",
        format: "date-time",
        example: "2025-11-20T18:00:00Z",
      },

      data_hora_fim: {
        type: "string",
        format: "date-time",
        example: "2025-11-22T22:00:00Z",
      },

      tipo_evento: {
        type: "string",
        enum: [
          "EXPOSICAO",
          "OFICINA",
          "PALESTRA",
          "LANCAMENTO",
          "OUTRO",
        ],
        example: "EXPOSICAO",
      },

      eh_edital: {
        type: "boolean",
        example: false,
      },

      inicio_submissao: {
        anyOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },

      fim_submissao: {
        anyOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },

      // ==================== CRIADOR ====================

      criado_por_id: {
        type: "number",
        example: 1,
      },

      criado_por: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1,
          },

          nome: {
            type: "string",
            example: "Administrador",
          },

          email: {
            type: "string",
            example: "admin@exemplo.com",
          },
        },
      },

      // ==================== CONTROLE ====================

      criado_em: {
        type: "string",
        format: "date-time",
      },

      atualizado_em: {
        type: "string",
        format: "date-time",
      },
    },
  };

  // ==================== BODY DE EVENTO ====================

  const bodyEvento = {
    additionalProperties: false,

    type: "object",

    required: [
      "titulo_evento",
      "descricao_evento",
      "local_evento",
      "data_hora_inicio",
      "data_hora_fim",
      "tipo_evento",
      "eh_edital",
    ],

    properties: {
      titulo_evento: {
        type: "string",
        example: "Semana Cultural 2025",
      },

      descricao_evento: {
        type: "string",
        example:
          "Evento que reúne arte, música e gastronomia.",
      },

      local_evento: {
        type: "string",
        example: "Praça Central",
      },

      imagem_evento: {
        anyOf: [
          {
            type: "string",
            example: "https://example.com/banner.jpg",
          },
          {
            type: "null",
          },
        ],
      },

      data_hora_inicio: {
        type: "string",
        format: "date-time",
        example: "2025-12-05T18:00:00Z",
      },

      data_hora_fim: {
        type: "string",
        format: "date-time",
        example: "2025-12-07T22:00:00Z",
      },

      tipo_evento: {
        type: "string",
        enum: [
          "EXPOSICAO",
          "OFICINA",
          "PALESTRA",
          "LANCAMENTO",
          "OUTRO",
        ],
        example: "OFICINA",
      },

      eh_edital: {
        type: "boolean",
        example: true,
      },

      inicio_submissao: {
        anyOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },

      fim_submissao: {
        anyOf: [
          {
            type: "string",
            format: "date-time",
          },
          {
            type: "null",
          },
        ],
      },
    },
  };

  // ==================== ROTAS PRINCIPAIS ====================

  // Listar todos os eventos
  app.get(
    "/eventos",
    {
      schema: {
        summary: "Listar eventos",
        description:
          "Retorna todos os eventos cadastrados no sistema, incluindo informações do criador.",
        tags: ["Eventos"],

        response: {
          200: {
            type: "array",
            items: eventoSchema,
          },

          500: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Erro interno ao listar eventos",
              },
            },
          },
        },
      },
    },
    listar
  );

  // Listar editais abertos
  app.get(
    "/eventos/editais",
    {
      schema: {
        summary: "Listar editais abertos",
        description:
          "Retorna apenas editais que estão recebendo submissões.",
        tags: ["Eventos"],

        response: {
          200: {
            type: "array",

            items: {
              type: "object",

              properties: {
                id_evento: {
                  type: "number",
                },

                titulo_evento: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    listarEditaisDisponiveis
  );

  // Buscar evento por ID
  app.get(
    "/eventos/:id",
    {
      schema: {
        summary: "Buscar evento por ID",
        description:
          "Retorna um evento específico com base em seu ID.",
        tags: ["Eventos"],

        params: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 1,
            },
          },

          required: ["id"],
        },

        response: {
          200: eventoSchema,

          400: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example: "ID inválido",
              },
            },
          },

          404: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example: "Evento não encontrado",
              },
            },
          },
        },
      },
    },
    buscarPorId
  );

  // Criar novo evento
  app.post(
    "/eventos",
    {
      preHandler: [
        verifyJWT,
        authorizeRole(["ADMIN"]),
      ],

      schema: {
        summary: "Criar novo evento",
        description:
          "Cadastra um novo evento. Apenas administradores podem criar.",
        tags: ["Eventos"],
        security: [{ bearerAuth: [] }],

        // Validação de body temporariamente desativada.
        // body: bodyEvento,

        response: {
          201: eventoSchema,

          400: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Dados inválidos ou tipo_evento incorreto",
              },

              erro: {
                type: "string",
              },
            },
          },
        },
      },
    },
    criar
  );

  // Atualizar evento
  app.put(
    "/eventos/:id",
    {
      preHandler: [
        verifyJWT,
        authorizeRole(["ADMIN"]),
      ],

      schema: {
        summary: "Atualizar evento",
        description:
          "Atualiza os dados de um evento existente.",
        tags: ["Eventos"],
        security: [{ bearerAuth: [] }],

        params: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 5,
            },
          },

          required: ["id"],
        },

        body: {
          type: "object",

          properties: {
            titulo_evento: {
              type: "string",
              example: "Exposição Atualizada",
            },

            descricao_evento: {
              type: "string",
              example: "Nova descrição do evento.",
            },

            local_evento: {
              type: "string",
              example: "Galeria A",
            },

            imagem_evento: {
              anyOf: [
                {
                  type: "string",
                  example:
                    "https://example.com/atualizado.jpg",
                },
                {
                  type: "null",
                },
              ],
            },

            data_hora_inicio: {
              type: "string",
              format: "date-time",
              example:
                "2025-12-10T18:00:00Z",
            },

            data_hora_fim: {
              type: "string",
              format: "date-time",
              example:
                "2025-12-12T22:00:00Z",
            },

            tipo_evento: {
              type: "string",
              enum: [
                "EXPOSICAO",
                "OFICINA",
                "PALESTRA",
                "LANCAMENTO",
                "OUTRO",
              ],
              example: "PALESTRA",
            },

            eh_edital: {
              type: "boolean",
              example: true,
            },

            inicio_submissao: {
              anyOf: [
                {
                  type: "string",
                  format: "date-time",
                },
                {
                  type: "null",
                },
              ],
            },

            fim_submissao: {
              anyOf: [
                {
                  type: "string",
                  format: "date-time",
                },
                {
                  type: "null",
                },
              ],
            },
          },
        },

        response: {
          200: eventoSchema,

          404: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Evento não encontrado",
              },
            },
          },
        },
      },
    },
    atualizar
  );

  // Deletar evento
  app.delete(
    "/eventos/:id",
    {
      preHandler: [
        verifyJWT,
        authorizeRole(["ADMIN"]),
      ],

      schema: {
        summary: "Deletar evento",
        description:
          "Remove permanentemente um evento pelo ID.",
        tags: ["Eventos"],
        security: [{ bearerAuth: [] }],

        params: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 5,
            },
          },

          required: ["id"],
        },

        response: {
          200: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Evento deletado com sucesso",
              },
            },
          },

          404: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Evento não encontrado",
              },
            },
          },
        },
      },
    },
    deletar
  );

  // ==================== ROTAS ESPECÍFICAS PARA EDITAIS ====================

  // Listar editais disponíveis para submissão
  app.get(
    "/editais-disponiveis",
    {
      preHandler: [verifyJWT],

      schema: {
        summary:
          "Listar editais disponíveis para submissão",

        description:
          "Retorna todos os editais que estão com período de submissão aberto.",

        tags: ["Editais"],

        security: [{ bearerAuth: [] }],

        response: {
          200: {
            type: "array",

            items: {
              type: "object",

              properties: {
                id_evento: {
                  type: "number",
                },

                titulo_evento: {
                  type: "string",
                },

                descricao_evento: {
                  type: "string",
                },

                local_evento: {
                  type: "string",
                },

                data_hora_inicio: {
                  type: "string",
                  format: "date-time",
                },

                data_hora_fim: {
                  type: "string",
                  format: "date-time",
                },

                inicio_submissao: {
                  type: "string",
                  format: "date-time",
                },

                fim_submissao: {
                  type: "string",
                  format: "date-time",
                },

                imagem_evento: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
              },
            },
          },

          500: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Erro ao listar editais disponíveis",
              },
            },
          },
        },
      },
    },
    listarEditaisDisponiveis
  );

  // Verificar se um edital está disponível
  app.get(
    "/edital/:id/disponivel",
    {
      preHandler: [verifyJWT],

      schema: {
        summary: "Verificar edital disponível",

        description:
          "Verifica se um edital específico está disponível para submissão.",

        tags: ["Editais"],

        security: [{ bearerAuth: [] }],

        params: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 1,
            },
          },

          required: ["id"],
        },

        response: {
          200: {
            type: "object",

            properties: {
              disponivel: {
                type: "boolean",
                example: true,
              },

              edital: {
                type: "object",

                properties: {
                  id_evento: {
                    type: "number",
                  },

                  titulo_evento: {
                    type: "string",
                  },

                  descricao_evento: {
                    type: "string",
                  },

                  local_evento: {
                    type: "string",
                  },

                  data_hora_inicio: {
                    type: "string",
                    format: "date-time",
                  },

                  data_hora_fim: {
                    type: "string",
                    format: "date-time",
                  },

                  inicio_submissao: {
                    type: "string",
                    format: "date-time",
                  },

                  fim_submissao: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },

              dias_restantes: {
                type: "number",
                example: 15,
              },
            },
          },

          404: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Edital não encontrado ou não está disponível",
              },
            },
          },
        },
      },
    },
    verificarEditalDisponivel
  );

  // Listar obras submetidas a um edital
  app.get(
    "/edital/:id/obras",
    {
      preHandler: [
        verifyJWT,
        authorizeRole(["ADMIN"]),
      ],

      schema: {
        summary: "Listar obras de um edital",

        description:
          "Retorna todas as obras submetidas a um edital específico.",

        tags: ["Editais"],

        security: [{ bearerAuth: [] }],

        params: {
          type: "object",

          properties: {
            id: {
              type: "number",
              example: 1,
            },
          },

          required: ["id"],
        },

        response: {
          200: {
            type: "array",

            items: {
              type: "object",

              properties: {
                id_obra: {
                  type: "number",
                },

                titulo_obra: {
                  type: "string",
                },

                descricao_obra: {
                  type: "string",
                },

                status: {
                  type: "string",
                  enum: [
                    "pendente",
                    "aprovada",
                    "rejeitada",
                    "exposta",
                  ],
                },

                data_envio: {
                  type: "string",
                  format: "date-time",
                },

                artista: {
                  type: "object",

                  properties: {
                    id: {
                      type: "number",
                    },

                    nome: {
                      type: "string",
                    },

                    email: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          500: {
            type: "object",

            properties: {
              message: {
                type: "string",
                example:
                  "Erro ao listar obras do edital",
              },
            },
          },
        },
      },
    },
    listarObrasDoEdital
  );
}