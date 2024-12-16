import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical Showcase API',
      version: '1.0.0',
      description: 'API documentation for Medical Showcase application',
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
  apis: ['./src/app/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options); 