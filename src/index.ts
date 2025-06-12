import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

interface TrelloConfig {
  apiKey: string;
  token: string;
  boardId: string;
}

class TrelloMCPServer {
  private server: Server;
  private config: TrelloConfig;

  constructor() {
    this.server = new Server(
      {
        name: 'trello-project-updater',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.config = {
      apiKey: process.env.TRELLO_API_KEY || '',
      token: process.env.TRELLO_TOKEN || '',
      boardId: process.env.TRELLO_BOARD_ID || '',
    };

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_card',
            description: 'Crear una nueva tarjeta en Trello',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nombre de la tarjeta',
                },
                description: {
                  type: 'string',
                  description: 'Descripción de la tarjeta',
                },
                listName: {
                  type: 'string',
                  description: 'Nombre de la lista donde crear la tarjeta',
                },
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Etiquetas para la tarjeta',
                },
              },
              required: ['name', 'listName'],
            },
          },
          {
            name: 'create_epic',
            description: 'Crear una épica (tarjeta principal) con sub-tarjetas',
            inputSchema: {
              type: 'object',
              properties: {
                epicName: {
                  type: 'string',
                  description: 'Nombre de la épica',
                },
                epicDescription: {
                  type: 'string',
                  description: 'Descripción de la épica',
                },
                listName: {
                  type: 'string',
                  description: 'Lista donde crear la épica',
                },
                subTasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      listName: { type: 'string' }
                    },
                    required: ['name']
                  },
                  description: 'Lista de sub-tareas',
                },
                epicColor: {
                  type: 'string',
                  enum: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'sky', 'lime', 'black'],
                  description: 'Color de la etiqueta de épica',
                },
              },
              required: ['epicName', 'listName'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_card':
            return await this.createCard(args);
          case 'create_epic':
            return await this.createEpic(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Herramienta desconocida: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error ejecutando ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async createCard(args: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Tarjeta creada: ${args.name}`,
        },
      ],
    };
  }

  private async createEpic(args: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Épica creada: ${args.epicName}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Trello MCP Server ejecutándose en stdio');
  }
}

const server = new TrelloMCPServer();
server.run().catch(console.error); 