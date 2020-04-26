import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import piece from "../models/Meeple.gltf";
import * as THREE from "three";

export default class Piece {
    constructor(scene) {
        var loader = new GLTFLoader();
        loader.load(piece, (result) => {
            var model = result.scene.children[2];
            model.position.set(0.4, 0, -0.55);
            model.castShadow = true;
            model.receiveShadow = true;
            model.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });

            scene.add(model);
        });
    }
}
