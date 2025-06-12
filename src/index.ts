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
            name: 'get_board_info',
            description: 'Obtener información del board incluyendo listas y tarjetas',
            inputSchema: {
              type: 'object',
              properties: {},
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
          case 'get_board_info':
            return await this.getBoardInfo();
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

  private async makeRequest(method: string, endpoint: string, data?: any) {
    const url = `https://api.trello.com/1${endpoint}`;
    const params = {
      key: this.config.apiKey,
      token: this.config.token,
      ...data,
    };

    const response = await axios({
      method,
      url,
      params: method === 'GET' ? params : { key: this.config.apiKey, token: this.config.token },
      data: method !== 'GET' ? data : undefined,
    });

    return response.data;
  }

  private async getListId(listName: string): Promise<string> {
    const lists = await this.makeRequest('GET', `/boards/${this.config.boardId}/lists`);
    const list = lists.find((l: any) => l.name.toLowerCase() === listName.toLowerCase());
    
    if (!list) {
      throw new Error(`Lista "${listName}" no encontrada`);
    }
    
    return list.id;
  }

  private async createCard(args: any) {
    const listId = await this.getListId(args.listName);
    
    const cardData = {
      name: args.name,
      desc: args.description || '',
      idList: listId,
    };

    const card = await this.makeRequest('POST', '/cards', cardData);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Tarjeta creada exitosamente: "${card.name}"\n🔗 URL: ${card.url}\n📋 Lista: ${args.listName}`,
        },
      ],
    };
  }

  private async getBoardInfo() {
    const [board, lists, cards] = await Promise.all([
      this.makeRequest('GET', `/boards/${this.config.boardId}`),
      this.makeRequest('GET', `/boards/${this.config.boardId}/lists`),
      this.makeRequest('GET', `/boards/${this.config.boardId}/cards`),
    ]);

    const boardInfo = {
      name: board.name,
      url: board.url,
      lists: lists.map((list: any) => ({
        id: list.id,
        name: list.name,
        cards: cards
          .filter((card: any) => card.idList === list.id)
          .map((card: any) => ({
            id: card.id,
            name: card.name,
            description: card.desc,
            url: card.url,
          })),
      })),
    };

    return {
      content: [
        {
          type: 'text',
          text: `📊 **Board: ${boardInfo.name}**\n🔗 ${boardInfo.url}\n\n` +
                `📋 **Listas (${boardInfo.lists.length}):**\n` +
                boardInfo.lists.map((list: any) => 
                  `• **${list.name}** (${list.cards.length} tarjetas)\n` +
                  list.cards.map((card: any) => `  - ${card.name}`).join('\n')
                ).join('\n\n'),
        },
      ],
    };
  }

  private async createEpic(args: any) {
    const { epicName, epicDescription, listName, subTasks = [], epicColor = 'blue' } = args;
    
    // 1. Crear la tarjeta épica principal
    const listId = await this.getListId(listName);
    
    const epicCard = await this.makeRequest('POST', '/cards', {
      name: `🎯 ÉPICA: ${epicName}`,
      desc: this.buildEpicDescription(epicDescription, subTasks),
      idList: listId,
    });

    // 2. Crear sub-tarjetas
    const subCardIds = [];
    for (const subTask of subTasks) {
      const subTaskListId = subTask.listName ? 
        await this.getListId(subTask.listName) : listId;
      
      const subCard = await this.makeRequest('POST', '/cards', {
        name: subTask.name,
        desc: `${subTask.description || ''}\n\n**Épica:** [${epicName}](${epicCard.url})`,
        idList: subTaskListId,
      });

      subCardIds.push(subCard.id);
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Épica creada: "${epicName}"\n` +
                `📋 Tarjeta principal: ${epicCard.url}\n` +
                `🔗 Sub-tarjetas creadas: ${subCardIds.length}\n` +
                `🏷️ Etiqueta aplicada: ${epicColor}`,
        },
      ],
    };
  }

  private buildEpicDescription(description: string, subTasks: any[]): string {
    let desc = `🎯 **ÉPICA**\n\n${description || ''}\n\n`;
    
    if (subTasks.length > 0) {
      desc += `📋 **Sub-tareas planificadas:**\n`;
      subTasks.forEach((task, index) => {
        desc += `${index + 1}. ${task.name}\n`;
      });
      desc += '\n';
    }
    
    desc += `📊 **Progreso:** Se actualizará automáticamente\n`;
    desc += `🔗 **Sub-tareas:** Se enlazarán automáticamente\n\n`;
    desc += `_Épica creada el ${new Date().toLocaleDateString()}_`;
    
    return desc;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Trello MCP Server ejecutándose en stdio');
  }
}

const server = new TrelloMCPServer();
server.run().catch(console.error); 