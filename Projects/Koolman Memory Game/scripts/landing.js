let username = "";

$("#anonymous").click(function () {
    username = "Tourist";
    load_game_1();
});

$("#login-button").click(function () {
    let u = $("#username").val();
    console.log("username=", u);
    username = u;
    load_game_1();
});

function load_game_1() {
    $(location).prop('href', 'rgb.html')
}