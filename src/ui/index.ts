// import { io } from "socket.io-client";
// const socket = io("http://127.0.0.1:8000/ws");

const ws = new WebSocket("http://127.0.0.1:8000/ws");

(() => {
    console.log("foo");
})()


window.onload = () => {

    const btn_light_on: HTMLElement|null = document.getElementById("light_on");

    if (btn_light_on === null) {
        return;
    }

    btn_light_on.onclick = () => {

        console.log("let there be light!!!");

        const data: string =
        JSON.stringify({ "lightbulb": 1, "action": true });
        console.log(data);

        ws.send(data);


        // const p: Promise<Response> =
        // fetch("http://127.0.0.1:8000/light/1?state=on", { method: 'POST' });
        // p.then((res) => {});



    };

}
