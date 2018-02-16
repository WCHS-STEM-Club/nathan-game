const PlayerStates = {
    ON_GROUND: 0,
    IN_AIR: 1
};

class Player {
    constructor(scene) {
        this.state = PlayerStates.ON_GROUND;

        this.pos = new THREE.Vector3(0, 5, 0); // Position

        this.physics = Matter.Bodies.rectangle(0, 5, 1, 1);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        });

        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }

    sync() {
        this.pos.x = this.physics.position.x;
        this.pos.y = this.physics.position.y;

        this.mesh.position.x = this.pos.x;
        this.mesh.position.y = this.pos.y;
    }

    setState() {
        if (this.physics.velocity.y === 0) {
            this.state = PlayerStates.ON_GROUND;
        } else {
            this.state = PlayerStates.IN_AIR;
        }
    }
}
