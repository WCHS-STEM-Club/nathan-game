class Ground {
    constructor(scene) {
        this.physics = Matter.Bodies.rectangle(0, -3, 10, 5, {
            isStatic: true
        });

        const geometry = new THREE.BoxGeometry(10, 5, 1);
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ff00
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = -3;
        scene.add(this.mesh);
    }
}
