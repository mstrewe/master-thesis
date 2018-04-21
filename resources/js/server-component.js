var ServerManager = function () {

    var self = this;
    this.room_positions;
    this.is_server = false;
    this.clientCount = 0;

    this.init = function () {
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



        NAF.connection.subscribeToDataChannel('sc_fs', self.onFindServerRequest);
        NAF.connection.subscribeToDataChannel('sc_fs_r', self.onFindServerResponse);

        NAF.connection.subscribeToDataChannel('sc_gp', self.onGetPosition);
        NAF.connection.subscribeToDataChannel('sc_gp_r', self.onGetPositionResponse);

        document.body.addEventListener('clientDisconnected', self.findNewServer);

        //  self.findServer();
    };

    this.findNewServer = function () {
        NAF.connection.broadcastData("sc_fs", {});
    };

    this.findServer = function () {
        clientCount = 0;
        if (NAF.connection.isConnected() == false) {
            window.setTimeout(() => {
                self.findServer();
            }, 200);
            return;
        }
        window.setTimeout(() => {
            self.broadcastFindServer();
        }, 500);
    };

    this.broadcastFindServer = function () {
        if (Object.keys(NAF.connection.connectedClients).length === 0) {
            self.makeServer();
        }
        else {
            NAF.connection.broadcastData("sc_gp", {});
        }
    }

    this.makeServer = function () {
        self.is_server = true;
        document.getElementById("player").setAttribute("position", "-8.1 0 -0.8");
        document.getElementById("player").setAttribute("rotation", "0 -90 0");
        document.getElementById("cursor_ring").setAttribute("material", "color: #FF0000");
        self.room_positions[0].clientId = NAF.clientId;
        window.setTimeout(function () { document.getElementById("player").components.position.data.x = document.getElementById("player").components.position.data.x + 0.00001; }, 50);

    }

    this.findNextPosition = function (initiator) {
        for (var i = 0; i < room_positions.length; i++) {
            if (!(room_positions[i].clientId)) {
                room_positions[i].clientId = initiator;
                return room_positions[i];
            }
        }
    };

    this.electServer = function () {
        var clientIDs = new Array();
        clientIDs.push(NAF.clientId)
        for (var k in NAF.connection.activeDataChannels) {
            if (NAF.connection.activeDataChannels[k] === true)
                clientIDs.push(k);
        }

        //sort
        clientIDs.sort();
        if (clientIDs[0] === NAF.clientId)
            self.makeServer();
        else {
            window.setTimeout(() => {
                self.findServer();
            }, 1100);
        }
    };

    this.onGetPosition = function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            if (is_server === false)
                return;
            var pos = self.findNextPosition(senderid);
            NAF.connection.sendData(senderid, "sc_gp_r", pos);
            //colorize the model
        }
    };

    this.onGetPositionResponse = function (senderid, dataType, data, targetID) {
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
    };

    this.onFindServerResponse = function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            if (data.is_server == true)
                self.is_server = false;
            else
                self.clientCount += 1;
        }
        var activeConnections = 0;
        for (var k in NAF.connection.activeDataChannels) {
            if (NAF.connection.activeDataChannels[k] === true)
                activeConnections++;
        }

        if (self.clientCount == activeConnections && self.is_server == false)
            self.electServer();
    };

    this.onFindServerRequest = function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            NAF.connection.sendData(senderid, "sc_fs_r", { is_server: self.is_server });
        }
    };

    return this;
};

