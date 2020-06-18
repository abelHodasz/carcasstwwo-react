import { Shape, BufferGeometry, Points, PointsMaterial } from "three";

export function RoundedRectShape(x, y, width, height, radius) {
    var shape = new Shape();

    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(
        x + width,
        y + height,
        x + width,
        y + height - radius
    );
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    return shape;
}

export class DottedCircle {
    constructor(radius = 40, x, y, z, s, options = {}) {
        const color = options["color"] || 0x000000;

        this.shape = new Shape()
            .moveTo(0, radius)
            .quadraticCurveTo(radius, radius, radius, 0)
            .quadraticCurveTo(radius, -radius, 0, -radius)
            .quadraticCurveTo(-radius, -radius, -radius, 0)
            .quadraticCurveTo(-radius, radius, 0, radius);

        this.shape.autoClose = true;
        const spacedPoints = this.shape.getSpacedPoints(15);
        const geometrySpacedPoints = new BufferGeometry().setFromPoints(
            spacedPoints
        );
        this.particles = new Points(
            geometrySpacedPoints,
            new PointsMaterial({ color, size: 0.02 })
        );
        this.particles.position.set(x, y, z);
        this.particles.scale.set(s, s, s);
        this.particles.rotateX(-0.5 * Math.PI);
    }
}
