import { Mesh, MeshLambertMaterial } from "three";
import { getCenter } from "../services/UtilService";

export default class Piece {
    constructor(scene, color, model) {
        this.material = new MeshLambertMaterial({ color });
        this.model = model;
        this.isInPlace = false;
        this.tileCoordinates = null;

        model.rotateX(0.5 * Math.PI);
        const center = getCenter(this.model);
        this.center = center;
        this.model.position.sub(center);

        model.castShadow = true;
        model.receiveShadow = true;

        model.traverse((node) => {
            if (node.isMesh || node instanceof Mesh) {
                node.material = this.material;
                node.receiveShadow = true;
                node.castShadow = true;
            }
        });

        scene.add(model);
    }

    get x() {
        return this.model.position.x;
    }

    set x(val) {
        this.model.position.x = val;
    }
    get y() {
        return this.model.position.y;
    }

    set y(val) {
        this.model.position.y = val;
    }
    get z() {
        return this.model.position.z;
    }

    set z(val) {
        this.model.position.z = val;
    }

    setPosition(newPosition) {
        this.model.position.copy(newPosition);
        this.model.position.sub(this.center);
    }

    setTileCoordinates(coordinates) {
        this.tileCoordinates = coordinates;
    }
}
