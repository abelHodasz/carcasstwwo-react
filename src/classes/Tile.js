import * as THREE from "three";
import { RoundedRectShape } from "./ThreeComponents";
import { LinearFilter } from "three";
import CONSTANTS from "../Constants/Constants";

export class Tile {
    constructor(texture, tileId, position = null, rotation = null) {
        this.tileId = tileId;
        const img = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            map: texture,
        });

        img.map.needsUpdate = true;
        img.map.minFilter = LinearFilter;

        const roundedRectShape = new RoundedRectShape(0, 0, 1, 1, 0.05);
        const geometry = new THREE.ExtrudeBufferGeometry(
            roundedRectShape,
            CONSTANTS.ROUNDED_RECT_EXTRUDE_SETTINGS
        );
        geometry.translate(-0.5, -0.5, 0);

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

        if (position) {
            this.x = position.x;
            this.y = position.y;
            this.z = position.z;
        }

        if (rotation) {
            this.mesh.rotation.z = (rotation * Math.PI) / 180;
        }
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
        img.map.minFilter = LinearFilter;
        this.mesh.material = img;
    }
}

export class PlacableTile extends Tile {
    constructor(texture, slots, tileId, cardId) {
        super(texture, tileId);
        this.cardId = cardId;
        this.possibleSlots = slots.map(({ position, rotations }) => {
            return new Slot(position, rotations);
        });
        this.currentSlot = this.possibleSlots[0];
        this.isInPlace = false;
    }
}

export class Slot {
    constructor(position, rotations) {
        this.position = position;
        this.rotations = rotations;
        this.rotationIndex = 0;
        this.currentRotation = rotations[0];
    }
    rotate() {
        this.rotationIndex =
            this.rotationIndex === this.rotations.length - 1
                ? 0
                : this.rotationIndex + 1;
        this.currentRotation = this.rotations[this.rotationIndex];
    }
}
