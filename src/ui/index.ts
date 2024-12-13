const ADDRESS = "http://172.31.180.71:8000/lightctl";
const ws = new WebSocket(ADDRESS);


const render_checkboxes = (lightbulb_count: number) => {

    for (let id of Array(lightbulb_count).keys()) {
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





ws.onmessage = message => {
    const jason: string = message.data;
    const data = JSON.parse(jason);

    console.log(data);

    // render the initial checkboxes
    if ("count" in data) {
        console.log(`count is: ${data.count}`);
        render_checkboxes(data.count);

    // change checkbox state
    } else {
        const id = data.id;
        const state: boolean = data.state;
        const checkbox = <HTMLInputElement> document.getElementById(`checkbox_${id}`);
        checkbox.checked = state;
    }

};

window.onload = () => {


}
