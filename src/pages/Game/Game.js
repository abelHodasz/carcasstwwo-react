import React, { useEffect, useState } from "react";
import tile1 from "../../images/1_4.png";

import ThreeService from "../../services/ThreeService";
import Tile from "../../services/Tile";

export default function Game(props) {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount != null) {
            const three = new ThreeService(mount);
            const tile = new Tile(tile1);
            three.scene.add(tile.mesh);
            tile.y = 1;
            three.init();
            three.animate();
        }
    }, [mount]);

    return <div ref={(ref) => setMount(ref)}></div>;
}
