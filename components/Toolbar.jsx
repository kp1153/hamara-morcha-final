// ./components/Toolbar.jsx
"use client";

import React, { useRef } from "react";
import { BiBold, BiItalic } from "react-icons/bi";
import { FaListUl, FaQuoteLeft, FaUnderline, FaImage } from "react-icons/fa";
import { MdFormatStrikethrough, MdUndo } from "react-icons/md";
import { LuHeading2 } from "react-icons/lu";
import { LiaListOlSolid } from "react-icons/lia";
import { IoMdRedo } from "react-icons/io";
import { IoCode } from "react-icons/io5";
import { BsFillPaletteFill } from "react-icons/bs";

export default function Toolbar({ editor }) {
  const imageInputRef = useRef(null);

  if (!editor) {
    return null;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-t-lg border border-gray-300 bg-gray-100 dark:bg-gray-700">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <BiBold className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <BiItalic className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("underline")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <FaUnderline className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("strike")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <MdFormatStrikethrough className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <LuHeading2 className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <FaListUl className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("orderedList")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <LiaListOlSolid className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("blockquote")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <FaQuoteLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setCode().run();
        }}
        className={`p-2 rounded-lg ${
          editor.isActive("code")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
        }`}
      >
        <IoCode className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().undo()}
        className="p-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
      >
        <MdUndo className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().redo()}
        className="p-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
      >
        <IoMdRedo className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          imageInputRef.current.click();
        }}
        className="p-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
      >
        <FaImage className="w-5 h-5" />
      </button>
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      <div className="relative flex items-center">
        <input
          type="color"
          id="colorPicker"
          className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
          onInput={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
          }}
        />
        <label
          htmlFor="colorPicker"
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 cursor-pointer"
        >
          <BsFillPaletteFill className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </label>
      </div>
    </div>
  );
}
