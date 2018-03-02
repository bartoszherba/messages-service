'use strict';
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('./middleware/cors');

const Server = (options) => {
    const { hostname, port } = options;

    return new Promise((resolve, reject) => {
        // Static files
        app.use(express.static(path.join(path.dirname(require.main.filename) + '/pub')));

        // Middleware
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        cors(app, options);

        // Initialize server
        const server = app.listen(port, hostname);
        
        resolve({ app: app, server: server });
    });
}

module.exports = Server;