var ServerManager = function () {

    var self = this;
    this.room_positions;
    this.is_server = false;

    this.init = function () {
        room_positions = [
            {
                position: '2.23 1.48 0.59',
                rotation: '0 90 0'
            },
            {
                position: '2.23 1.48 2.36',
                rotation: '0 90 0'
            },
            {
                position: '2.23 1.48 4.05',
                rotation: '0 90 0'
            },
            {
                position: '0.4 1.48 4.86',
                rotation: '0 0 0'
            },
            {
                position: '-7.87 1.48 5.61',
                rotation: '0 270 0'
            },
            {
                position: '-7.87 1.48 3.83',
                rotation: '0 270 0'
            },
            {
                position: '-7.87 1.48 1.97',
                rotation: '0 270 0'
            },
            {
                position: '-5.86 1.48 1.17',
                roation: '0 180 0'
            }];



        NAF.connection.subscribeToDataChannel('sc_fs', self.onFindServerRequest);
        NAF.connection.subscribeToDataChannel('sc_fs_r', self.onFindServerResponse);

        NAF.connection.subscribeToDataChannel('sc_gp', self.onGetPosition);
        NAF.connection.subscribeToDataChannel('sc_gp_r', self.onGetPositionResponse)
        self.findServer();
    };

    this.findServer = function () {
        if (NAF.connection.isConnected() == false) {
            window.setTimeout(() => {
                self.findServer();
            }, 200);
        }
        if (Object.keys(NAF.connection.connectedClients).length === 0) {
            self.is_server = true;
            document.getElementById("player").setAttribute("position", room_positions[0].position);
            document.getElementById("player").setAttribute("rotation", room_positions[0].rotation);
            self.room_positions[0].clientId = NAF.clientId;
        }
        else {
            NAF.connection.broadcastData("sc_gp", {});
        }
    };

    this.findNextPosition = function (initiator) {
        for (var i = 0; i < room_positions.length; i++) {
            if (!(room_positions[i].clientId)) {
                room_positions[i].clientId = initiator;
                return room_positions[i];
            }
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
            if (data.data.is_server == true)
                self.is_server = false;
        }
    };

    this.onFindServerRequest = function (senderid, dataType, data, targetID) {
        if (senderid != NAF.clientId) {
            NAF.connection.sendData(senderid, "sc_fs_r", { is_server: self.is_server });
        }
    };

    return this;
};

