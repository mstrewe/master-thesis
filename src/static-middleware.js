var fs = require('fs');

module.exports = {
    handleRequest: function (req, res, next) {
        const { method, url } = req;
        if (method !== "GET") {
            res.writeHead(400);
            res.end();
            return;
        }
        if (url.indexOf("..") > 0) {
            console.warn("Request with .. recieved from " + req.socket.localAddress);
            res.writeHead(400);
            res.end();
            return;
        }
        
        fs.readFile('resources/html' + url, function (err, data) {
            if (data) {
                res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
                res.write(data);
                res.end();
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    }
};