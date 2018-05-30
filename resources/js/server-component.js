
room_positions = {};
is_server = false;
clientCount = 0;

function initServerManager() {
    room_positions = [
        {
            position: '-5.5 0 2.2',
            rotation: '0 50 0',
            color: "green"
        },
        {
            position: '-4.27 0 0.97',
            rotation: '0 50 0',
            color: 'blue'
        },
        {
            position: '-3.24 0 -0.29',
            rotation: '0 50 0',
            color: 'lightblue'
        },
        {
            position: '-2.23 0 -1.53',
            rotation: '0 50 0',
            color: 'pink'
        },
        {
            position: '-0.98 0 -2.73',
            rotation: '0 50 0',
            color: 'red'
        },
        {
            position: '0.04 0 -4.14',
            rotation: '0 50 0',
            color: 'yellow'
        },
        {
            position: '-0.78 0 -6.8',
            rotation: '0 50 0',
            color: 'gold'
        },
        {
            position: '0 0 -8.6',
            rotation: '0 50 0',
            color: 'gray'
        },
        {
            position: '0.6 0 -10.4',
            rotation: '0 50 0',
            color: 'deeppink'
        },
        {
            position: '1.4 0 -12.2',
            rotation: '0 50 0',
            color: 'white'
        }];

    NAF.connection.subscribeToDataChannel('sc_gp', onGetPosition);
    NAF.connection.subscribeToDataChannel('sc_gp_r', onGetPositionResponse);

    NAF.connection.subscribeToDataChannel('load_pdf', onLoadPdf);
    NAF.connection.subscribeToDataChannel('load_mp4', onLoadMp4);
    //  self.findServer();
    // AFRAME.scenes[0].emit('connect');
}

function findNewServer() {
    NAF.connection.broadcastData("sc_fs", {});
}
findServerIntervalNumber = 0;
function findServer() {
    clientCount = 0;
    if (NAF.connection.isConnected() == false) {
        window.setTimeout(() => {
            findServer();
        }, 200);
        return;
    }
    window.setTimeout(() => {
        broadcastFindServer();
        findServerIntervalNumber = window.setInterval(broadcastFindServer, 5000);
    }, 500);
}

function broadcastFindServer() {
    if (document.cookie.indexOf('teacher_login_cookie') > -1 && window.location.href.indexOf('room_teacher.html') > -1) {
        makeServer();
        window.clearInterval(findServerIntervalNumber);
    } else {
        NAF.connection.broadcastData("sc_gp", {});
    }
}

function makeServer() {
    is_server = true;
    document.getElementById("player").setAttribute("position", "-8.1 0 -0.8");
    document.getElementById("player").setAttribute("rotation", "0 -90 0");
    document.getElementById("cursor_ring").setAttribute("material", "color: #FF0000");
    room_positions[0].clientId = NAF.clientId;
    window.setTimeout(function () {
        document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001;
    }, 50);

}

function findNextPosition(initiator) {
    for (var i = 0; i < room_positions.length; i++) {
        if (!(room_positions[i].clientId)) {
            room_positions[i].clientId = initiator;
            return room_positions[i];
        }
    }
    return {
        position: '4 0 -7',
        rotation: '0 0 0',
        color: 'rosa',
        unvisible: true
    };
}

function electServer() {
    var clientIDs = new Array();
    clientIDs.push(NAF.clientId)
    for (var k in NAF.connection.activeDataChannels) {
        if (NAF.connection.activeDataChannels[k] === true)
            clientIDs.push(k);
    }

    //sort
    clientIDs.sort();
    if (clientIDs[0] === NAF.clientId)
        makeServer();
    else {
        window.setTimeout(() => {
            findServer();
        }, 1100);
    }
}

function onGetPosition(senderid, dataType, data, targetID) {
    if (senderid != NAF.clientId) {
        if (typeof (is_server) == "undefined" || is_server === false)
            return;
        var pos = findNextPosition(senderid);
        window.setTimeout(function () { NAF.connection.sendData(senderid, "sc_gp_r", pos); }, 1000);
        //colorize the model
    }
}
serverFound = false;
function onGetPositionResponse(senderid, dataType, data, targetID) {
    if (senderid != NAF.clientId && serverFound == false) {
        window.clearInterval(findServerIntervalNumber);
        serverFound = true;
        var el = document.getElementById("player");
        el.setAttribute("position", data.position);
        el.setAttribute("rotation", data.rotation);
        var localPlayer = $("#android");
        var localPlayerHead = $("#android-head");
        var localCursorRing = $("#cursor_ring");
        if (!data.unvisible) {
            window.setTimeout(
                function () {
                    if (data.color != "green")
                        localPlayer.attr("collada-model", "url(resources/models/android/Android_" + data.color + ".dae);");
                    localPlayer.attr("visible", "false");
                }, 5000);
            window.setTimeout(
                function () {
                    if (data.color != "green")
                        localPlayerHead.attr("collada-model", "url(resources/models/android/Android_head_" + data.color + ".dae);");
                    localPlayerHead.attr("visible", "false");
                    localCursorRing.attr("visible", "true");
                    localCursorRing.attr("material", "color: " + data.color + "; shader: flat");
                }, 5000);
        } else {
            window.setTimeout(
                function () {
                    localPlayer.attr("visible", "false");
                    localPlayer.attr("scale", "0.0001 0.0001 0.0001");
                    localPlayerHead.attr("scale", "0.0001 0.0001 0.0001");
                }, 5000);
        }
        //call network update
        window.setTimeout(function () { document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001; }, 50);
    }
}

function onLoadPdf(senderid, dataType, data, targetID) {
    if (senderid != NAF.clientId) {
        pdfLoader.loadUrl(data.url);
    }
}

function onLoadMp4(senderid, dataType, data, targetID) {
    if (senderid != NAF.clientId) {
        $('video').attr("src", data.url);

    }
}

