module.exports = (app, options) => {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", options.allowOrigin);
        res.header('Access-Control-Allow-Methods', options.allowOriginMethods);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
};