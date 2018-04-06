module.exports = {
    handleRequest: function (req, res, next) {
        var responseObject = {success : false};
        if(req._parsedUrl.pathname == "/api/teacher_login" && req.method == "POST")
        {
            if(req.body.pin == "5267")
            {
                responseObject.success = true;
                responseObject.cookie = "comein";//TODO
            }
        }
         res.status(200).json(responseObject);
         next();
    }
};