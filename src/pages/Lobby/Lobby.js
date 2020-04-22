import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { useCookies } from "react-cookie";
import { HubConnectionBuilder } from "@aspnet/signalr";

export default function Lobby(props) {
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const [isHost, setIsHost] = useState(false);
    const { code } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [hubConnection, setHubConnection] = useState(null);

    useEffect(() => {
        if (cookies.user && cookies.user.isHost) setIsHost(true);
        const hubConn = new HubConnectionBuilder()
            .withUrl("https://localhost:5000/lobby")
            .build();
        setHubConnection(hubConn);
    }, []);

    useEffect(() => {
        if (cookies.user) {
            setJoined(true);
        }
    }, [cookies]);

    useEffect(() => {
        if (hubConnection != null)
            hubConnection
                .start()
                .then(() => console.log("Conntection started!"))
                .catch((e) => console.log(e));
    }, [hubConnection]);

    if (error)
        return (
            <div className="lobby">
                <h1>Unexpected error: {error}</h1>
            </div>
        );
    else if (joined) return <div className="lobby"></div>;
    else return <div className="lobby">Waiting for server...</div>;
}
