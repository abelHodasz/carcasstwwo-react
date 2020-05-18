import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import piece from "../models/Meeple.gltf";
import { Mesh, MeshLambertMaterial, Box3, Vector3 } from "three";

export default class Piece {
    constructor(scene, color) {
        var loader = new GLTFLoader();
        this.material = new MeshLambertMaterial({ color });
        this.model = null;
        this.loaded = false;
        const loadMethod = (result) => {
            var model = result.scene.children[2];
            this.model = model;
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
        };
        loader.load(piece, loadMethod);
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
}
