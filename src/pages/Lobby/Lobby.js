import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { useCookies } from "react-cookie";
import { HubConnectionBuilder } from "@aspnet/signalr";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { Button } from "@material-ui/core";
import history from "../../App/history";

export default function Lobby(props) {
    const { code } = useParams();

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [hubConnection, setHubConnection] = useContext(HubConnectionContext);

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
                console.log(message);
                props.history.push(`/${code}/trialgame`);

                hubConnection.invoke("StartTurn", code);
                console.log("now invoked startturn");
            });
            hubConnection.invoke("GetGroupMembers", code);
        }
    }, [code, hubConnection, props.history]);

    const onStartGame = () => {
        hubConnection.invoke("StartGame", code);
    };

    if (users.length !== 0) {
        return (
            <div>
                <div className="lobby">Joined lobby : {code}</div>
                <div className="users">{usersJsX}</div>
                <Button
                    className="start-btn"
                    color="primary"
                    onClick={onStartGame}
                >
                    Start
                </Button>
            </div>
        );
    } else {
        return <div className="lobby">Joined lobby : {code}</div>;
    }
}
