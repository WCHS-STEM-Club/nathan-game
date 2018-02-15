const PlayerStates = {
    ON_GROUND: 0,
    IN_AIR: 1
};

class Player {
    constructor(scene) {
        this.state = PlayerStates.ON_GROUND;

        this.pos = new THREE.Vector3(0, 0, 0); // Position
        this.v = new THREE.Vector3(0, 0, 0); // Velocity

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        });

        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }

    calcNewPos() {
        this.v.multiplyScalar(friction);
        this.pos.addVectors(this.pos, this.v);
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.state = PlayerStates.ON_GROUND;
        } else if (this.pos.y > 0) {
            this.v.y -= gravity;
            this.state = PlayerStates.IN_AIR;
        }
    }

    syncMesh() {
        this.mesh.position.x = this.pos.x;
        this.mesh.position.y = this.pos.y;
        this.mesh.position.z = this.pos.z;
    }
}
