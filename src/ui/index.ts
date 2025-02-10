const ADDRESS = "ws://172.31.177.108:8000/lightctl";
const ws = new WebSocket(ADDRESS);




class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ball {
    constructor(size, width, height) {
        this.radius   = size;
        this.velocity = new Vector(5, 3);
        this.width    = width;
        this.height   = height;
        this.position = new Vector(width / 2, height / 2);
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.x-this.radius <= 0)
            this.velocity.x *= -1;

        if (this.position.y-this.radius <= 0)
            this.velocity.y *= -1;

        if (this.position.x+this.radius >= this.width)
            this.velocity.x *= -1;

        if (this.position.y+this.radius >= this.height)
            this.velocity.y *= -1;
    }
    draw(ctx) {
        this.update();

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightblue";
        ctx.fill();
        ctx.stroke();

    }
}



window.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("canvas");
    const ctx    = canvas.getContext("2d");
    const width  = canvas.width;
    const height = canvas.height;

    const ball = new Ball(50, width, height);

    setInterval(() => {
        ball.draw(ctx);
        console.log("render!");
    }, 10);

}, false);





const render_checkboxes = (lightbulb_count: number) => {

    for (let id of Array(lightbulb_count).keys()) {
        id++;

        const toggle_button: HTMLInputElement = document.createElement("input");
        toggle_button.setAttribute("type", "checkbox");
        toggle_button.setAttribute("id", `checkbox_${id}`);

        const element: HTMLElement|null = document.getElementById("main");
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

//window.onload = () => {
//}
