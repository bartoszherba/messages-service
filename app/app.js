
const Message = require('./models/message');
const Status = require('./data/status');
const StatusValidator = require('./models/statusValidator');
const manager = require('./message/manager')(Message, new StatusValidator(Status));
const repository = require('./message/repository')(Message);
const Config = require('config');
const db = require('./db/connection');
const server = require('./server/server');
const msgApi = require('./api/message');
const swagger = require('./api/swagger');

if (!Config.has('mongo') || !Config.has('server')) {
    console.log('\x1b[31mInvalid configuration file. For reference check ./default.json.sample');
    process.exit(1);
}

Promise.all([db(Config.get('mongo')), server(Config.get('server'))]).then((stack) => {
    const [db, { app, server }] = stack;
    const io = require('socket.io')(server);

    // Initialize configurations for api
    msgApi.configure(app, repository, manager, io);
    swagger.configure(app, Config.get('server'));

    io.on('connection', (socket) => {
        const identifier = socket.handshake.query.identifier;

        socket.join(identifier);

        repository.getList({ identifier: identifier }).then((list) => {
            io.in(identifier).emit('new-message-list', list);
        });

        console.log('Client connected with identifier: ' + identifier);
    });
}).catch((err) => {
    console.log(err.message);
    process.exit(1);
});








