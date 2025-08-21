const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Mediport API",
      description:
        "Mediport 백엔드 API 문서 (Node.js, Express, Sequelize, Firebase Auth)",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
    tags: [
      {
        name: 'authentication',
        description: 'Authentication related APIs',
      },
      {
        name: 'user',
        description: 'User related APIs',
      },
      {
        name: 'board',
        description: 'Board related APIs',
      },
      {
        name: 'translate',
        description: 'Translation related APIs',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UpdateProfileDto: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            phone: { type: 'string' },
            country: { type: 'string' },
            disease_ids: {
              type: 'array',
              items: {
                type: 'integer'
              }
            }
          }
        },
        CreateBoardDto: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
          },
          required: ['title', 'content'],
        },
        UpdateBoardDto: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
          },
        },
        BoardResponseDto: {
          type: 'object',
          properties: {
            board_id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            view: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            author: { '$ref': '#/components/schemas/authorDto' },
            commentCount: { type: 'integer' },
            likeCount: { type: 'integer' },
            comments: {
              type: 'array',
              items: {
                '$ref': '#/components/schemas/CommentResponseDto'
              }
            }
          }
        },
        CommentResponseDto: {
          type: 'object',
          properties: {
            comment_id: { type: 'integer' },
            content: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            author: { '$ref': '#/components/schemas/authorDto' }
          }
        },
        authorDto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nickname: { type: 'string' },
            profileImage: { type: 'string', format: 'uri' },
            country: { type: 'string' },
            region: { type: 'string' }
          }
        }
      },
    },
  },
  apis: ["./src/routes/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }