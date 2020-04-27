import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import piece from "../models/Meeple.gltf";
import { Mesh, MeshLambertMaterial } from "three";

export default class Piece {
    constructor(scene) {
        var loader = new GLTFLoader();
        var material = new MeshLambertMaterial({ color: 0xff0000 });
        loader.load(piece, (result) => {
            var model = result.scene.children[2];
            model.position.set(0.35, 0.02, -0.55);
            model.rotateX(0.5 * Math.PI);
            model.castShadow = true;
            model.receiveShadow = true;
            model.traverse(function (node) {
                if (node.isMesh || node instanceof Mesh) {
                    node.material = material;
                    node.receiveShadow = true;
                    node.castShadow = true;
                }
            });

            scene.add(model);
        });
    }
}
