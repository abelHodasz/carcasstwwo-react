import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import { Vector3, Vector2 } from "three";
import { HubConnectionContext } from "../../context/HubConnectionContext";
import InfoBox from "../../components/InfoBox/InfoBox";
import Carcassonne from "../../services/Carcassonne";
import Loading from "../../components/Loading/Loading";
import { images } from "../../Constants/Constants";
import { Button, Box, Grid, Typography } from "@material-ui/core";
import CONSTANTS from "../../Constants/Constants";
import ThreeService from "../../services/ThreeService";

import meepleSvg from "../../models/meeple.js";
import { getUniqueRandom } from "../../services/UtilService";
// Coordinates in three are different, that's why everywhere y(height) is constant and z(depth) is -y
// x(width) remains the same

const random = getUniqueRandom();

export default function Game(props) {
    const [mount, setMount] = useState(null);
    const hubConnection = useContext(HubConnectionContext)[0];
    const [carcassonne, setCarcassone] = useState(null);
    const { code } = useParams();
    const [showEndTurn, setShowEndTurn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([]);
    const [connectionId, setConnectionId] = useState(null);

    const [playersJsx, setPlayersJsx] = useState(<span></span>);

    const myTurn = async (card) => {
        // possible placement slots
        const possibleSlots = createPossibleSlotsObject(
            card.coordinatesWithRotations
        );
        // display the new tile
        carcassonne.newTile(card.tileId, possibleSlots, card.cardId);
        // place the tile
        await carcassonne.placeTile();
        // send placement info to backend
        const placedCard = carcassonne.getCurrentCard();
        // invoke end placement function on backend
        hubConnection.invoke("EndPlacement", code, placedCard);
    };

    // place meeple if there are available
    const placeMeeple = async (positions) => {
        // default value of position if no meeple is placed
        const placedCard = carcassonne.getCurrentCard();
        let position = -1;
        if (positions.length) {
            const [me] = carcassonne.players.filter((p) => {
                return p.id === connectionId;
            });
            // if there are meeples
            if (me.meepleCount > 0) {
                // show button to end turn
                setShowEndTurn(true);
                // display meeple if there's one available
                carcassonne.newMeeple(
                    me.color,
                    new Vector2(
                        placedCard.Coordinate.x,
                        placedCard.Coordinate.y
                    )
                );
                // place the meeple
                position = await carcassonne.placeMeeple(positions);

                // hide button to end turn
                setShowEndTurn(false);
            }
        }

        // invoke end turn function on backend
        hubConnection.invoke("EndTurn", code, position, placedCard);
    };

    // display what other players placed
    const refreshBoard = async (card, meeplePosition, lastPlayer) => {
        const position = new Vector3(card.coordinate.x, 0, -card.coordinate.y);
        carcassonne.createAndAddTile(
            card.tileId,
            position,
            parseInt(card.rotation)
        );
        const color = carcassonne.players.filter(
            (player) => player.id === lastPlayer.connectionId
        )[0].color;
        if (meeplePosition !== -1) {
            carcassonne.createAndAddMeeple(
                new Vector2(card.coordinate.x, card.coordinate.y),
                meeplePosition,
                color
            );
        }
    };

    // add scores
    const updatePlayers = (playersUpdate) => {
        playersUpdate.map((newPlayer) => {
            let player = players.filter((player) => player.id === newPlayer.id);
            player = { ...player, ...newPlayer };
            return player;
        });
        setPlayers(playersUpdate);
    };

    const removeMeeples = (meeplesToRemove) => {
        meeplesToRemove.forEach((meeplePos) => {
            const coords = new Vector2(
                meeplePos.coordinate.x,
                meeplePos.coordinate.y
            );
            carcassonne.removeMeeple(coords);
        });
    };

    useEffect(() => {
        if (carcassonne && players) {
            carcassonne.players = players;
            setPlayersJsx(
                <Grid>
                    {players.map((player) => (
                        <span key={player.id}>
                            <Grid
                                item
                                container
                                jusity="center"
                                alignItems="center"
                            >
                                <Grid item xs={4}>
                                    <Typography variant="h5">
                                        {player.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography>{player.score}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    className="meeple-img-container"
                                >
                                    <Box
                                        display="flex"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        {Array(player.meepleCount)
                                            .fill(0)
                                            .map(() =>
                                                meepleSvg(
                                                    player.color,
                                                    random.next().value
                                                )
                                            )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </span>
                    ))}
                </Grid>
            );
        }
    }, [players, carcassonne]);

    useEffect(() => {
        (async () => {
            if (hubConnection != null) {
                const data = await hubConnection.invoke("GetConnectionId");
                setConnectionId(data);
            }
        })();
    }, [hubConnection]);

    // catch backend events ( game logic )
    useEffect(() => {
        if (
            hubConnection != null &&
            carcassonne != null &&
            connectionId != null
        ) {
            hubConnection.invoke("Ready", code);

            hubConnection.on("Turn", (card) => {
                myTurn(card);
            });

            hubConnection.on("PlaceMeeple", (positions) => {
                placeMeeple(positions);
            });

            hubConnection.on(
                "RefreshBoard",
                (card, placeOfMeeple, lastPlayer) => {
                    refreshBoard(card, placeOfMeeple, lastPlayer);
                }
            );

            hubConnection.on("RemoveMeeples", (meeplesToRemove) => {
                removeMeeples(meeplesToRemove);
            });

            hubConnection.on("UpdatePlayers", (players) => {
                updatePlayers(players);
            });
        }

        // used functions are not dependencies -> disable warnings
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubConnection, carcassonne, connectionId]);

    // initialize three js, create Carcassone object
    useEffect(() => {
        (async () => {
            if (mount != null) {
                const three = new ThreeService(mount);
                const carcassonne = new Carcassonne(three);
                carcassonne.meepleModel = await carcassonne.loadMeepleModel();
                setCarcassone(carcassonne);
                three.loadTexturesAsync(Object.values(images)).then(() => {
                    setLoading(false);
                    carcassonne.three.init();
                    carcassonne.three.animate();
                });
                console.log("images loaded");
            }
        })();
    }, [mount]);

    return (
        <>
            <InfoBox />
            {showEndTurn && (
                <Box className="end-turn-container">
                    <Button className="end-turn" variant="outlined">
                        End turn
                    </Button>
                </Box>
            )}
            {loading && (
                <Box className="loading">
                    <Loading />
                </Box>
            )}
            <Box className="scores">{playersJsx}</Box>
            <div ref={(ref) => setMount(ref)}>
                <div className="game"></div>
            </div>
        </>
    );
}

// create an object from backend position data
function createPossibleSlotsObject(coords) {
    const possibleSlots = [];
    for (const position of coords) {
        possibleSlots.push({
            position: new Vector3(
                position.coordinate.x,
                CONSTANTS.HOVER_HEIGHT,
                -position.coordinate.y
            ),
            rotations: position.rotations,
        });
    }
    return possibleSlots;
}
