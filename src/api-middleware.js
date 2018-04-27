module.exports = {
    _currentCookie: "comein",

    handleRequest: function (req, res, next) {

        var self = require('../src/api-middleware.js');
        var responseObject = { success: false };
        if (req._parsedUrl.pathname == "/api/teacher_login" && req.method == "POST") {
            if (req.body.pin == "5267") {
                responseObject.success = true;
                var cookie = self.getNewCookie();
                res.cookie('teacher_login_cookie', cookie, { maxAge: 7200000 });
                self._currentCookie = cookie;
                var fileSystem = require("fs");
                var files = fileSystem.readdirSync("public/uploads");
                files.forEach(element => {
                    fileSystem.unlinkSync("public/uploads/" + element);
                });
            }
        }

        if (req._parsedUrl.pathname == "/api/get_files" && req.method == "GET") {
            if (req.cookies.teacher_login_cookie != self.getCurrentCookie())
                res.sendStatus(401);
            var fileSystem = require("fs");
            var files = fileSystem.readdirSync("public/uploads");

            responseObject = files;
        }

        res.status(200).json(responseObject);
        next();
    },

    getCurrentCookie: function () {
        return this._currentCookie;
    },

    getNewCookie: function () {
        var rand = Math.random() * 10000000;

        return rand;
    }
};