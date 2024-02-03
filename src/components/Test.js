import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";


const Change = () => {
  const [starCount, setStarCount] = useState(1);
  const [editorState, setEditorState] = useState(() => {
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem("editorContent");
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    // Save content to localStorage whenever editorState changes
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  }, [editorState]);

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };


  const handleBeforeInput = (char) => {
    debugger
    // Custom handling for * and # commands
    if (char == '*') {
      setStarCount(starCount + 1);
    } else {
      setStarCount(1);
    }
    console.log(starCount)
    debugger

    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const currentText = currentBlock.getText();

    if (char === "*" && currentText.trim() === "") {
      if (starCount == 3) {
        const nextState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
        handleChange(nextState);
        return "handled";
      }
      else if (starCount == 2) {
        const nextState = RichUtils.toggleInlineStyle(editorState, "COLOR_RED");
        handleChange(nextState);
        return "handled";
      }
      else {
        const nextState = RichUtils.toggleInlineStyle(editorState, "BOLD");
        handleChange(nextState);
        return "handled";
      }

    }

    // if (char === "#" && currentText.trim() === "") {
    //     const nextState = RichUtils.toggleBlockType(editorState, "header-one");
    //     handleChange(nextState);
    //     return "handled";
    // }

    if (char === "#" && currentText.trim() === "") {
      const nextState = RichUtils.toggleInlineStyle(editorState, "RED_TEXT");
      handleChange(nextState);
      return "handled";
    }
    // if (char === "&" && currentText.trim() === "") {
    //     const nextState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
    //     handleChange(nextState);
    //     return "handled";
    // }

    return "not-handled";
  };

  const handleReturn = (e) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const currentText = currentBlock.getText();
    debugger
    if (currentText.trim() === "**" || currentText.trim() === "* *") {
      // Toggle red color style
      const nextState = RichUtils.toggleInlineStyle(editorState, "COLOR_RED");
      handleChange(nextState);
      return "handled";
    }

    if (currentText.trim() === "&") {
      // Toggle underline style
      const nextState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
      handleChange(nextState);
      return "handled";
    }


    if (currentText.trim() === "#") {
      const nextState = RichUtils.toggleInlineStyle(editorState, "RED_TEXT");
      handleChange(nextState);
      return "handled";
    }

    // Your existing code for other conditions...

  };



  return (
    <div className="container">
      <div className="demo">
        <div>
          <h2>Demo editor by ...</h2>
        </div>
        <div>
          <button
            onClick={() => {
              // Save the content to localStorage manually
              const contentState = editorState.getCurrentContent();
              const rawContentState = convertToRaw(contentState);
              localStorage.setItem("editorContent", JSON.stringify(rawContentState));
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="text">
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleBeforeInput={handleBeforeInput}
          handleReturn={handleReturn}
          placeholder="Enter text here ..."
        />
      </div>

    </div>
  );
};

export default Change;
