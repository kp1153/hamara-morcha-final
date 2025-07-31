"use client";
import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Palette,
} from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#008000",
  ];

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleColorChange = (color) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const insertLink = () => {
    const url = prompt("Link URL डालें:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  return (
    <div className="border-4 border-dotted border-pink-500 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 p-3 border-b border-gray-200 flex flex-wrap gap-2">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Underline"
        >
          <Underline size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Left Align"
        >
          <AlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Center Align"
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Right Align"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Font Size */}
        <select
          onChange={(e) => execCommand("fontSize", e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          defaultValue="3"
        >
          <option value="1">छोटा</option>
          <option value="3">सामान्य</option>
          <option value="5">बड़ा</option>
          <option value="7">बहुत बड़ा</option>
        </select>

        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Text Color"
          >
            <Palette size={16} />
          </button>

          {showColorPicker && (
            <div className="absolute top-10 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Add Link"
        >
          <Link size={16} />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={updateContent}
        onBlur={updateContent}
        className="min-h-[400px] p-4 text-lg leading-relaxed focus:outline-none"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
      />

      {!value && (
        <div className="absolute top-16 left-4 text-gray-500 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
