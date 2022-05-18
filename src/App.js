import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { StateField } from "@codemirror/state";
import { EditorView } from "@codemirror/basic-setup";
import { showTooltip } from "@codemirror/view";

// This is a codemirror trier project

export default function App() {
  const [value, setValue] = React.useState("");
  const editor = React.useRef();

  const cursorTooltipBaseTheme = EditorView.baseTheme({
    ".cm-tooltip.cm-tooltip-cursor": {
      backgroundColor: "#66b",
      color: "white",
      border: "none",
      padding: "2px 7px",
      borderRadius: "4px",
      "& .cm-tooltip-arrow:before": {
        borderTopColor: "#66b"
      },
      "& .cm-tooltip-arrow:after": {
        borderTopColor: "transparent"
      }
    }
  });

  function getCursorTooltips(state) {
    return state.selection.ranges
      .filter((range) => range.empty)
      .map((range) => {
        let text = "sample";
        return {
          pos: range.head,
          above: true,
          strictSide: true,
          arrow: true,
          create: () => {
            let dom = document.createElement("div");
            dom.className = "cm-tooltip-cursor";
            dom.textContent = text;
            return { dom };
          }
        };
      });
  }

  const cursorTooltipField = StateField.define({
    create: getCursorTooltips,

    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      // console.log("here");
      return getCursorTooltips(tr.state);
    },

    provide: (f) => showTooltip.computeN([f], (state) => state.field(f))
  });

  return (
    <div>
      <CodeMirror
        value={value}
        height="200px"
        theme={oneDark}
        extensions={[javascript(), cursorTooltipField, cursorTooltipBaseTheme]}
        onChange={(value, viewUpdate) => {
          setValue(value);
        }}
        ref={editor}
        onClick={(value) => {
          // console.log(editor);
          console.log(
            editor.current.view.observer.selectionRange.focusNode.innerText
          );
        }}
      />
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
        ref={editor}
        onClick={(value) => {
          // console.log(value);
          console.log(
            editor.current.view.observer.selectionRange.focusNode.innerText
          );
        }}
      />
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
      />
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        theme="light"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
      />
    </div>
  );
}
