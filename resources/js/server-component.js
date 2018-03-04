var ServerManager = function () {

    var self = this;
    this.room_positions;
    this.is_server = false;
    this.clientCount = 0;

    this.init = function () {
        room_positions = [
            {
                position: '1.29 0 -0.68',
                rotation: '0 0 0'
            },
            {
                position: '1.49 0 2.05',
                rotation: '0 0 0'
            },
            {
                position: '2.79 0 4.07',
                rotation: '0 0 0'
            },
            {
                position: '3.06 0 6.20',
                rotation: '0 -48 0'
            },
            {
                position: '-7.87 0 5.61',
                rotation: '0 270 0'
            },
            {
                position: '-7.87 0 3.83',
                rotation: '0 270 0'
            },
            {
                position: '-7.87 0 1.97',
                rotation: '0 270 0'
            },
            {
                position: '-5.86 0 1.17',
                roation: '0 180 0'
            }];



        NAF.connection.subscribeToDataChannel('sc_fs', self.onFindServerRequest);
        NAF.connection.subscribeToDataChannel('sc_fs_r', self.onFindServerResponse);

        NAF.connection.subscribeToDataChannel('sc_gp', self.onGetPosition);
        NAF.connection.subscribeToDataChannel('sc_gp_r', self.onGetPositionResponse);

        document.body.addEventListener('clientDisconnected', self.findNewServer);

        self.findServer();
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
        if (Object.keys(NAF.connection.connectedClients).length === 0) {
            self.makeServer();
        }
        else {
            NAF.connection.broadcastData("sc_gp", {});
        }
    };

    this.makeServer = function () {
        self.is_server = true;
        document.getElementById("player").setAttribute("position", room_positions[0].position);
        document.getElementById("player").setAttribute("rotation", room_positions[0].rotation);
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
        }
    };

    this.onGetPositionResponse = function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            var el = document.getElementById("player");
            el.setAttribute("position", data.position);
            el.setAttribute("rotation", data.rotation);
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

