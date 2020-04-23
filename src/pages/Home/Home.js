import React, { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { HubConnectionBuilder } from "@aspnet/signalr";

export default function Home(props) {
    const [name, setName] = useState("");
    const [hubConnection, setHubConnection] = useState(null);
    const [room, setRoom] = useState("");

    useEffect(() => {
        const hubConn = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/lobby")
            .build();
        console.log(hubConn);
        setHubConnection(hubConn);
    }, []);

    useEffect(() => {
        if (hubConnection != null)
            hubConnection
                .start()
                .then(() => console.log("Conntection started!"))
                .catch((e) => console.log(e));
    }, [hubConnection]);

    const onCreateLobby = (event) => {
        if (name.length > 0) {
            hubConnection
                .invoke("CreateGroup")
                .then((groupName) => {
                    props.history.push(`/lobby/${groupName}`);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const onJoinLobby = (event) => {
        if (name.length > 0 && room.length == 6) {
            hubConnection
                .invoke("AddToGroup", room)
                .then(() => {
                    props.history.push(`/lobby/${room}`);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    return (
        <div>
            <TextField
                required
                className="name-input"
                id="standard-basic"
                label="Your Name"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            ></TextField>
            <TextField
                required
                className="room-input"
                id="standard-basic"
                label="Room Code"
                onChange={(e) => {
                    setRoom(e.target.value);
                }}
            ></TextField>
            <Button className="create-lobby-btn" onClick={onCreateLobby}>
                Create Lobby
            </Button>
            <Button className="join-lobby-btn" onClick={onJoinLobby}>
                Join Lobby
            </Button>
        </div>
    );
}
