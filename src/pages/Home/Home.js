import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Box } from "@material-ui/core";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { HubConnectionBuilder } from "@aspnet/signalr";
import "./Home.css";

export default function Home(props) {
    const [name, setName] = useState("");
    const [hubConnection, setHubConnection] = useContext(HubConnectionContext);
    const [room, setRoom] = useState("");

    useEffect(() => {
        const hubConn = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/lobby")
            .build();
        console.log(hubConn);
        setHubConnection(hubConn);
    }, [setHubConnection]);

    useEffect(() => {
        if (hubConnection != null)
            hubConnection
                .start()
                .then(() => {
                    console.log("Conntection started!");

                    hubConnection.on("Send", (message, members) =>
                        console.log(message, members)
                    );
                })
                .catch((e) => console.log(e));
    }, [hubConnection]);

    const onCreateLobby = (event) => {
        if (name.length > 0) {
            hubConnection
                .invoke("CreateGroup", name)
                .then((groupName) => {
                    props.history.push(`/lobby/${groupName}`);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const onJoinLobby = (event) => {
        if (name.length > 0 && room.length === 6) {
            hubConnection
                .invoke("AddToGroup", room, name, false)
                .then(() => {
                    props.history.push(`/lobby/${room}`);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    return (
        <div className="home">
            <Box className="row">
                <TextField
                    required
                    className="name-input"
                    id="standard-basic"
                    label="Your Name"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                ></TextField>
                <Button className="create-lobby-btn" onClick={onCreateLobby}>
                    Create Lobby
                </Button>
            </Box>
            <Box className="row">
                <TextField
                    required
                    className="room-input"
                    id="standard-basic"
                    label="Room Code"
                    onChange={(e) => {
                        setRoom(e.target.value);
                    }}
                ></TextField>
                <Button className="join-lobby-btn" onClick={onJoinLobby}>
                    Join Lobby
                </Button>
            </Box>
        </div>
    );
}
