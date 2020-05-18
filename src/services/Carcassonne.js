import ThreeService from "./ThreeService";
import tile1 from "../images/20_4.png";
import { Tile, PlacableTile } from "./Tile";
import Piece from "./Piece";
import Board from "./Board";
import Player from "./Player";
import { getMousePosition, toRadians } from "./UtilService";
import { getCardImage } from "../Constants/Constants";

export default class Carcassonne {
    constructor(mount, players) {
        this.three = new ThreeService(mount);
        const startingTile = new Tile(tile1);
        this.tiles = [];
        this.addTile(startingTile);
        this.board = new Board(50, 50, 0.1);
        this.meeple = null;
        this.meeples = [];
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

    newTile(id, possibleSlots, cardId) {
        const img = getCardImage(id);
        const tile = new PlacableTile(img, possibleSlots, id, cardId);
        this.currentTile = tile;
        tile.y = 1;
        tile.x = this.three.camera.position.x;
        tile.z = this.three.camera.position.z;
        this.three.scene.add(tile.mesh);
    }

    newMeeple(color) {
        this.meeple = new Piece(this.three.scene, color);
    }

    addTile(tile) {
        this.tiles.push(tile);
        this.three.scene.add(tile.mesh);
    }

    createAndAddTile(img, cardId, position, rotation) {
        const tile = new Tile(img, cardId, position, rotation);
        this.addTile(tile);
    }

    placeMeeple(positions) {
        const [meeple, three] = [this.meeple, this.three];

        return new Promise((resolve) => {
            const mousemove = () => {
                const mousePosition = getMousePosition(
                    three.camera,
                    three.mouse
                );
                meeple.setPosition(mousePosition);
            };

            const mouseup = (e) => {
                //if end turn button is clicked,resolve
                if (
                    e.target.classList.contains("end-turn") ||
                    e.target.parentNode.classList.contains("end-turn")
                ) {
                    console.log("End turn");
                    resolve(-1);
                }

                //if meeple is placed, remove event listeners and resolve Promise
                const LEFT_MOUSE_BUTTON = 0;
                if (meeple.isInPlace && e.button === LEFT_MOUSE_BUTTON) {
                    this.meeples.push(meeple);
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    meeple.y = 0;
                    resolve();
                }
            };

            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", mouseup);
        });
    }

    placeTile() {
        const [tile, three] = [this.currentTile, this.three];

        return new Promise((resolve) => {
            const mousemove = (e) => {
                //project mouse position to plane
                const mousePosition = getMousePosition(
                    three.camera,
                    three.mouse
                );
                tile.mesh.position.copy(mousePosition);
                //elevate tile, when not snapping to slot
                tile.y = 0.5;
                tile.isInPlace = false;
                for (const slot of tile.possibleSlots) {
                    //distance to each possible slot
                    const distanceToSlot = tile.mesh.position.distanceTo(
                        slot.position
                    );
                    //if close to a spot, snap to it
                    if (distanceToSlot < 0.5) {
                        tile.mesh.position.set(
                            slot.position.x,
                            0.1,
                            slot.position.z
                        );
                        tile.mesh.rotation.set(
                            -0.5 * Math.PI,
                            0,
                            toRadians(slot.currentRotation)
                        );
                        tile.currentSlot = slot;
                        tile.isInPlace = true;
                    }
                }
            };

            const keypress = (e) => {
                //rotate when pressing R
                if (e.key === "r" || e.key === "R") {
                    tile.currentSlot.rotate();
                }
                tile.mesh.rotation.set(
                    -0.5 * Math.PI,
                    0,
                    toRadians(this.currentSlot.currentRotation)
                );
            };

            const mouseup = (e) => {
                //if tile is placed, remove event listeners and resolve Promise
                const LEFT_MOUSE_BUTTON = 0;
                if (tile.isInPlace && e.button === LEFT_MOUSE_BUTTON) {
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
