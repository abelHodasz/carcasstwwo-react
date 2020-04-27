import React, { useEffect, useState } from "react";
import "./Game.css";
import img from "../../images/7_2.png";
import { Vector3 } from "three";

import Carcassonne from "../../services/Carcassonne";

export default function Game(props) {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount != null) {
            const possibleSlots = [
                new Vector3(0, 0.5, 1),
                new Vector3(0, 0.5, -1),
                new Vector3(1, 0.5, 0),
                new Vector3(-1, 0.5, 0),
            ];
            const carcassonne = new Carcassonne(mount);
            const myTurn = true;
            carcassonne.newTile(img);
            if (myTurn) {
                carcassonne.myTurn = true;
                carcassonne.placeTile(possibleSlots);
            }
            carcassonne.three.init();
            carcassonne.three.animate();
        }
    }, [mount]);

    return (
        <div ref={(ref) => setMount(ref)}>
            <div className="game"></div>
        </div>
    );
}
