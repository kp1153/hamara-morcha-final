"use client";

import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useEffect } from "react";

export default function TipTap({ onChange, content, description }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "अपनी कहानी लिखें...",
      }),
    ],
    content: isMounted ? content || description || "" : "",
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[400px] p-4 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 rounded-b-lg focus:outline-none prose",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Add this to prevent SSR mismatch
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !isMounted) return;

    const currentContent = editor.getHTML();
    const newContent = content || description || "";

    if (currentContent !== newContent) {
      editor.commands.setContent(newContent);
    }
  }, [editor, content, description, isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full min-h-[400px] p-4 bg-white dark:bg-gray-800 border border-gray-300 rounded-b-lg">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
