import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";

import Body from "./component/Body";

const useStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
    },
});

function App() {
    const classes = useStyle();
    return (
        <div className={clsx("App", classes.root)}>
            <Body />
        </div>
    );
}

export default App;
