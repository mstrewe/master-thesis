const debugString = "[DEBUG] ";

function on_teacher_login_clicked() {
    //hide login buttons
    $('#teacher_login')[0].setAttribute("visible", false);
    $('#learner_login')[0].setAttribute("visible", false);

    //show pin entities
    $('#pin_entity')[0].setAttribute("visible", true);
}

function on_backToLogin_clicked() {
    //sjpw login buttons
    $('#teacher_login')[0].setAttribute("visible", true);
    $('#learner_login')[0].setAttribute("visible", true);

    //jode pin entities
    $('#pin_entity')[0].setAttribute("visible", false);
}

function on_learner_login_clicked() {
    window.location.href = "/room.html";
}

function on_pin_field_clicked(fieldValue) {
    if (fieldValue === "clear")
        resetPin();
    else if (typeof parseInt(fieldValue) == "number") {
        setNextPinNumber(parseInt(fieldValue));
    } else {

    }
}

var pin;

function resetPin() {
    pin = new Array();
    updateView();
}

function setNextPinNumber(number) {
    console.log(debugString + "add number " + number);
    if (typeof (pin) == "undefined")
        pin = new Array();
    pin.push(number);

    updateView();

    if (pin.lenght == 4)
        sendLogin();
}

function updateView() {
    if (pin.length == 0) {
        $('#pin_star_0')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_1')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_2')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_3')[0].setAttribute("material", "src:;color: white;");
    } else if (pin.length == 1) {
        $('#pin_star_0')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_1')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_2')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_3')[0].setAttribute("material", "src:;color: white;");
    } else if (pin.length == 2) {
        $('#pin_star_0')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_1')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_2')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_3')[0].setAttribute("material", "src:;color: white;");
    } else if (pin.length == 3) {
        $('#pin_star_0')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_1')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_2')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_3')[0].setAttribute("material", "src:;color: white;");
    } else if (pin.length == 4) {
        $('#pin_star_0')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_1')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_2')[0].setAttribute("material", "src:#pin_star_asset");
        $('#pin_star_3')[0].setAttribute("material", "src:#pin_star_asset");
    } else {
        $('#pin_star_0')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_1')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_2')[0].setAttribute("material", "src:;color: white;");
        $('#pin_star_3')[0].setAttribute("material", "src:;color: white;");
    }
}

function sendLogin() {

}