let friction = 0.9;
let gravity = -0.1;
let movePower = 0.1;

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
const light = new THREE.PointLight(0xffffff);

/***********
 * Physics *
 ***********/
const engine = new Matter.Engine.create();
engine.world.gravity.y = gravity;
const ground = new Ground(scene);
const player = new Player(scene);

Matter.World.add(engine.world, [ground.physics, player.physics]);

function initScene() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    light.position.set(10, 1, 10);

    scene.add(light);

    camera.position.set(0, 0, 20);

    scene.add(camera);
    animate();

}

initScene();

function animate() {
    requestAnimationFrame(animate);
    Matter.Engine.run(engine);
    player.sync();
    camera.position.x = player.pos.x;
    light.position.x = player.pos.x + 10;
    renderer.render(scene, camera);
}

window.addEventListener("keydown", (e) => {
    const UP = 38;
    const DOWN = 40;

    if (player.state !== PlayerStates.IN_AIR || gravity === 0) {
        switch (e.keyCode) {
            case UP:
                Matter.Body.applyForce(player.physics, {x: 0, y: 1}, {x: 0, y: movePower});
                break;
            case DOWN:
                Matter.Body.applyForce(player.physics, {x: 0, y: -1}, movePower);
                break;
        }
    }
});