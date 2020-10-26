import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyle = makeStyles({
    root: {
        color: "white",
    },
});

const MenuItem = (props: { name: string }) => {
    const { name } = props;
    const classes = useStyle();
    return <div className={classes.root}>{name}</div>;
};

export default MenuItem;
