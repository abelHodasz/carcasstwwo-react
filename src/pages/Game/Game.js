import React, { useEffect, useState } from "react";

import * as ThreeService from "../../services/ThreeService";

export default function Game(props) {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount != null) {
            ThreeService.init(mount);
            ThreeService.animate();
        }
    }, [mount]);

    return <div ref={(ref) => setMount(ref)}></div>;
}
