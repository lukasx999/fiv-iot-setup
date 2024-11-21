
const ws = new WebSocket("http://127.0.0.1:8000/lightctl");

(() => {

})()


window.onload = () => {

    /*
    const img_dababy: HTMLElement|null =
    document.getElementById("hitartistandrapper");

    if (img_dababy === null) {
        return;
    }

    let deg: number = 0;

    setInterval(() => {
        img_dababy.style.transform = `rotate(${deg}deg)`;
        img_dababy.style.left = ``;
        deg += 1;
        if (deg >= 360) {
            deg = 0;
        }
    }, 10);
    */



    const btn_light_on: HTMLElement|null = document.getElementById("light_on");

    if (btn_light_on === null) {
        return;
    }

    btn_light_on.onclick = () => {

        console.log("let there be light!!!");

        const data: string =
        JSON.stringify({ "id": 1, "action": true });
        console.log(data);

        ws.send(data);

        // const p: Promise<Response> =
        // fetch("http://127.0.0.1:8000/light/1?state=on", { method: 'POST' });
        // p.then((res) => {});

    };

}
