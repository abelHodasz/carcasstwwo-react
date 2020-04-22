import React from "react";
import { TextField, Button } from "@material-ui/core";

export default function Home(props) {
    console.log(props);
    return (
        <div>
            <TextField
                required
                className="name-input"
                id="standard-basic"
                label="Your Name"
            ></TextField>
            <Button
                className="create-lobby-btn"
                onClick={() => props.history.push("/lobby/asd123")}
            >
                Create Lobby
            </Button>
        </div>
    );
}
