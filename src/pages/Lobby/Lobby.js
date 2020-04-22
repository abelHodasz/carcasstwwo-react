import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Lobby(props) {
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const { code } = useParams();

    useEffect(() => {}, []);

    if (error)
        return (
            <div className="lobby">
                <h1>Unexpected error: {error}</h1>
            </div>
        );
    else if (joined) return <div className="lobby"></div>;
    else return <div className="lobby"></div>;
}
