import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { useCookies } from "react-cookie";

export default function Lobby(props) {
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const [isHost, setIsHost] = useState(false);
    const { code } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    useEffect(() => {
        if (cookies.user && cookies.user.isHost) setIsHost(true);
    }, []);

    useEffect(() => {
        if (cookies.user) {
            setJoined(true);
        }
    }, [cookies]);

    if (error)
        return (
            <div className="lobby">
                <h1>Unexpected error: {error}</h1>
            </div>
        );
    else if (joined) return <div className="lobby"></div>;
    else return <div className="lobby">Waiting for server...</div>;
}
