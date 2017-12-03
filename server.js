var connect = require('connect');
var http = require('http');
var apiMiddleWare = require('./src/api-middleware.js');
// gzip/deflate outgoing responses
var compression = require('compression');
var serveStatic = require('serve-static');
//easyrtc components
var easyrtc = require('easyrtc');
var socketIo = require("socket.io");
var express = require("express");

// create route handlers
var serveEasyRTC = serveStatic('easyrtc', {
    'index': false
});
var serveModels = serveStatic('resources/models', {
    'index': false
});
var servePdf = serveStatic('resources/pdf', {
    'index': false
});
var serveIndex = serveStatic('resources/html', {
    'index': ['index.html']
});
var serveJS = serveStatic('resources/js', {
    'index': false
});

//create webserver
var app = connect();
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

//register route handlers
app.use('/api', apiMiddleWare.handleRequest);
app.use('/easyrtc', serveEasyRTC);
app.use('/resources/models', serveModels);
app.use('/resources/pdf', servePdf);
app.use('/resources/js', serveJS);
app.use('/', serveIndex);

//create node.js http server and listen on port
http.createServer(app).listen(8000);
console.log("Webserver started at 8000.");


//initialize easyrtc 
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname));

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(8080);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer);

// Start EasyRTC server
var easyrtcServer = easyrtc.listen(httpApp, socketServer);
