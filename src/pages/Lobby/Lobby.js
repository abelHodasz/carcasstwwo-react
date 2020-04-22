import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { useCookies } from "react-cookie";
import { HubConnectionBuilder } from "@aspnet/signalr";
import { Button } from "@material-ui/core";

export default function Lobby(props) {
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const [isHost, setIsHost] = useState(false);
    const { code } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [hubConnection, setHubConnection] = useState(null);
    const [users, setUsers] = useState([]);
    const usersJsX = (
        <ul>
            {users.map((user) => (
                <li>{user.name}</li>
            ))}
        </ul>
    );
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

    const onStartGame = () => {};

    if (error)
        return (
            <div className="lobby">
                <h1>Unexpected error: {error}</h1>
            </div>
        );
    else if (joined)
        return (
            <div className="lobby">
                <h3>Joined:</h3>
                {usersJsX}
                {isHost ? (
                    <Button className="start-game-btn" onClick={onStartGame}>
                        Start Game
                    </Button>
                ) : (
                    "Waiting for Host to start the game..."
                )}
            </div>
        );
    else return <div className="lobby">Waiting for server...</div>;
}
