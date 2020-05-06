import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import img from "../../images/7_2.png";
import images from "../../images/*.png";
import { Vector3 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";

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
                console.log(images);
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
                } /*
                    {
                        position: new Vector3(0, 0.5, -1),
                        rotations: [90, 180, 270],
                    },
                    { position: new Vector3(1, 0.5, 0), rotations: [270] },
                    { position: new Vector3(-1, 0.5, 0), rotations: [90] },
                ];*/
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
