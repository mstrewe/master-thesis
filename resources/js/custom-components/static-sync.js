AFRAME.registerComponent('static-sync',{
    schema:{attributes:{type:'array',default:['material']}},
    
    init: function() {
        var sourceid = this.el.id;
        if(sourceid == undefined)
        {
            console.warn("A entity with global-color-sync component hast not id attribute. Therefor it can not synced. Add a id to the entity!");
        } else
        {
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                    if(mutation.attributeName == "color")
                {
                    if(mutation.target.getAttribute("gcsi") == undefined)
                        mutation.target.setAttribute("gcsi",NAF.clientId);
                    NAF.connection.broadcastData("global-color-sync-datagram", { id:mutation.target.id, color: mutation.target.getAttribute("color"), initiator:NAF.clientId});
                }
                });    
            });
            var config = { attributes: true, childList: true, characterData: true };

            // pass in the target node, as well as the observer options
            observer.observe(this.el, config);
            NAF.observerArray = new Array();
            NAF.observerArray[sourceid] = observer;
            NAF.connection.subscribeToDataChannel("global-color-sync-datagram", function(senderid,dataType,data,targetID)
                {
                    //ignore self sended messages
                    if(data.initiator != NAF.clientId)
                    {
                        NAF.observerArray[data.id].disconnect();
                        document.getElementById(data.id).setAttribute("color", data.color);
                        NAF.observerArray[data.id].observe(document.getElementById(data.id),{attributes:true,childList:true,characterData:true});
                    }
                });
        }
            
        }
    });