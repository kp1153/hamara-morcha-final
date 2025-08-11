// ./components/TipTap.jsx
"use client";

import "./styles.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Toolbar from "./Toolbar";
import { useEffect } from "react";

export default function TipTap({ onContentChange, content }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "tiptap prose max-w-none flex flex-col px-4 py-3 justify-start min-h-80 border border-gray-300 text-gray-900 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-br-md rounded-bl-md outline-none focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    // सिर्फ़ तभी कंटेंट अपडेट करें जब यह बाहरी सोर्स से बदला हो
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="w-full mt-6">
      <Toolbar editor={editor} />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
}
