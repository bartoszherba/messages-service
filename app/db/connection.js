const mongoose = require('mongoose');

module.exports = (options) => {
    const {hostname, port, dbName} = options;

    return mongoose.connect('mongodb://'+ hostname +':'+ port + '/' + dbName);
}