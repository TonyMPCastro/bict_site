"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    // Inicializa o editor com o HTML recebido
    if (value) {
      const blocksFromHtml = htmlToDraft(value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []); // Run only once to avoid overriding user edits

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    onChange(html);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder || "Digite o conteúdo aqui..."}
        wrapperClassName="w-full"
        editorClassName="min-h-[300px] max-h-[600px] px-4 py-2"
        toolbarClassName="bg-gray-50 border-b border-gray-200"
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
        }}
      />
    </div>
  );
}
