import React, { useEffect, useState, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";

import InfoBox from "../../components/InfoBox/InfoBox";

import Carcassonne from "../../services/Carcassonne";
import { getCardImage } from "../../Constants/Constants";

export default function Game(props) {
    const [mount, setMount] = useState(null);
    const [hubConnection, setHubConnection] = useContext(HubConnectionContext);
    const [myTurn, setMyTurn] = useState(false);
    const [carcassonne, setCarcassone] = useState(null);
    const { code } = useParams();

    useEffect(() => {
        if (hubConnection != null && carcassonne != null) {
            hubConnection.on("Turn", (card, turn) => {
                const possibleSlots = [];
                for (const position of card.coordinatesWithRotations) {
                    possibleSlots.push({
                        position: new Vector3(
                            position.coordinate.x,
                            0.5,
                            -position.coordinate.y
                        ),
                        rotations: position.rotations,
                    });
                }
                carcassonne.newTile(card.tileId, possibleSlots);
                const players = [
                    { name: "Ábel", id: 1 },
                    { name: "Iza", id: 1 },
                    { name: "Máté", id: 1 },
                ];
                carcassonne.players = players;
                carcassonne.placeTile().then(() => {
                    const card = {
                        Coordinate: {
                            x: carcassonne.currentTile.x,
                            y: -carcassonne.currentTile.z,
                        },
                        CardId: carcassonne.currentTile.cardId,
                        rotation:
                            carcassonne.currentTile.currentSlot.currentRotation,
                    };
                    hubConnection.invoke("EndTurn", code, card);
                });
                setMyTurn(turn);
            });

            hubConnection.on("EndTurn", (message, turn) => {
                setMyTurn(turn);
            });

            hubConnection.on("RefreshBoard", (card) => {
                const img = getCardImage(card.cardId);
                console.log(card);
                const position = new Vector3(
                    card.coordinate.x,
                    0,
                    -card.coordinate.y
                );
                carcassonne.createAndAddTile(img, card.cardId, position);
            });
        }
    }, [code, hubConnection, carcassonne]);

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
            <div ref={(ref) => setMount(ref)}>
                <div className="game"></div>
            </div>
        </Fragment>
    );
}
