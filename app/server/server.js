'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('./middleware/cors');

const Server = (options) => {
    const { hostname, port } = options;

    return new Promise((resolve, reject) => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        
        cors(app, options);

        const server = app.listen(port, hostname);
        resolve({ app: app, server: server });
    });
}

module.exports = Server;