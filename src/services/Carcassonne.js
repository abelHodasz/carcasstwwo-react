import ThreeService from "./ThreeService";
import tile1 from "../images/20_4.png";
import Tile from "./Tile";
import Board from "./Board";
import Piece from "./Piece";
import { Vector3 } from "three";

export default class Carcassonne {
    constructor(mount) {
        this.three = new ThreeService(mount);
        const tile = new Tile(tile1);
        this.myTurn = false;
        this.tiles = [tile];
        this.currentTile = null;
        this.board = new Board(50, 50, 0.1);
        this.piece = new Piece(this.three.scene);
        this.three.scene.add(this.board.mesh);
        this.three.scene.add(tile.mesh);
    }

    newTile(img) {
        const tile = new Tile(img);
        this.currentTile = tile;
        tile.y = 1;
        tile.x = this.three.camera.position.x;
        tile.z = this.three.camera.position.z;
        this.three.scene.add(tile.mesh);
    }

    placeTile(possibleSlots) {
        const [three, tile] = [this.three, this.currentTile];

        const mousemove = (e) => {
            e.preventDefault();

            var mouseVector = new Vector3(three.mouse.x, three.mouse.y, 1);

            const position = getMousePositionInPlane(three.camera, mouseVector);

            tile.mesh.position.copy(position);
            tile.y = 0.5;

            tile.isInPlace = false;
            for (const slot of possibleSlots) {
                const dist = tile.mesh.position.distanceTo(slot.position);
                if (dist < 0.5) {
                    tile.mesh.position.set(
                        slot.position.x,
                        0.1,
                        slot.position.z
                    );
                    tile.mesh.rotation.set(
                        -0.5 * Math.PI,
                        0,
                        (slot.rotations[0] * Math.PI) / 180
                    );
                    tile.isInPlace = true;
                }
            }
        };

        const mouseup = (e) => {
            e.preventDefault();
            if (tile.isInPlace && e.button == 0) {
                this.tiles.push(tile);

                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseup);
                tile.y = 0;
                this.currentTile = null;
            }
        };

        const keypress = (e) => {
            if (e.key === "r" || e.key === "R") {
            }
            console.log(e.key);
        };

        document.addEventListener("mousemove", mousemove);
        document.addEventListener("keypress", keypress);
        document.addEventListener("mouseup", mouseup);
    }
}

function getMousePositionInPlane(camera, mouse) {
    mouse.unproject(camera);
    var dir = mouse.sub(camera.position).normalize();
    var distance = -camera.position.y / dir.y;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
}
