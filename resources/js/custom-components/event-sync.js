AFRAME.registerComponent('event-sync', {
    schema: { events: { type: 'array', default: ['click'] } },

    init: function () {
        var element = this.el;
        if (!(element.id)) {
            console.log("Can not sync events of element. It has to have a id attribute");
            return;
        }
        var message = new Object();
        message.elementID = element.id;
        message.events = this.data;
        for (var i = 0; i < this.data.events.length; i++) {
            element.addEventListener(this.data.events[i], function () {
                if (element.getAttribute("isNetworkClick") == null)
                    NAF.connection.broadcastData("es", { initiator: NAF.clientId, data: message });
                else
                    element.removeAttribute("isNetworkClick");
            });
        }

        NAF.connection.subscribeToDataChannel("es", function (senderid, dataType, data, targetID) {
            //ignore self sended messages
            if (data.initiator != NAF.clientId) {
                var element = document.getElementById(data.data.elementID);
                element.setAttribute("isNetworkClick", "");
                var event = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });
                element.dispatchEvent(event);
            }
        });
    },
});
