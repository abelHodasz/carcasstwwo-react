import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from "./history";

import Home from "../pages/Home/Home";
import Lobby from "../pages/Lobby/Lobby";

function App() {
    return (
        <div className="app">
            <Content />
        </div>
    );
}

function Content() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/lobby/:code" component={Lobby} />
            </Switch>
        </Router>
    );
}

export default App;
