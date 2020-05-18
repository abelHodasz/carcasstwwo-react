import React, { useEffect, useState, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";

import InfoBox from "../../components/InfoBox/InfoBox";

import Carcassonne from "../../services/Carcassonne";
import { getCardImage } from "../../Constants/Constants";
import { Button } from "@material-ui/core";

export default function Game(props) {
    const [mount, setMount] = useState(null);
    const hubConnection = useContext(HubConnectionContext)[0];
    const [carcassonne, setCarcassone] = useState(null);
    const { code } = useParams();
    const [showEndTurn, setShowEndTurn] = useState(false);

    //
    const myTurn = async (card) => {
        //Possible placement slots
        const possibleSlots = createPossibleSlotsObject(
            card.coordinatesWithRotations
        );

        //Display the new tile
        carcassonne.newTile(card.tileId, possibleSlots, card.cardId);

        //Mock object
        const players = [
            { name: "Ábel", id: 1, me: true, color: "#00ff00", meepleCount: 5 },
            { name: "Iza", id: 1, me: false, color: "#ff0000", meepleCount: 2 },
            {
                name: "Máté",
                id: 1,
                me: false,
                color: "00#00ff",
                meepleCount: 6,
            },
        ];
        carcassonne.players = players;

        //Place the tile
        await carcassonne.placeTile();

        const me = players.filter((p) => p.me)[0];
        //if there are meeples
        if (me.meepleCount > 0) {
            setShowEndTurn(true);
            const color = me.color;
            //Display meeple if there's one available
            carcassonne.newMeeple(color);

            //Place the meeple
            await carcassonne.placeMeeple();
            setShowEndTurn(false);
        }

        //Send placement info to backend
        const tile = carcassonne.currentTile;
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
        //invoke end turn function on backend
        hubConnection.invoke("EndTurn", code, placedCard);
    };

    //Display what other players placed
    const refreshBoard = (card) => {
        const img = getCardImage(card.tileId);

        const position = new Vector3(card.coordinate.x, 0, -card.coordinate.y);
        carcassonne.createAndAddTile(
            img,
            card.cardId,
            position,
            parseInt(card.rotation)
        );
    };

    //Catch backend events ( game logic )
    useEffect(() => {
        if (hubConnection != null && carcassonne != null) {
            hubConnection.on("Turn", (card) => {
                myTurn(card);
            });

            hubConnection.on("RefreshBoard", (card) => {
                refreshBoard(card);
            });
        }

        // used functions are not dependencies -> disable warnings
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, hubConnection, carcassonne]);

    //Initialize three js, create Carcassone object
    useEffect(() => {
        if (mount != null) {
            const carcassonne = new Carcassonne(mount);
            carcassonne.three.init();
            carcassonne.three.animate();
            setCarcassone(carcassonne);
        }
    }, [mount]);

    return (
        <Fragment>
            <InfoBox />
            {showEndTurn && (
                <div className="end-turn-container">
                    <Button className="end-turn" variant="outlined">
                        End turn
                    </Button>
                </div>
            )}
            <div ref={(ref) => setMount(ref)}>
                <div className="game"></div>
            </div>
        </Fragment>
    );
}

//create an object from backend position data
function createPossibleSlotsObject(coords) {
    const possibleSlots = [];
    for (const position of coords) {
        possibleSlots.push({
            position: new Vector3(
                position.coordinate.x,
                0.5,
                -position.coordinate.y
            ),
            rotations: position.rotations,
        });
    }
    return possibleSlots;
}
