var connect = require('express');
var http = require('http');
var apiMiddleWare = require('./src/api-middleware.js');
var  upload = require('jquery-file-upload-middleware');
// gzip/deflate outgoing responses
var compression = require('compression');
var serveStatic = require('serve-static');
//easyrtc components
var easyrtc = require('easyrtc');
var socketIo = require("socket.io");
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var $ = require("jquery");

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
var serveJpg = serveStatic('resources/images', {
    'index': false
});

var serveMP4 = serveStatic('resources/videos', {
    'index': false
});

var serveIndex = serveStatic('resources/html', {
    'index': ['login.html']
});

var serveJS = serveStatic('resources/js', {
    'index': false
});

var serveFiles = serveStatic('public/uploads',{
    'index' : false
});

upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});

//create webserver
var app = connect();
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser())

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

//register route handlers
app.use('/upload', upload.fileHandler());
app.use('/uploads',serveFiles);
app.use('/api', apiMiddleWare.handleRequest);
app.use('/easyrtc', serveEasyRTC);
app.use('/resources/models', serveModels);
app.use('/resources/pdf', servePdf);
app.use('/resources/js', serveJS);
app.use('/resources/videos', serveMP4);
app.use('/resources/images', serveJpg);
app.use('/', function (req, res, next) {
    if((req._parsedUrl.pathname == "/room_teacher.html" || req._parsedUrl.pathname == "/prepare_lesson.html") && req.method == "GET")
    {
        // check cookie here:
        if(req.cookies.teacher_login_cookie != apiMiddleWare.getCurrentCookie())
        {
            res.sendStatus(401);
        }
        // send 404 when cookie do not fit
    }

    next();
});
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
