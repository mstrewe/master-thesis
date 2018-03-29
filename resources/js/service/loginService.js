function on_teacher_login_clicked() {
    //hide login buttons
    $('#teacher_login').setAttribute("visible", false);
    $('#learner_login').setAttribute("visible", false);

    //show pin entities
    $('#pin_entity').setAttribute("visible", true);
}

function on_learner_login_clicked() {
    window.location.href = "/room";
}