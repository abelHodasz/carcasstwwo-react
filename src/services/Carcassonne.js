import ThreeService from "./ThreeService";
import tile1 from "../images/20_4.png";
import { Tile, PlacableTile, Slot } from "./Tile";
import Board from "./Board";
import Piece from "./Piece";
import Player from "./Player";
import { getMousePosition } from "./UtilService";
import { getCardImage } from "../Constants/Constants";

export default class Carcassonne {
    constructor(mount, players) {
        this.three = new ThreeService(mount);
        const startingTile = new Tile(tile1);
        this.tiles = [];
        this.addTile(startingTile);
        this.board = new Board(50, 50, 0.1);
        //this.piece = new Piece(this.three.scene);
        this.three.scene.add(this.board.mesh);
        this._players = [];
    }

    set players(value) {
        this._players = value.map(
            (player) => new Player(player.name, player.id)
        );
    }

    get players() {
        return this._players;
    }

    newTile(id, possibleSlots) {
        const img = getCardImage(id);
        const tile = new PlacableTile(img, possibleSlots, id);
        console.log("Settings current Tile: ", tile);
        console.log(this);
        this.currentTile = tile;
        tile.y = 1;
        tile.x = this.three.camera.position.x;
        tile.z = this.three.camera.position.z;
        this.three.scene.add(tile.mesh);
    }

    addTile(tile) {
        this.tiles.push(tile);
        this.three.scene.add(tile.mesh);
    }

    placeTile() {
        const [tile, three] = [this.currentTile, this.three];

        return new Promise((resolve) => {
            const mousemove = (e) => {
                const mousePosition = getMousePosition(
                    three.camera,
                    three.mouse
                );
                tile.mesh.position.copy(mousePosition);
                tile.y = 0.5;
                tile.isInPlace = false;
                for (const slot of tile.possibleSlots) {
                    const distanceToSlot = tile.mesh.position.distanceTo(
                        slot.position
                    );
                    if (distanceToSlot < 0.5) {
                        tile.mesh.position.set(
                            slot.position.x,
                            0.1,
                            slot.position.z
                        );
                        tile.mesh.rotation.set(
                            -0.5 * Math.PI,
                            0,
                            (slot.currentRotation * Math.PI) / 180
                        );
                        tile.currentSlot = slot;
                        tile.isInPlace = true;
                    }
                }
            };

            const keypress = (e) => {
                if (e.key === "r" || e.key === "R") {
                    tile.currentSlot.rotate();
                }
                tile.mesh.rotation.set(
                    -0.5 * Math.PI,
                    0,
                    (tile.currentSlot.currentRotation * Math.PI) / 180
                );
            };

            const mouseup = (e) => {
                e.preventDefault();
                if (tile.isInPlace && e.button === 0) {
                    this.tiles.push(tile);
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("keypress", keypress);
                    document.removeEventListener("mouseup", mouseup);
                    tile.y = 0;
                    resolve();
                }
            };

            document.addEventListener("mousemove", mousemove);
            document.addEventListener("keypress", keypress);
            document.addEventListener("mouseup", mouseup);
        });
    }
}
