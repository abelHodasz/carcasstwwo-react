import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { getCardImage } from "../../Constants/Constants";

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
                const img = getCardImage(Math.random() * 24 + 1);
                carcassonne.newTile(img, possibleSlots);
                carcassonne
                    .placeTile()
                    .then(() => hubConnection.invoke("EndTurn", code));
                setMyTurn(turn);
            });
            hubConnection.on("EndTurn", (message, turn) => {
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
        <div ref={(ref) => setMount(ref)}>
            <div className="game"></div>
        </div>
    );
}
