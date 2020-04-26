import * as THREE from "three";
import { RoundedRectShape } from "./ThreeComponents";

export default class Tile {
    constructor(image) {
        var img = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture(image),
        });
        img.map.needsUpdate = true;
        var roundedRectShape = new RoundedRectShape(0, 0, 1, 1, 0.05);
        var extrudeSettings = {
            depth: 0.01,
            bevelEnabled: true,
            bevelSegments: 1,
            steps: 1,
            bevelSize: 0.01,
            bevelThickness: 0.01,
        };
        var geometry = new THREE.ExtrudeBufferGeometry(
            roundedRectShape,
            extrudeSettings
        );
        this.mesh = new THREE.Mesh(geometry, img);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.rotateX(-0.5 * Math.PI);
        this.mesh.traverse((n) => {
            if (n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
            }
        });
    }

    get x() {
        return this.mesh.position.x;
    }

    set x(val) {
        this.mesh.position.x = val;
    }
    get y() {
        return this.mesh.position.y;
    }

    set y(val) {
        this.mesh.position.y = val;
    }
    get z() {
        return this.mesh.position.z;
    }

    set z(val) {
        this.mesh.position.z = val;
    }

    set image(src) {
        var img = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture(src),
        });
        img.map.needsUpdate = true;
        this.mesh.material = img;
    }
}
