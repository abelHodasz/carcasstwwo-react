import React, { useState, useEffect, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { Typography, Box, Button, Container } from "../../themes/components";

export default function Lobby(props) {
    const { code } = useParams();
    const hubConnection = useContext(HubConnectionContext)[0];

    const [users, setUsers] = useState([]);
    const usersJsX = (
        <ul>
            {users.map((user) => (
                <li key={user.connectionId}>
                    <Typography>{user.name}</Typography>
                </li>
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

    return (
        <Box centertext className="app">
            <Typography variant="h2">Joined lobby : </Typography>
            <Typography variant="h1">{code}</Typography>
            {!!users.length && (
                <Fragment>
                    <div className="users">{usersJsX}</div>
                    <Button
                        className="start-btn"
                        color="primary"
                        variant="contained"
                        onClick={onStartGame}
                    >
                        Start
                    </Button>
                </Fragment>
            )}
        </Box>
    );
}
