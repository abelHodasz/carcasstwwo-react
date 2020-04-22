import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

export default function Home(props) {
    const [name, setName] = useState("");

    const onCreateLobby = (event) => {
        if (name.length > 0) {
            props.history.push("/lobby/asd123");
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
            <Button className="create-lobby-btn" onClick={onCreateLobby}>
                Create Lobby
            </Button>
        </div>
    );
}
