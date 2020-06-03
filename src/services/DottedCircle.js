import * as THREE from "three";

export default class DottedCircle {
    constructor(radius = 40, x, y, z, s, options = {}) {
        const color = options["color"] || 0x000000;

        this.shape = new THREE.Shape()
            .moveTo(0, radius)
            .quadraticCurveTo(radius, radius, radius, 0)
            .quadraticCurveTo(radius, -radius, 0, -radius)
            .quadraticCurveTo(-radius, -radius, -radius, 0)
            .quadraticCurveTo(-radius, radius, 0, radius);

        this.shape.autoClose = true;
        const spacedPoints = this.shape.getSpacedPoints(15);
        const geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(
            spacedPoints
        );
        this.particles = new THREE.Points(
            geometrySpacedPoints,
            new THREE.PointsMaterial({ color, size: 0.02 })
        );
        this.particles.position.set(x, y, z);
        this.particles.scale.set(s, s, s);
        this.particles.rotateX(-0.5 * Math.PI);
    }
}
