const ws = new WebSocket("http://127.0.0.1:8000/lightctl");

(() => {
})()


ws.onmessage = message => {
    // TODO: receive ws state message (update ui)
    const data = message.data;
    console.log(data);

};


window.onload = () => {

    const btn_light_on: HTMLElement|null = document.getElementById("light_on");

    if (btn_light_on === null) {
        return;
    }

    btn_light_on.onclick = () => {
        console.log("let there be light!!!");

        const data: string =
        JSON.stringify({ "id": 1, "action": true });

        ws.send(data);
        // const p: Promise<Response> =
        // fetch("http://127.0.0.1:8000/light/1?state=on", { method: 'POST' });
        // p.then((res) => {});
    };

}
