'use strict';

/**
 * Repository class
 */
class Repository {
    constructor(Message) {
        this.Message = Message;
    }

    getList(query = {}) {
        return new Promise((resolve, reject) => {
            this.Message.find(query)
                .sort({createdAt: 1})
                .exec((err, res) => {
                    if (err) {
                        reject('An error occured fetching all messages, err:' + err)
                    }
                    
                    resolve(res);
                });
        });
    }
}

module.exports = (Message) => new Repository(Message);