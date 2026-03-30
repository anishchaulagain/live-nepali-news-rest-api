import swaggerJsDoc from 'swagger-jsdoc';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nepali News REST API',
      version: '1.0.0',
      description: 'A simple REST API to fetch the latest news from OnlineKhabar.',
      contact: {
        name: 'Anish Chaulagain',
        url: 'https://github.com/anishchaulagain',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

export const swaggerDocs = swaggerJsDoc(options);
