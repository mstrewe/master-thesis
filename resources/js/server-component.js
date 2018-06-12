
room_positions = {};
is_server = false;
clientCount = 0;

function initServerManager() {
    room_positions = [
        {
            position: '-6.69 0 3.57',
            rotation: '0 50 0',
            color: "green"
        },
        {
            position: '-6.69 0 3.57',
            rotation: '0 50 0',
            color: 'blue'
        },
        {
            position: '-4.69 0 2.75',
            rotation: '0 50 0',
            color: 'lightblue'
        },
        {
            position: '-2.52 0 1.47',
            rotation: '0 50 0',
            color: 'pink'
        },
        {
            position: '-0.89 0 -0.02',
            rotation: '0 50 0',
            color: 'red'
        },
        {
            position: '0.99 0 -1.69',
            rotation: '0 50 0',
            color: 'yellow'
        },
        {
            position: '2.5 0 -3.84',
            rotation: '0 50 0',
            color: 'brown'
        },
        {
            position: '3.47 0 -5.97',
            rotation: '0 50 0',
            color: 'gray'
        },
        {
            position: '3.75 0 -8.32',
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
    document.body.addEventListener('clientConnected', function (evt) {
        window.setTimeout(function () {
            checkList(evt.detail.clientId);
        }, 3000);
    });
    document.body.addEventListener('clientDisconnected', function (evt) {
        window.setTimeout(function () {
            for (let index = 0; index < room_positions.length; index++) {
                const element = room_positions[index];
                if (element.clientId == evt.detail.clientId)
                    room_positions[index].clientId = undefined;
            }
        }, 3000);
    });

}

function checkList(clientID) {
    if (is_server == true) {
        $('[collada-model^=" url(resources/models/android/Android"]')
            .each(function (ind, el) {
                var colModel = el.components["collada-model"].attrValue;
                if (colModel.startsWith("resources")) {
                    var color = colModel.replace("resources/models/android/Android_", "").replace(".dae", "").trim();
                    if (color == false || color.startsWith("resources"))
                        window.setTimeout(function () {
                            checkList(clientID);
                        }, 3000);
                    for (let index = 0; index < room_positions.length; index++) {
                        const element = room_positions[index];
                        if (element.color == color && !(element.clientId))
                            room_positions[index].clientId = clientID;
                    }
                }
            });
    }
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
        position: '2.15 0 -9.77',
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
        
        var new_x = parseInt(data.position.split(' ')[0]);
        var new_y = parseInt(data.position.split(' ')[1]);
        var new_z = parseInt(data.position.split(' ')[2]);

        var el = document.getElementById("player");
        el.setAttribute("position", data.position);
        el.setAttribute("rotation", data.rotation);

        var el_melden = document.getElementById("melden_button");
        el_melden.setAttribute("position", (new_x - 1) + " " + (new_y - 0.5) + " " + new_z);

        var el_logout = document.getElementById("logout_button");
        el_logout.setAttribute("position", (new_x - 0.5) + " " + (new_y - 0.5) + " " + new_z);

        document.getElementById("players-q").components.position.data.y = new_y + 0.7;
        document.getElementById("players-q").components.position.data.z = new_z;
        var localPlayer = $("#android");
        var localPlayerHead = $("#player .head");
        var localCursorRing = $("#cursor_ring");
        if (!data.unvisible) {
            window.setTimeout(
                function () {
                    if (data.color != "green")
                        localPlayer.attr("color", data.color);
                    localPlayer.attr("visible", "false");
                }, 500);
            window.setTimeout(
                function () {
                    if (data.color != "green")
                        localPlayerHead.attr("color", data.color);
                    localPlayerHead.attr("visible", "false");
                    localCursorRing.attr("visible", "true");
                    localCursorRing.attr("material", "color: " + data.color + "; shader: flat");
                }, 500);
        } else {
            window.setTimeout(
                function () {
                    localPlayer.attr("visible", "false");
                    localPlayer.attr("scale", "0.0001 0.0001 0.0001");
                    localPlayerHead.attr("scale", "0.0001 0.0001 0.0001");
                }, 500);
        }
        //call network update
        window.setTimeout(
            function () {
                document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001;
            }, 50);
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

