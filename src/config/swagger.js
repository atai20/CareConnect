const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

function setupSwagger(app) {
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yaml'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'CareConnect API Documentation',
    }));
  } catch (err) {
    console.warn('Swagger docs not found at docs/swagger.yaml — /api/docs will be unavailable');
  }
}

module.exports = setupSwagger;
