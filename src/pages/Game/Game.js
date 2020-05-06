import React, { useEffect, useState, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { getCardImage } from "../../Constants/Constants";
import { getRandomInt } from "../../services/UtilService";
import InfoBox from "../../components/InfoBox/InfoBox";

import Carcassonne from "../../services/Carcassonne";

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
                console.log(card);
                for (const position of card.coordinatesWithRotations) {
                    possibleSlots.push({
                        position: new Vector3(
                            position.coordinate.x,
                            0.5,
                            position.coordinate.y
                        ),
                        rotations: position.rotations,
                    });
                }
                const cardId = getRandomInt(24) + 1;
                const img = getCardImage(cardId);
                carcassonne.newTile(img, possibleSlots);
                const players = [
                    { name: "Ábel", id: 1 },
                    { name: "Iza", id: 1 },
                    { name: "Máté", id: 1 },
                ];
                carcassonne.players = players;
                carcassonne
                    .placeTile()
                    .then(() => hubConnection.invoke("EndTurn", code));
                setMyTurn(turn);
            });

            hubConnection.on("EndTurn", (message, turn) => {
                console.log(message);
                setMyTurn(turn);
            });

            hubConnection.on("RefreshBoard", (card) => {
                console.log(card);
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
