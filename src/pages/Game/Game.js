import React, { useEffect, useState } from "react";

import ThreeService from "../../services/ThreeService";

export default function Game(props) {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount != null) {
            const three = new ThreeService(mount);
            three.init();
            three.animate();
        }
    }, [mount]);

    return <div ref={(ref) => setMount(ref)}></div>;
}
