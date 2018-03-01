'use strict';
const mongoose = require('mongoose');
const Status = require('../data/status');
const Type = require('../data/type');

const messageSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: Status.Unread,
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
    },
    type: {
        type: String,
        default: Type.Success
    },
    trigger: {
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model('Message', messageSchema);