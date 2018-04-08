module.exports = {
    _currentCookie: "comein",

    handleRequest: function (req, res, next) {
        
        var self = require('../src/api-middleware.js');
        var responseObject = { success: false };
        if (req._parsedUrl.pathname == "/api/teacher_login" && req.method == "POST") {
            if (req.body.pin == "5267") {
                responseObject.success = true;
                var cookie = self.getNewCookie();
                res.cookie('teacher_login_cookie', cookie, {maxAge: 10800});
                self._currentCookie = cookie;
            }
        }
        res.status(200).json(responseObject);
        next();
    },

    getCurrentCookie: function () {
        return this._currentCookie;
    },

    getNewCookie: function () {
        //TODO random
        return this._currentCookie + "a";
    }
};