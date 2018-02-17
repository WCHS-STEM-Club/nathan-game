const gravityInput = document.querySelector("#gravity");
const airThicknessInput = document.querySelector("#airThickness");

const jumpPowerInput = document.querySelector("#jumpPower");
const movePowerInput = document.querySelector("#movePower");
const bouncinessInput = document.querySelector("#bounciness");
const frictionInput = document.querySelector("#friction");

let world;
let player;

let playerOnGround = false;

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
            fillStyle: "#F35e66",
            strokeStyle: "black",
            lineWidth: 1
        }
    });
    Matter.World.add(world, player);

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

    const platform1 = Matter.Bodies.rectangle(100, window.innerHeight / 20 * 17, 100, 3, {
        isStatic: true
    });
    const platform2 = Matter.Bodies.rectangle(400, window.innerHeight / 20 * 17, 100, 3, {
        isStatic: true
    });
    const platform3 = Matter.Bodies.rectangle(700, window.innerHeight / 20 * 17, 100, 3, {
        isStatic: true
    });
    Matter.World.add(world, [platform1, platform2, platform3]);

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

    Matter.Events.on(engine, "collisionStart", (e) => {
        const pairs = e.pairs;

        playerOnGround = true;

        // pairs.forEach((pair) => {
        //     let groundInvolved = isInvolved(floor, pair);
        //     let playerInvolved = isInvolved(player, pair);
        //     let platform1Involved = isInvolved(platform1, pair);
        //
        //     if (groundInvolved && playerInvolved) {
        //         playerOnGround = true;
        //     }
        // });
    });

    Matter.Events.on(engine, "collisionActive", (e) => {
        playerOnGround = true;
    });

    Matter.Events.on(engine, "collisionEnd", (e) => {
        const pairs = e.pairs;

        playerOnGround = false;

        // pairs.forEach((pair) => {
        //     let groundInvolved = isInvolved(floor, pair);
        //     let playerInvolved = isInvolved(player, pair);
        //
        //     if (groundInvolved && playerInvolved) {
        //         playerOnGround = false;
        //     }
        // });
    });

    function isInvolved(target, pair) {
        return pair.bodyA === target || pair.bodyB === target;
    }

    canvas.addEventListener("keydown", (e) => {
        keys[e.keyCode] = true;
        //
        //
        //
        //
        //
        // switch (e.keyCode) {
        //     case UP:
        //         if (playerOnGround) {
        //             Matter.Body.applyForce(player, player.position, {x: 0, y: -jumpPowerInput.value});
        //         }
        //         break;
        //     case LEFT:
        //         Matter.Body.applyForce(player, player.position, {x: -movePowerInput.value, y: 0});
        //         break;
        //     case RIGHT:
        //         Matter.Body.applyForce(player, player.position, {x: movePowerInput.value, y: 0});
        //         break;
        // }
    });
    canvas.addEventListener("keyup", (e) => {
        keys[e.keyCode] = false;
    })
});