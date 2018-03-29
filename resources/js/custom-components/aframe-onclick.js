AFRAME.registerComponent("_onclick", {
 
    init: function () {
        var element = this.el;
        var definedFunc = this.el.attributes["_onclick"].value;
        element.addEventListener("click", function () {
            eval(definedFunc);
        });
    }
});

//todo: this and event sync must be moved to src bacause its related to node js, in this js folder only normal javascript for html page 