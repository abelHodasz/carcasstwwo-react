import * as THREE from "three";

export default class Board {
    constructor() {
        var planeGeometry = new THREE.PlaneGeometry(30, 30, 30);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.mesh.rotateX(-0.5 * Math.PI);
    }
}
