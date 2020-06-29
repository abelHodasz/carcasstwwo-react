import * as THREE from "three";

export default class Board {
    constructor(width, length, depth) {
        const planeGeometry = new THREE.BoxGeometry(width, length, depth);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });

        this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);

        this.mesh.rotateX(-0.5 * Math.PI);
        this.mesh.position.y = -depth / 2;
        this.mesh.receiveShadow = true;
    }
}
