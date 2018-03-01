'use strict';

/**
 * Manager class
 */
class Manager {
    constructor(Message, statusValidator) {
        this.Message = Message;
        this.statusValidator = statusValidator;
    }

    addNewMessage(data) {
        return new Promise((resolve, reject) => {
            const newMessage = new this.Message(data);
            newMessage.save(function (err, result) {
                if (err) {
                    reject('An error occured while creating new message:' + err);
                }

                resolve(result);
            })
        });
    }

    deleteById(id) {
        return new Promise((resolve, reject) => {
            this.Message.remove({ _id: id }, (err, result) => {
                if (err) {
                    reject('An error occured while deleting message by ID="' + id + '", err:' + err);
                }

                resolve(result);
            });
        });
    }

    deleteMany(query) {
        return new Promise((resolve, reject) => {
            this.Message.remove(query, (err, result) => {
                if (err) {
                    reject('An error occured while deleting messages: ' + err);
                }

                resolve(result);
            });
        });
    }

    updateStatus(_id, status) {
        return new Promise((resolve, reject) => {
            if (!this.statusValidator.isValid(status)) {
                reject('Invalid status: ' + status);
            } else {
                this.Message.findByIdAndUpdate(_id, { $set: { status: status } }, { new: true }, function (err, message) {
                    if (err) reject(err);

                    resolve(message);
                });
            }
        });
    }

    updateMultipleStatuses(items) {
        let toUpdate = [];
        for (let key in items) {
            toUpdate.push(this.updateStatus(items[key]._id, items[key].status));
        }

        return Promise.all(toUpdate);
    }
}

module.exports = (messageModel, statusValidator) => new Manager(messageModel, statusValidator);