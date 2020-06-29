import { Tile, PlacableTile } from "../classes/Tile";
import Meeple from "../classes/Meeple";
import Board from "../classes/Board";
import Player from "../classes/Player";
import { DottedCircle } from "../classes/ThreeComponents";
import { getMousePosition, toRadians } from "./UtilService";
import { getCardImage } from "../Constants/Constants";
import CONSTANTS from "../Constants/Constants";
import { Vector2, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import meepleModel from "../models/Meeple.gltf";

const BOARD_SIZE = 50;

export default class Carcassonne {
    constructor(three) {
        this.three = three;

        this.tiles = [];

        this.board = new Board(BOARD_SIZE, BOARD_SIZE, CONSTANTS.SNAP_HEIGHT);
        this.three.scene.add(this.board.mesh);

        this.meeple = null;
        this.meeples = [];
        this.meeplePosition = -1;
        this.meepleIndicators = [];
        this.meepleModel = null;

        this._players = [];

        const startingTile = this.getStarterTile();
        this.addTile(startingTile);
    }

    getStarterTile() {
        const img = getCardImage(CONSTANTS.STARTING_TILE);
        const texture = this.three.loadTexture(img);
        return new Tile(texture);
    }

    async loadMeepleModel() {
        return new Promise((resolve, reject) => {
            var loader = new GLTFLoader();
            loader.load(
                meepleModel,
                (result) => {
                    resolve(result.scene.children[2]);
                },
                null,
                reject
            );
        });
    }

    set players(value) {
        this._players = value.map((player) => new Player(player));
    }

    get players() {
        return this._players;
    }

    getCurrentCard() {
        const tile = this.currentTile;
        const rotation = tile.currentSlot.currentRotation;
        const placedCard = {
            CardId: tile.cardId,
            Rotation: rotation.toString(),
            Coordinate: {
                x: tile.x,
                y: -tile.z,
            },
            TileId: tile.tileId,
        };

        return placedCard;
    }

    newTile(id, possibleSlots, cardId) {
        const texture = this.three.getTexture(getCardImage(id));

        const tile = new PlacableTile(texture, possibleSlots, id, cardId);
        this.currentTile = tile;
        tile.y = 1;
        tile.x = this.three.camera.position.x;
        tile.z = this.three.camera.position.z;
        this.three.scene.add(tile.mesh);
    }

    newMeeple(color, tileCoords) {
        this.meeple = new Meeple(
            this.three.scene,
            color,
            this.meepleModel.clone()
        );
        this.meeple.setTileCoordinates(tileCoords);
    }

    addTile(tile) {
        this.tiles.push(tile);
        this.three.scene.add(tile.mesh);
    }

    removeFromScene(item) {
        this.three.scene.remove(item);
    }

    createAndAddTile(cardId, position, rotation) {
        const src = getCardImage(cardId);
        const texture = this.three.getTexture(src);
        const tile = new Tile(texture, cardId, position, rotation);
        this.addTile(tile);
    }

    createAndAddMeeple(position, meeplePosition, meepleColor) {
        const [newPosition] = this.getMeeplePositions(position.x, -position.y, [
            meeplePosition,
        ]);

        const meeple = new Meeple(
            this.three.scene,
            meepleColor,
            this.meepleModel.clone()
        );
        meeple.setPosition(
            new Vector3(newPosition.coord.x, 0, newPosition.coord.y)
        );
        meeple.setTileCoordinates(position);
        this.meeples.push(meeple);
    }

    removeMeeple(coords) {
        const [meepleToRemove] = this.meeples.filter(
            (meeple) =>
                meeple.tileCoordinates.x === coords.x &&
                meeple.tileCoordinates.y === coords.y
        );
        meepleToRemove && this.removeFromScene(meepleToRemove.model);
    }

    getMeeplePositions(x, y, positions, options = {}) {
        const d = options["meepleOffset"] || CONSTANTS.MEEPLE_OFFSET;
        /*
            1  2  3
            4  5  6
            7  8  9
            becomes
            [x-d, y-d] [x, y-d] [x+d, y-d]
            [x-d, y  ] [x, y  ] [x+d, y  ]
            [x-d, y+d] [x, y+d] [x+d, y+d]
        */
        const meeplePositions = [];
        for (const position of positions) {
            switch (position) {
                case 1:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x - d, y - d),
                    });
                    break;
                case 2:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x, y - d),
                    });
                    break;
                case 3:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x + d, y - d),
                    });
                    break;
                case 4:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x - d, y),
                    });
                    break;
                case 5:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x, y),
                    });
                    break;
                case 6:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x + d, y),
                    });
                    break;
                case 7:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x - d, y + d),
                    });
                    break;
                case 8:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x, y + d),
                    });
                    break;
                case 9:
                    meeplePositions.push({
                        number: position,
                        coord: new Vector2(x + d, y + d),
                    });
                    break;
                default:
                    throw new Error("Invalid position");
            }
        }
        return meeplePositions;
    }

    showMeeplePositions(meeplePositions = []) {
        for (const pos of meeplePositions) {
            const [x, y] = [pos.coord.x, pos.coord.y];
            const indicator = new DottedCircle(
                0.2,
                x,
                CONSTANTS.MEEPLE_INDICATOR_HEIGHT,
                y,
                0.2
            );
            this.meepleIndicators.push(indicator);
            this.three.scene.add(indicator.particles);
            this.three.animations.push(() => {
                indicator.particles.rotation.z -= 0.01;
            });
        }
    }

    removeMeeplePositions() {
        this.meepleIndicators.forEach((i) => this.removeFromScene(i.particles));
        this.meepleIndicators = [];

        this.three.animations.pop();
    }

    placeMeeple(positions) {
        const [meeple, three, tile] = [
            this.meeple,
            this.three,
            this.currentTile,
        ];
        const meeplePositions = this.getMeeplePositions(
            tile.x,
            tile.z,
            positions
        );

        this.showMeeplePositions(meeplePositions);

        return new Promise((resolve) => {
            const mousemove = () => {
                const mousePosition = getMousePosition(
                    three.camera,
                    three.mouse
                );
                meeple.setPosition(mousePosition);

                meeple.y = CONSTANTS.HOVER_HEIGHT;
                meeple.isInPlace = false;

                for (const pos of meeplePositions) {
                    const distanceToMeeple = meeple.model.position.distanceTo(
                        new Vector3(
                            pos.coord.x,
                            CONSTANTS.HOVER_HEIGHT,
                            pos.coord.y
                        )
                    );
                    if (distanceToMeeple < CONSTANTS.MEEPLE_SNAP_DISTANCE) {
                        const newPosition = new Vector3(
                            pos.coord.x,
                            CONSTANTS.SNAP_HEIGHT,
                            pos.coord.y
                        );
                        meeple.setPosition(newPosition);
                        this.meeplePosition = pos.number;
                        meeple.isInPlace = true;
                    }
                }
            };

            const mouseup = (e) => {
                const LEFT_MOUSE_BUTTON = 0;
                // if end turn button is clicked,resolve
                if (
                    e.target.classList.contains("end-turn") ||
                    e.target.parentNode.classList.contains("end-turn")
                ) {
                    this.removeMeeplePositions();
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    this.removeFromScene(this.meeple.model);
                    this.meeple = null;
                    resolve(-1);
                }
                //if meeple is placed, remove event listeners and resolve Promise
                else if (meeple.isInPlace && e.button === LEFT_MOUSE_BUTTON) {
                    this.removeMeeplePositions();
                    this.meeples.push(meeple);
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    meeple.y = 0;
                    resolve(this.meeplePosition);
                }
            };

            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", mouseup);
        });
    }

    placeTile() {
        const [tile, three] = [this.currentTile, this.three];
        this.showMeeplePositions();
        return new Promise((resolve) => {
            const mousemove = (e) => {
                //project mouse position to plane
                const mousePosition = getMousePosition(
                    three.camera,
                    three.mouse
                );
                tile.mesh.position.copy(mousePosition);
                //elevate tile, when not snapping to slot
                tile.y = CONSTANTS.HOVER_HEIGHT;
                tile.isInPlace = false;
                for (const slot of tile.possibleSlots) {
                    //distance to each possible slot
                    const distanceToSlot = tile.mesh.position.distanceTo(
                        slot.position
                    );
                    //if close to a spot, snap to it
                    if (distanceToSlot < CONSTANTS.TILE_SNAP_DISTANCE) {
                        tile.mesh.position.set(
                            slot.position.x,
                            CONSTANTS.SNAP_HEIGHT,
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
                    toRadians(tile.currentSlot.currentRotation)
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
