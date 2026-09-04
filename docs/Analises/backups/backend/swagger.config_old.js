const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Canal de Denúncias — MPT',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de Canal de Denúncias do Ministério Público do Trabalho.',
      contact: {
        name: 'Suporte MPT',
        url: 'https://mpt.mp.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local (Desenvolvimento)',
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
    },
  },
  // Caminhos onde procurar por comentários JSDoc
  apis: ['./routes/*.js', './controllers/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
