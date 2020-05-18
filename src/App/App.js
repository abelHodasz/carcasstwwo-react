import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from "./history";
import { CookiesProvider } from "react-cookie";

import Home from "../pages/Home/Home";
import Lobby from "../pages/Lobby/Lobby";
import Game from "../pages/Game/Game";
import HubConnectionProvider from "../context/HubConnectionContext";

function App() {
    return (
        <div className="app">
            <CookiesProvider>
                <HubConnectionProvider>
                    <Content />
                </HubConnectionProvider>
            </CookiesProvider>
        </div>
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
