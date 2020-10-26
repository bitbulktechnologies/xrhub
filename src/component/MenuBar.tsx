import { makeStyles } from "@material-ui/styles";
import React from "react";

import MenuItem from "./MenuItem";

const useStyle = makeStyles({
    root: {
        backgroundColor: "#000000bb",
        display: "flex",
    },
});

const MenuBar = () => {
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <MenuItem name="File" />
        </div>
    );
};

export default MenuBar;
