const configure = (app, repository, manager, io) => {
    /**
     * Account list api
     */
    app.get('/message/list/:identifier', function (req, res) {
        repository.getList({ identifier: req.params.identifier }).then(
            (list) => {
                res.status(200);
                res.send(list);
            },
            (err) => {
                res.status(400);
                res.send(err);
            }
        )
    });

    /**
     * Push new message api
     */
    app.put('/message', function (req, res) {
        Promise.all([manager.addNewMessage(req.body), repository.getList({ identifier: req.body.identifier })])
            .then((response) => {
                const [newMsg, list] = response;
                io.in(newMsg.identifier).emit('new-message', { newMsg: newMsg, total: list.length + 1 });
                res.status(200)
                    .send({
                        status: 200,
                        message: newMsg
                    });
            }).catch((err) => {
                res.status(400)
                    .send({
                        code: 400,
                        error: err
                    });
            });
    });

    /**
     * Delete message api
     */
    app.delete('/message', function (req, res) {
        manager.deleteMany(req.body).then((response) => {
            res.status(200)
                .send({
                    status: 200,
                    deleted: response
                });
        }).catch((err) => {
            res.status(400)
                .send({
                    code: 400,
                    error: err
                });
        });
    });

    /**
     * Update message status api
     */
    app.patch('/message/update/:id', function (req, res) {
        manager.updateStatus(req.params.id, req.body.status).then((response) => {
            io.in(response.identifier).emit('update-message', response);
            res.status(200)
                .send({
                    status: 200,
                    message: response
                });
        }, (err) => {
            res.status(400)
                .send({
                    code: 400,
                    error: err
                });
        }).catch((err) => {
            res.status(400)
                .send({
                    code: 400,
                    error: err
                });
        });
    });

    /**
     * Update multiple messages statuses api
     */
    app.patch('/message/update', function (req, res) {
        manager.updateMultipleStatuses(req.body.updates).then((response) => {
            res.status(200)
                .send({
                    status: 200,
                    message: response
                });
        }, (err) => {
            res.status(400)
                .send({
                    code: 400,
                    error: err
                });
        });
    });
};

module.exports = { configure };