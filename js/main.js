let friction = 0.9;
let gravity = 0.3;
let movePower = 1;

Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
const scene = new Physijs.Scene();
const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
const light = new THREE.PointLight(0xffffff);

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 1),
    new THREE.MeshLambertMaterial({
        color: 0x00ff00
    })
);

function initScene() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light.position.set(10, 1, 10);
    scene.add(light);

    floor.position.y = -3;
    scene.add(floor);

    camera.position.set(0, 0, 20);
    scene.add(camera);

    animate();
}

let player = new Player(scene);
player.v.x = 1;

initScene();

function animate() {
    requestAnimationFrame(animate);
    player.calcNewPos();
    player.syncMesh();
    camera.position.x = player.pos.x;
    light.position.x = player.pos.x + 10;
    renderer.render(scene, camera);
}
// animate();

window.addEventListener("keydown", (e) => {
    const UP = 38;
    const DOWN = 40;

    if (player.state !== PlayerStates.IN_AIR || gravity === 0) {
        switch (e.keyCode) {
            case UP:
                player.v.y += movePower;
                break;
            case DOWN:
                player.v.y -= movePower;
                break;
        }
    }
});