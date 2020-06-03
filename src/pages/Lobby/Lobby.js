import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import "./Lobby.css";
import { Button } from "@material-ui/core";

export default function Lobby(props) {
    const { code } = useParams();
    const hubConnection = useContext(HubConnectionContext)[0];

    const [users, setUsers] = useState([]);
    const usersJsX = (
        <ul>
            {users.map((user) => (
                <li key={user.connectionId}>{user.name}</li>
            ))}
        </ul>
    );

    useEffect(() => {
        if (hubConnection != null) {
            hubConnection.on("GroupNames", (members) => setUsers(members));
            hubConnection.on("StartGame", (message) => {
                props.history.push(`/game/${code}`);
            });
            hubConnection.invoke("GetGroupMembers", code);
        }
    }, [code, hubConnection, props.history]);

    const onStartGame = () => {
        hubConnection.invoke("StartGame", code);
    };

    if (users.length !== 0) {
        return (
            <div className="app">
                <div className="lobby">
                    <div>Joined lobby : {code}</div>
                    <div className="users">{usersJsX}</div>
                    <Button
                        className="start-btn"
                        color="primary"
                        onClick={onStartGame}
                    >
                        Start
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="app">
                <div className="lobby">Joined lobby : {code}</div>
            </div>
        );
    }
}
