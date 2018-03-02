const configure = (app, config) => {
    const swaggerJSDoc = require('swagger-jsdoc');
    const { hostname, port } = config;

    // swagger definition
    const swaggerDefinition = {
        info: {
            title: 'Messages Service API ',
            version: '1.0.0',
            description: 'Simple API for a push notification service which allow to manage messages queue.',
        },
        host: `$(hostname):$(port)`,
        basePath: '/',
        schemes: [
            'https',
            'http'
        ]
    };

    // options for the swagger docs
    const options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the API docs
        apis: ['app/api/message.js'],
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(options);

    // serve swagger
    app.get('/swagger.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
module.exports = { configure };