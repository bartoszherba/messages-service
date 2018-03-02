/**
 * @swagger
 * definitions:
 *   ErrorResponse400:
 *     type: object
 *     properties:
 *       code:
 *         type: string
 *         example: 400
 *       error:
 *         type: string
 *         example: "Status is a required field"
 *   ErrorResponse500:
 *     type: object
 *     properties:
 *       code:
 *         type: string
 *         example: 500
 *       error:
 *         type: string
 *         example: "An unknown error ocurred"
 *   Message:
 *     type: object
 *     required:
 *      - identifier
 *      - message
 *      - status
 *     properties:
 *       _id:
 *         type: string
 *         description: This value will be created automatically on saving new entity
 *         example: 50341373e894ad16347efe01
 *       identifier:
 *         type: string
 *         example: 10000001
 *         description: Unique identifier to match the owner of a message
 *       message:
 *         type: string
 *         example: "I am an awesome notification, can you catch me?"
 *       status:
 *         type: string
 *         description: Status of notification
 *         example: "Unread"
 *         oneOf:
 *           - Unread
 *           - Read
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: DateTime as defined in RFC 3339, section 5.6
 *         example: 2017-07-21T17:32:28Z
 *       type:
 *         type: string
 *         description: Type of notification
 *         example: success
 *         oneOf:
 *           - success
 *           - warning
 *           - error
 *       attributes:
 *         type: array
 *         description: Additional attributes to describe notification
 *         items:
 *           type: string
 */

const configure = (app, repository, manager, io) => {
    /**
     * @swagger
     * /v1/message/list/{identifier}:
     *   get:
     *     tags:
     *       - Messages List
     *     summary: Returns all messages with a given identifier
     *     parameters:
     *       - in: "path"
     *         name: identifier
     *         schema:
     *           type: string
     *           required: true
     *         description: "Identifier of messages to collect"
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of messages objects
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Message'
     *       400:
     *         description: Invalid request response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse400'
     *      
     */
    app.get('/v1/message/list/:identifier', function (req, res) {
        repository.getList({ identifier: req.params.identifier }).then(
            (list) => {
                res.status(200);
                res.send(list);
            },
            (err) => {
                res.status(400);
                res.send.send({
                    code: 400,
                    error: err
                });;
            }
        )
    });

    /**
     * @swagger
     * /v1/message:
     *   put:
     *     tags:
     *       - Messages List
     *     summary: Creates new message
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: "body"
     *         name: "body"
     *         description: "Message that need to be created"
     *         required: true
     *         schema:
     *           $ref: "#/definitions/Message"
     *     responses:
     *       200:
     *         description: Created message object
     *         schema:
     *           type: object
     *           properties:
     *             code:
     *               type: string
     *               example: 200
     *             message:
     *               $ref: '#/definitions/Message'
     *       400:
     *         description: Invalid request response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse400'
     *      
     */
    app.put('/v1/message', function (req, res) {
        Promise.all([manager.addNewMessage(req.body), repository.getList({ identifier: req.body.identifier })])
            .then((response) => {
                const [message, list] = response;
                io.in(message.identifier).emit('new-message', { message: message, total: list.length + 1 });
                res.status(200)
                    .send({
                        code: 200,
                        message: message
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
     * @swagger
     * /v1/message:
     *   delete:
     *     tags:
     *       - Messages List
     *     summary: "Delete one or multiple messages"
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: "body"
     *         name: "body"
     *         required: true
     *         schema:
     *           type: array
     *           items:
     *             type: object   
     *             properties:
     *               _id:
     *                 type: string
     *                 example: 50341373e894ad16347efe01
     *     responses:
     *       200:
     *         description: "Delete response object with status and number of deleted messages"
     *         schema:
     *           type: object
     *           properties:
     *             code:
     *               type: string
     *               example: 200
     *             deleted:
     *               type: object
     *               properties: 
     *                 n:
     *                   type: integer
     *                   description: "Number of deleted messages"
     *                   example: 2
     *                 ok:
     *                   type: integer
     *                   example: 1
     *       400:
     *         description: Invalid request response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse400'
     *      
     */
    app.delete('/v1/message', function (req, res) {
        manager.deleteMany(req.body).then((response) => {
            res.status(200)
                .send({
                    code: 200,
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
     * @swagger
     * /v1/message/{_id}:
     *   patch:
     *     tags:
     *       - Messages List
     *     summary: "Update message"
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: "path"
     *         name: _id
     *         schema:
     *           type: string
     *           required: true
     *         description: "_id of message to update"
     *     responses:
     *       200:
     *         description: "Updated message object"
     *         schema:
     *           type: object
     *           properties:
     *             code:
     *               type: string
     *               example: 200
     *             message:
     *               $ref: '#/definitions/Message'
     *       400:
     *         description: Invalid request response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse400'
     *       500:
     *         description: Server error response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse500'
     */
    app.patch('/v1/message/:id', function (req, res) {
        manager.updateStatus(req.params.id, req.body.status).then((response) => {
            io.in(response.identifier).emit('update-message', msg);
            res.status(200)
                .send({
                    code: 200,
                    message: msg
                });
        }, (err) => {
            res.status(400)
                .send({
                    code: 400,
                    error: err
                });
        }).catch((err) => {
            res.status(500)
                .send({
                    code: 500,
                    error: err
                });
        });
    });

    /**
     * @swagger
     * /v1/message:
     *   patch:
     *     tags:
     *       - Messages List
     *     summary: "Update multiple messages"
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: "body"
     *         name: "body"
     *         required: true
     *         description: "You can pass only these parameters which you want to update, in most cases this is status only"
     *         schema:
     *           type: array
     *           items:          
     *             $ref: '#/definitions/Message'
     *     responses:
     *       200:
     *         description: "Updated message object"
     *         schema:
     *           type: object
     *           properties:
     *             code:
     *               type: string
     *               example: 200
     *       400:
     *         description: Invalid request response
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ErrorResponse400'
     */
    app.patch('/v1/message', function (req, res) {
        manager.updateMultipleStatuses(req.body.updates).then((response) => {
            res.status(200)
                .send({
                    code: 200,
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