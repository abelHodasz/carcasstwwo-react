import React, { useState, useContext, useEffect } from "react";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function TrialGame() {
    const [myTurn, setMyTurn] = useState(false);
    const [message, setMessage] = useState("Waiting for the others");
    const [hubConnection, setHubConnection] = useContext(HubConnectionContext);
    const { code } = useParams();

    useEffect(() => {
        if (hubConnection != null) {
            hubConnection.on("Turn", (message, turn) => {
                setMessage(message);
                setMyTurn(turn);
            });
            hubConnection.on("EndTurn", (message, turn) => {
                setMessage(message);
                setMyTurn(turn);
            });
        }
    }, [code, hubConnection]);

    if (myTurn) {
        return (
            <div>
                <div>{message}</div>
                <Button onClick={() => hubConnection.invoke("EndTurn", code)}>
                    End Turn
                </Button>
            </div>
        );
    } else {
        return (
            <div>
                <div>{message}</div>
            </div>
        );
    }
}
