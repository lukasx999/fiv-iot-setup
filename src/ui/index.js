window.onload = function () {
    var btn_light_on = document.getElementById("light_on");
    if (btn_light_on === null) {
        return;
    }
    btn_light_on.onclick = function () {
        console.log("let there be light!");
        var p = fetch("http://127.0.0.1:8000/light/1?state=on");
        p.then(function (res) {
            var j = res.json();
            console.log(j);
        });
    };
};
