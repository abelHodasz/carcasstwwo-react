import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import InfoBox from "../../components/InfoBox/InfoBox";
import Carcassonne from "../../services/Carcassonne";
import Loading from "../../components/Loading/Loading";
import { images } from "../../Constants/Constants";
import { Button } from "@material-ui/core";
import CONSTANTS from "../../Constants/Constants";
import ThreeService from "../../services/ThreeService";

// Coordinates in three are different, that's why everywhere y(height) is constant and z(depth) is -y
// x(width) remains the same

export default function Game(props) {
    const [mount, setMount] = useState(null);
    const hubConnection = useContext(HubConnectionContext)[0];
    const [carcassonne, setCarcassone] = useState(null);
    const { code } = useParams();
    const [showEndTurn, setShowEndTurn] = useState(false);
    const [loading, setLoading] = useState(true);

    const myTurn = async (card) => {
        // possible placement slots
        const possibleSlots = createPossibleSlotsObject(
            card.coordinatesWithRotations
        );

        // display the new tile
        carcassonne.newTile(card.tileId, possibleSlots, card.cardId);

        // mock object
        const players = [
            {
                name: "Ábel",
                id: 1,
                me: false,
                color: "#00ff00",
                meepleCount: 5,
            },
            { name: "Iza", id: 1, me: true, color: "#ff0000", meepleCount: 2 },
            {
                name: "Máté",
                id: 1,
                me: false,
                color: "#0000ff",
                meepleCount: 6,
            },
        ];
        //TODO: dont reassign new players every time
        carcassonne.players = players;

        // place the tile
        await carcassonne.placeTile();

        // send placement info to backend
        const placedCard = carcassonne.getCurrentCard();
        // invoke end placement function on backend
        hubConnection.invoke("EndPlacement", code, placedCard);
    };

    // place meeple if there are available
    const placeMeeple = async (positions) => {
        // default value of position if no meeple is placed
        let position = -1;

        if (positions !== null) {
            const me = carcassonne.players.filter((p) => p.me)[0];
            // if there are meeples
            if (me.meepleCount > 0) {
                // show button to end turn
                setShowEndTurn(true);
                // display meeple if there's one available
                carcassonne.newMeeple(me.color);
                // place the meeple
                position = await carcassonne.placeMeeple(positions);

                // hide button to end turn
                setShowEndTurn(false);
            }
        }
        const placedCard = carcassonne.getCurrentCard();
        // invoke end turn function on backend
        hubConnection.invoke("EndTurn", code, position, placedCard);
    };

    // display what other players placed
    const refreshBoard = (card) => {
        const position = new Vector3(card.coordinate.x, 0, -card.coordinate.y);
        carcassonne.createAndAddTile(
            card.tileId,
            position,
            parseInt(card.rotation)
        );
    };

    // add scores
    const updatePlayers = (players) => {};

    // catch backend events ( game logic )
    useEffect(() => {
        if (hubConnection != null && carcassonne != null) {
            hubConnection.on("Turn", (card) => {
                myTurn(card);
            });

            hubConnection.on("PlaceMeeple", (positions) => {
                placeMeeple(positions);
            });

            hubConnection.on("RefreshBoard", (card) => {
                refreshBoard(card);
            });

            hubConnection.on("UpdatePlayers", (players) => {
                updatePlayers(players);
            });
        }

        // used functions are not dependencies -> disable warnings
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubConnection, carcassonne]);

    // initialize three js, create Carcassone object
    useEffect(() => {
        if (mount != null) {
            const three = new ThreeService(mount);
            const carcassonne = new Carcassonne(three);
            setCarcassone(carcassonne);
            three.loadTexturesAsync(Object.values(images)).then(() => {
                setLoading(false);
                carcassonne.three.init();
                carcassonne.three.animate();
            });
            console.log("images loaded");
        }
    }, [mount]);

    return (
        <>
            <InfoBox />
            {showEndTurn && (
                <div className="end-turn-container">
                    <Button className="end-turn" variant="outlined">
                        End turn
                    </Button>
                </div>
            )}
            {loading && (
                <div className="loading">
                    <Loading />
                </div>
            )}
            <div ref={(ref) => setMount(ref)}>
                <div className="game"></div>
            </div>
        </>
    );
}

// create an object from backend position data
function createPossibleSlotsObject(coords) {
    const possibleSlots = [];
    for (const position of coords) {
        possibleSlots.push({
            position: new Vector3(
                position.coordinate.x,
                CONSTANTS.HOVER_HEIGHT,
                -position.coordinate.y
            ),
            rotations: position.rotations,
        });
    }
    return possibleSlots;
}
