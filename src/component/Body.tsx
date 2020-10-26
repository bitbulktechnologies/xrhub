import { makeStyles } from "@material-ui/styles";
import {
    CustomTab,
    DIRECTION,
    ILayoutNode,
    Layout,
    LayoutNode,
    NODE_TYPE,
    Provider as WidgetLayoutProvider,
} from "@spongelearning/widget-layout";
import React from "react";

import Sidebar from "./Sidebar";
import TextEditor from "./TextEditor";
import ViewPort from "./ViewPort";

const layout: ILayoutNode = {
    id: "root",
    type: NODE_TYPE.LAYOUT_NODE,
    direction: DIRECTION.ROW,
    children: [
        {
            id: "sidebar-widget",
            type: NODE_TYPE.WIDGET_NODE,
            children: [
                {
                    id: "sidebar",
                    type: NODE_TYPE.PANEL,
                    Page: () => <Sidebar />,
                    Tab: CustomTab,
                    title: "sidebar",
                },
            ],
        },
        {
            id: "main-widget",
            type: NODE_TYPE.WIDGET_NODE,
            children: [
                {
                    id: "main",
                    type: NODE_TYPE.PANEL,
                    Page: () => <TextEditor />,
                    Tab: CustomTab,
                    title: "main",
                },
            ],
        },
        {
            id: "view-widget",
            type: NODE_TYPE.WIDGET_NODE,
            children: [
                {
                    id: "view",
                    type: NODE_TYPE.PANEL,
                    Page: () => <ViewPort id={"view"} />,
                    Tab: CustomTab,
                    title: "view",
                },
            ],
        },
    ],
};

const rootNode = new LayoutNode(layout);

const useStyle = makeStyles({
    root: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
});

const Body = () => {
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <WidgetLayoutProvider value={rootNode}>
                <Layout nodeId={rootNode.id} />
            </WidgetLayoutProvider>
        </div>
    );
};

export default Body;
