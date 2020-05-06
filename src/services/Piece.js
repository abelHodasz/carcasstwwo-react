import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import piece from "../models/Meeple.gltf";
import { Mesh, MeshLambertMaterial, Box3, Vector3 } from "three";

export default class Piece {
    constructor(scene, color) {
        var loader = new GLTFLoader();
        this.material = new MeshLambertMaterial({ color });
        this.model = null;
        const loadMethod = (result) => {
            var model = result.scene.children[2];
            this.model = model;
            model.rotateX(0.5 * Math.PI);
            model.castShadow = true;
            model.receiveShadow = true;
            var box = new Box3().setFromObject(model);
            var center = new Vector3();
            box.getCenter(center);
            center.y = 0.02;
            model.position.sub(center);
            model.traverse((node) => {
                if (node.isMesh || node instanceof Mesh) {
                    node.material = this.material;
                    node.receiveShadow = true;
                    node.castShadow = true;
                }
            });

            scene.add(model);
        };

        loader.load(piece, loadMethod);
    }
}
