import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { useCookies } from "react-cookie";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import "./Lobby.css";

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
            hubConnection.invoke("GetGroupMembers", code);
        }
    }, [code, hubConnection]);

    const onStartGame = () => {};

    if (users.length !== 0) {
        return (
            <div>
                <div className="lobby">Joined lobby : {code}</div>
                <div className="users">{usersJsX}</div>
            </div>
        );
    } else {
        return <div className="lobby">Joined lobby : {code}</div>;
    }
}
