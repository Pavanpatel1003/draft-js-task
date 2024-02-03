import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";

const Change = () => {
    const [starCount, setStarCount] = useState(1);
    const [editorState, setEditorState] = useState(() => {
        const savedData = localStorage.getItem("editorContent");
        if (savedData) {
            const contentState = convertFromRaw(JSON.parse(savedData));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        // localStorage.setItem("editorContent", JSON.stringify(rawContentState));
    }, [editorState]);

    const handleChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const customStyleMap = {
        COLOR_RED: {
            color: 'red',
        },
        UNDERLINE: {
            textDecoration: 'underline',
        },
        ITALIC: {
            fontStyle: 'italic',
        },
        // Add more custom styles as needed
    };

    const handleBeforeInput = (char) => {
        if (char === '*') {
            setStarCount(starCount + 1);
        } else {
            setStarCount(1);
        }

        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
        const currentText = currentBlock.getText();
debugger
        if (char === "#" && currentText.trim() === "") {
            const nextState = RichUtils.toggleBlockType(editorState, "header-one");
            handleChange(nextState);
            return "handled";
        }

        if (char === "*" && currentText.trim() === "") {
            if (starCount === 2) {
                const nextState = RichUtils.toggleInlineStyle(editorState, "COLOR_RED");
                handleChange(nextState);
                return "handled";
            } else if (starCount === 3) {
                const nextState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
                handleChange(nextState);
                return "handled";
            } else {
                const nextState = RichUtils.toggleInlineStyle(editorState, "BOLD");
                handleChange(nextState);
                return "handled";
            }
        }

        return "not-handled";
    };

    const handleSave = () => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        localStorage.setItem("editorContent", JSON.stringify(rawContentState));
        alert("Saved successfully!");
    };

    return (
        <div className="container">
            <div className="demo">
                <div>
                    <h2>Demo editor by ...</h2>
                </div>
                <div>
                    <button onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
            <div className="text">
                <Editor
                    editorState={editorState}
                    onChange={handleChange}
                    handleBeforeInput={handleBeforeInput}
                    customStyleMap={customStyleMap}
                    placeholder="Enter text here ..."
                />
            </div>
        </div>
    );
};

export default Change;
