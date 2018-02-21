const gravityInput = document.querySelector("#gravity");
const airThicknessInput = document.querySelector("#airThickness");

const jumpPowerInput = document.querySelector("#jumpPower");
const movePowerInput = document.querySelector("#movePower");
const bouncinessInput = document.querySelector("#bounciness");
const frictionInput = document.querySelector("#friction");

let world;
let player;

let playerOnGround = false;
let won = false;
let floors;

const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

let keys = new Array(223);
for (let i = 0; i < keys.length; i++) {
    keys[i] = false;
}

window.addEventListener("load", function() {

    //Fetch our canvas
    const canvas = document.getElementById("world");

    //Setup Matter JS
    const engine = Matter.Engine.create();
    world = engine.world;
    const render = Matter.Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth * (2 / 3),
            height: window.innerHeight,
            background: "transparent",
            wireframes: false,
            showAngleIndicator: false
        }
    });

    //Add a player
    player = Matter.Bodies.rectangle(250, 250, 40, 40, {
        density: 0.04,
        friction: frictionInput.value,
        frictionAir: airThicknessInput.value,
        restitution: bouncinessInput.value,
        render: {
            fillStyle: "#f35e66",
            strokeStyle: "black",
            lineWidth: 1
        }
    });
    Matter.World.add(world, player);

    const canvasWidth = canvas.width;

    const floor = Matter.Bodies.rectangle(window.innerWidth / 3, window.innerHeight - 20, window.innerWidth * 2 / 3, 40, {
        isStatic: true, //An immovable object
    });
    const ceiling = Matter.Bodies.rectangle(window.innerWidth / 3, 20, window.innerWidth * 2 / 3, 40, {
        isStatic: true
    });
    Matter.World.add(world, [floor, ceiling]);

    const wall1 = Matter.Bodies.rectangle(5, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true, //An immovable object
    });
    const wall2 = Matter.Bodies.rectangle((window.innerWidth * 2 / 3) - 5, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true, //An immovable object
    });
    Matter.World.add(world, [wall1, wall2]);

    const platform1 = Matter.Bodies.rectangle(canvasWidth / 4, window.innerHeight / 20 * 17, 100, 3, {
        isStatic: true
    });
    const platform2 = Matter.Bodies.rectangle(canvasWidth / 4 * 2, window.innerHeight / 20 * 13, 100, 3, {
        isStatic: true
    });
    const platform3 = Matter.Bodies.rectangle(canvasWidth / 4 * 3, window.innerHeight / 20 * 9, 100, 3, {
        isStatic: true
    });
    Matter.World.add(world, [platform1, platform2, platform3]);

    floors = [floor, platform1, platform2, platform3];

    const goal = Matter.Bodies.rectangle(canvasWidth / 10 * 9, canvasWidth / 10, canvasWidth / 10, canvasWidth / 10, {
        isSensor: true,
        isStatic: true,
        render: {
            fillStyle: "#00FF00"
        }
    });
    Matter.World.add(world, goal);

    //Start the engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    Matter.Events.on(runner, "beforeTick", () => {
        if (keys[UP] && playerOnGround) {
            Matter.Body.applyForce(player, player.position, {x: 0, y: -jumpPowerInput.value});
        }
        if (keys[LEFT] && keys[RIGHT]) {
            // Don't move!
        } else if (keys[LEFT]) {
            Matter.Body.applyForce(player, player.position, {x: -movePowerInput.value, y: 0});
        } else if (keys[RIGHT]) {
            Matter.Body.applyForce(player, player.position, {x: movePowerInput.value, y: 0});
        }
    });

    Matter.Events.on(engine, "collisionActive", (e) => {
        const pairs = e.pairs;
        let groundInvolved = false;
        let playerInvolved = false;

        pairs.forEach((pair) => {
            floors.forEach((item) => {
                if (isInvolved(item, pair)) {
                    groundInvolved = true;
                }
            });

            if (isInvolved(goal, pair)) {
                won = true;
                document.body.innerHTML = "<h1>You win!</h1>";
            }
        });

        playerOnGround = groundInvolved;
    });

    Matter.Events.on(engine, "collisionEnd", () => {
        playerOnGround = false;
    });

    function isInvolved(target, pair) {
        return pair.bodyA === target || pair.bodyB === target;
    }

    canvas.addEventListener("keydown", (e) => {
        keys[e.keyCode] = true;
    });
    canvas.addEventListener("keyup", (e) => {
        keys[e.keyCode] = false;
    })
});