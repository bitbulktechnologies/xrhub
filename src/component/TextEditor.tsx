import { makeStyles } from "@material-ui/styles";
import { editor as mEditor } from "monaco-editor";
import React, { useEffect, useRef, useState } from "react";

const useStyle = makeStyles({
    root: {
        height: "100%",
        width: "100%",
    },
});

const TextEditor = () => {
    const classes = useStyle();
    const ref = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<mEditor.IStandaloneCodeEditor>();
    useEffect(() => {
        const editor = mEditor.create(ref.current!);
        setEditor(editor);
    }, []);

    useEffect(() => {
        editor?.layout();
    });

    return (
        <div ref={ref} className={classes.root}>
            TextEditor
        </div>
    );
};

export default TextEditor;
