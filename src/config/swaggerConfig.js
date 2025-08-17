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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateUserDto: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            nickname: { type: 'string' },
            phone: { type: 'string' },
            country: { type: 'string' },
            region: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', format: 'date' },
            disease_ids: {
              type: 'array',
              items: {
                type: 'integer'
              }
            }
          },
          required: ['username', 'nickname', 'phone', 'country', 'region', 'gender', 'birthday'],
        },
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
        UserResponseDto: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            nickname: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', format: 'date' },
            region: { type: 'string' },
            phone: { type: 'string' },
            country: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            diseases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                },
              },
            },
          },
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
            author: { '$ref': '#/components/schemas/UserResponseDto' },
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
            author: { '$ref': '#/components/schemas/UserResponseDto' }
          }
        }
      },
    },
  },
  apis: ["./src/routes/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }