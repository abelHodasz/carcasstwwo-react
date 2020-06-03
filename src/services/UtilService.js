import { Vector3 } from "three";

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getMousePosition(camera, mouse) {
    const mouseVector = new Vector3(mouse.x, mouse.y, 1);
    mouseVector.unproject(camera);
    var dir = mouseVector.sub(camera.position).normalize();
    var distance = -camera.position.y / dir.y;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
}

export function toRadians(degree) {
    return (degree * Math.PI) / 180;
}
