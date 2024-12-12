// const ADDRESS = "http://127.0.0.1:8000/lightctl";
const ADDRESS = "http://172.31.179.138:8000/lightctl";

const ws = new WebSocket(ADDRESS);

const LIGHTBULB_COUNT: number = 3;

ws.onmessage = message => {
    const jason: string = message.data;
    const data = JSON.parse(jason);

    const id = data.id;
    const state: boolean = data.state;

    const checkbox = <HTMLInputElement> document.getElementById(`checkbox_${id}`);
    checkbox.checked = state;

};

window.onload = () => {

    for (let id of Array(LIGHTBULB_COUNT).keys()) {
        id++;

        const toggle_button: HTMLInputElement = document.createElement("input");
        toggle_button.setAttribute("type", "checkbox");
        toggle_button.setAttribute("id", `checkbox_${id}`);

        const element: HTMLElement|null = document.getElementById("div");
        if (element === null) { return; }
        element.appendChild(toggle_button);

        toggle_button.onclick = () => {
            console.log("let there be light!!!");

            const data: string = JSON.stringify(
                { "id": id, "action": toggle_button.checked }
            );
            ws.send(data);
        };

    }


}
