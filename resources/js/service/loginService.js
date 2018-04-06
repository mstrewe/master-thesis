const debugString = "[DEBUG] ";

function on_teacher_login_clicked() {
    //hide login buttons
    $('#teacher_login')[0].setAttribute("position", "-2000 -0.3 -4"); // original -2 -0.3 -4
    $('#learner_login')[0].setAttribute("position", "-2000 -0.3 -4"); // original 2 -0.3 -4

    //show pin entities
    $('#pin_entity')[0].setAttribute("position", "0 0 0");
}

function on_backToLogin_clicked() {
    //sjpw login buttons
    $('#teacher_login')[0].setAttribute("position", "-2 -0.3 -4");
    $('#learner_login')[0].setAttribute("position", "2 -0.3 -4");

    //jode pin entities
    $('#pin_entity')[0].setAttribute("position", "2000 0 0 ");
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
    pin = "";
    updateView();
}

function setNextPinNumber(number) {
    console.log(debugString + "add number " + number);
    if (typeof (pin) == "undefined")
        pin = "";
    pin += number.toString();
    updateView();

    if (pin.length == 4)
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
    $.ajax(
        {
            data: JSON.stringify({ "pin": pin }),
            method: "POST",
            url: "/api/teacher_login",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.success == true) {
                    document.cookie = document.cookie + "logincookie=" + response.cookie + ";path=/"
                }
            },
            error: function () {

            }
        }
    )
}