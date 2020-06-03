import React, { useState, useEffect, useContext, Fragment } from "react";
import { Grid, Typography } from "@material-ui/core";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import { TextField, Button, Box, Container } from "../../themes/components";
import { HubConnectionBuilder } from "@aspnet/signalr";
import Loading from "../../components/Loading/Loading";
import CarcassonneIllustration from "../../images/site/carcassonne-illustration.png";
import "./Home.css";

export default function Home(props) {
    const [name, setName] = useState("");
    const [hubConnection, setHubConnection] = useContext(HubConnectionContext);
    const [room, setRoom] = useState("");
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                    console.log("Connection started!");
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
        <Container>
            <Box textAlign="center">
                <Typography variant="h1">CarcassTwwo</Typography>
            </Box>
            <Grid container justify="center">
                <Grid item xs={10} sm={6}>
                    <img
                        className="home-img"
                        src={CarcassonneIllustration}
                        alt="carcassonne-illustration"
                    />
                </Grid>
                <Grid item xs={10} md={6}>
                    <Box display="flex" flexDirection="column" height="100%">
                        <Box component="section" centertext>
                            <Typography variant="h3">
                                Change your name
                            </Typography>
                            <TextField
                                variant="outlined"
                                className="name-input"
                                label="Name"
                                size="small"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            ></TextField>
                        </Box>
                        <Box
                            centertext
                            component="section"
                            flexGrow="1"
                            display="flex"
                            flexDirection="column"
                            style={{ height: "100%" }}
                        >
                            <Typography variant="h3">
                                Create or Join a Lobby
                            </Typography>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs={12} sm={5}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="create-lobby-btn"
                                        onClick={onCreateLobby}
                                    >
                                        Create Lobby
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    or
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                    >
                                        <TextField
                                            variant="outlined"
                                            className="room-input"
                                            id="standard-basic"
                                            label="Room Code"
                                            size="small"
                                            onChange={(e) => {
                                                setRoom(e.target.value);
                                            }}
                                        ></TextField>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className="join-lobby-btn"
                                            onClick={onJoinLobby}
                                        >
                                            Join Lobby
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
