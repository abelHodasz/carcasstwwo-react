import React, { createContext, useState, useEffect } from "react";

export const HubConnectionContext = createContext();

const HubConnectionProvider = (props) => {
    const [hubConnection, setHubConnection] = useState(null);

    return (
        <HubConnectionContext.Provider
            value={[hubConnection, setHubConnection]}
        >
            {props.children}
        </HubConnectionContext.Provider>
    );
};

export default HubConnectionProvider;
