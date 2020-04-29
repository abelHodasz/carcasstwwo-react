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
                <li>{user.name}</li>
            ))}
        </ul>
    );

    /*
    hubConnection.on("Send", (message) => {
        console.log(message);
    });
*/
    const onStartGame = () => {};

    return <div className="lobby">Joined lobby : {code}</div>;
}
