var ServerManager = {

    room_positions: {},
    is_server: false,
    clientCount: 0,

    init: function () {
        room_positions = [
            {
                position: '0 0 0',
                rotation: '0 0 0'
            },
            {
                position: '1 0 0',
                rotation: '0 0 0',
                color: 'blue'
            },
            {
                position: '2 0 0',
                rotation: '0 0 0',
                color: 'lightblue'
            },
            {
                position: '3 0 0',
                rotation: '0 0 0',
                color: 'pink'
            },
            {
                position: '4 0 0',
                rotation: '0 0 0',
                color: 'red'
            },
            {
                position: '5 0 0',
                rotation: '0 0 0',
                color: 'yellow'
            },
            {
                position: '6 0 0',
                rotation: '0 0 0',
                color: 'brown'
            },
            {
                position: '7 0 0',
                rotation: '0 0 0',
                color: 'gray'
            },
            {
                position: '8 0 0',
                rotation: '0 0 0',
                color: 'rosa'
            },
            {
                position: '9 0 0',
                rotation: '0 0 0',
                color: 'white'
            }];



        NAF.connection.subscribeToDataChannel('sc_fs', ServerManager.onFindServerRequest);
        NAF.connection.subscribeToDataChannel('sc_fs_r', ServerManager.onFindServerResponse);

        NAF.connection.subscribeToDataChannel('sc_gp', ServerManager.onGetPosition);
        NAF.connection.subscribeToDataChannel('sc_gp_r', ServerManager.onGetPositionResponse);

        document.body.addEventListener('clientDisconnected', ServerManager.findNewServer);

        NAF.connection.subscribeToDataChannel('load_pdf', ServerManager.onLoadPdf);
        //  self.findServer();
    },

    findNewServer: function () {
        NAF.connection.broadcastData("sc_fs", {});
    },

    findServer: function () {
        clientCount = 0;
        if (NAF.connection.isConnected() == false) {
            window.setTimeout(() => {
                ServerManager.findServer();
            }, 200);
            return;
        }
        window.setTimeout(() => {
            ServerManager.broadcastFindServer();
        }, 500);
    },

    broadcastFindServer: function () {
        if (Object.keys(NAF.connection.connectedClients).length === 0) {
            ServerManager.makeServer();
        }
        else {
            NAF.connection.broadcastData("sc_gp", {});
        }
    },

    makeServer: function () {
        ServerManager.is_server = true;
        document.getElementById("player").setAttribute("position", "-8.1 0 -0.8");
        document.getElementById("player").setAttribute("rotation", "0 -90 0");
        document.getElementById("cursor_ring").setAttribute("material", "color: #FF0000");
        ServerManager.room_positions[0].clientId = NAF.clientId;
        window.setTimeout(function () { document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001; }, 50);

    },

    findNextPosition: function (initiator) {
        for (var i = 0; i < room_positions.length; i++) {
            if (!(room_positions[i].clientId)) {
                room_positions[i].clientId = initiator;
                return room_positions[i];
            }
        }
    },

    electServer: function () {
        var clientIDs = new Array();
        clientIDs.push(NAF.clientId)
        for (var k in NAF.connection.activeDataChannels) {
            if (NAF.connection.activeDataChannels[k] === true)
                clientIDs.push(k);
        }

        //sort
        clientIDs.sort();
        if (clientIDs[0] === NAF.clientId)
            ServerManager.makeServer();
        else {
            window.setTimeout(() => {
                ServerManager.findServer();
            }, 1100);
        }
    },

    onGetPosition: function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            if (ServerManager.is_server === false)
                return;
            var pos = ServerManager.findNextPosition(senderid);
            NAF.connection.sendData(senderid, "sc_gp_r", pos);
            //colorize the model
        }
    },

    onGetPositionResponse: function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            var el = document.getElementById("player");
            el.setAttribute("position", data.position);
            el.setAttribute("rotation", data.rotation);
            var localPlayer = $("#android");
            var localPlayerHead = $("#android-head");
            var localCursorRing = $("#cursor_ring");
            window.setTimeout(
                function () {
                    localPlayer.attr("collada-model", "url(resources/models/android/Android_" + data.color + ".dae);");
                    localPlayer.attr("visible", "false");
                }, 5000);
            window.setTimeout(
                function () {
                    localPlayerHead.attr("collada-model", "url(resources/models/android/Android_head_" + data.color + ".dae);");
                    localPlayerHead.attr("visible", "false");
                    localCursorRing.attr("visible", "true");
                }, 5000);
            //call network update
            window.setTimeout(function () { document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001; }, 50);
        }
    },

    onFindServerResponse: function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            if (data.is_server == true)
                thServerManageris.is_server = false;
            else
                ServerManager.clientCount += 1;
        }
        var activeConnections = 0;
        for (var k in NAF.connection.activeDataChannels) {
            if (NAF.connection.activeDataChannels[k] === true)
                activeConnections++;
        }

        if (ServerManager.clientCount == activeConnections && ServerManager.is_server == false)
            ServerManager.electServer();
    },

    onFindServerRequest: function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            NAF.connection.sendData(senderid, "sc_fs_r", { is_server: ServerManager.is_server });
        }
    },

    onLoadPdf: function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            pdfLoader.loadUrl(data.url);
        }
    }
};

