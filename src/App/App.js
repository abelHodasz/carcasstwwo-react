import React from "react";
import "./App.css";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import { CookiesProvider } from "react-cookie";

import Home from "../pages/Home/Home";
import Lobby from "../pages/Lobby/Lobby";
import Game from "../pages/Game/Game";
import HubConnectionProvider from "../context/HubConnectionContext";

import { ThemeProvider } from "@material-ui/styles";
import theme from "../themes/theme";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <CookiesProvider>
                    <HubConnectionProvider>
                        <Content />
                    </HubConnectionProvider>
                </CookiesProvider>
            </CssBaseline>
        </ThemeProvider>
    );
}

function Content() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/lobby/:code" component={Lobby} />
                <Route path="/game/:code" component={Game} />
            </Switch>
        </Router>
    );
}

export default App;
