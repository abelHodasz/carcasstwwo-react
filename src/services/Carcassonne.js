import ThreeService from "./ThreeService";
import tile1 from "../images/1_4.png";
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

            var vector = new Vector3(three.mouse.x, three.mouse.y, 1);
            vector.unproject(three.camera);

            var dir = vector.sub(three.camera.position).normalize();
            var distance = -three.camera.position.y / dir.y;
            var pos = three.camera.position
                .clone()
                .add(dir.multiplyScalar(distance));
            tile.mesh.position.copy(pos);
            tile.y = 0.5;

            tile.isInPlace = false;
            for (const slot of possibleSlots) {
                const dist = tile.mesh.position.distanceTo(slot);
                if (dist < 0.5) {
                    tile.mesh.position.set(slot.x, 0.1, slot.z);
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

        document.addEventListener("mousemove", mousemove);

        document.addEventListener("mouseup", mouseup);
    }
}
