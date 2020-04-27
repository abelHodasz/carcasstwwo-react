import React, { useEffect, useState } from "react";
import tile1 from "../../images/1_4.png";

import ThreeService from "../../services/ThreeService";
import Tile from "../../services/Tile";
import Board from "../../services/Board";
import Piece from "../../services/Piece";

export default function Game(props) {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount != null) {
            const three = new ThreeService(mount);
            const tile = new Tile(tile1);
            const board = new Board(50, 50, 0.1);
            const piece = new Piece(three.scene);
            three.scene.add(board.mesh);
            three.scene.add(tile.mesh);
            three.init();
            three.animate();
        }
    }, [mount]);

    return <div ref={(ref) => setMount(ref)}></div>;
}
