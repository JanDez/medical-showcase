import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical Showcase API',
      version: '1.0.0',
      description: 'API documentation for Medical Showcase application',
    },
    components: {
      schemas: {
        Asset: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['kpi', 'layout', 'storyboard'] },
            visualsAvailable: { type: 'boolean' },
            isFavorite: { type: 'boolean' },
            viewCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            lastViewed: { type: 'string', format: 'date-time' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        },
        Storyboard: {
          type: 'object',
          allOf: [{ $ref: '#/components/schemas/Asset' }],
          properties: {
            coupledKpis: { type: 'array', items: { type: 'string' } },
            applicableAffiliates: { type: 'array', items: { type: 'string' } }
          }
        },
        Layout: {
          type: 'object',
          allOf: [{ $ref: '#/components/schemas/Asset' }]
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Asset' }
            },
            total: { type: 'integer' },
            page: { type: 'integer' },
            pageSize: { type: 'integer' }
          }
        },
        AssetRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['name', 'description']
        },
        RecentSearch: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            searchTerm: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      },
      parameters: {
        pageParam: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1
          },
          description: 'Page number for pagination'
        },
        pageSizeParam: {
          in: 'query',
          name: 'pageSize',
          schema: {
            type: 'integer',
            default: 10
          },
          description: 'Number of items per page'
        },
        sortByParam: {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            enum: ['createdAt', 'updatedAt', 'name', 'viewCount']
          },
          description: 'Field to sort by'
        },
        sortOrderParam: {
          in: 'query',
          name: 'sortOrder',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
          },
          description: 'Sort order direction'
        }
      }
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    tags: [
      { name: 'Assets', description: 'Asset management endpoints' },
      { name: 'Layouts', description: 'Layout management endpoints' },
      { name: 'Storyboards', description: 'Storyboard management endpoints' },
      { name: 'Trending', description: 'Trending assets endpoints' },
      { name: 'Search', description: 'Search functionality endpoints' },
      { name: 'Shares', description: 'Asset sharing endpoints' },
      { name: 'Features', description: 'Feature management endpoints' },
    ],
  },
  apis: [
    './src/app/api/**/*.ts',
    './src/app/api/**/[*]/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options); 