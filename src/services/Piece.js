import { Mesh, MeshLambertMaterial, Box3, Vector3 } from "three";

export default class Piece {
    constructor(scene, color, model) {
        this.material = new MeshLambertMaterial({ color });
        this.model = model;
        this.isInPlace = false;
        model.rotateX(0.5 * Math.PI);
        model.castShadow = true;
        model.receiveShadow = true;
        const center = this.getCenter();
        this.model.position.sub(center);
        model.traverse((node) => {
            if (node.isMesh || node instanceof Mesh) {
                node.material = this.material;
                node.receiveShadow = true;
                node.castShadow = true;
            }
        });
        this.center = center;
        scene.add(model);
        this.loaded = true;
        this.tileCoordinates = null;
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

    getCenter() {
        var box = new Box3().setFromObject(this.model);
        var center = new Vector3();
        box.getCenter(center);
        center.y = 0.02;
        return center;
    }

    setPosition(newPosition) {
        if (!this.loaded) {
            return;
        }
        this.model.position.copy(newPosition);
        this.model.position.sub(this.center);
    }

    setTileCoordinates(coord) {
        this.tileCoordinates = coord;
    }
}
