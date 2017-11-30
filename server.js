var connect = require('connect');
var http = require('http');
var apiMiddleWare = require('./src/api-middleware.js');
var staticMiddleWare = require('./src/static-middleware.js');
// gzip/deflate outgoing responses
var compression = require('compression');
var serveStatic = require('serve-static')


var serveEasyRTC = serveStatic('easyrtc', {
    'index': false
});
var serveModels = serveStatic('resources/models', {
    'index': false
});
var servePdf = serveStatic('resources/pdf', {
    'index': false
});

var app = connect();
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

app.use('/api', apiMiddleWare.handleRequest);
app.use('/easyrtc', serveEasyRTC);
app.use('/resources/models', serveModels);
app.use('/resources/pdf', servePdf);
// respond to all requests
app.use(staticMiddleWare.handleRequest);

//create node.js http server and listen on port
http.createServer(app).listen(8000);