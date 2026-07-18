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

  const uploadImageCallBack = async (file: File) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append("image", file);
        
        const uploadUrl = typeof window !== "undefined"
          ? `${window.location.origin}/api/upload`
          : "/api/upload";

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: data,
        });
        
        const result = await response.json();
        
        if (response.ok) {
          resolve(result); // result is { data: { link: '...' } }
        } else {
          reject(result.error);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div className="border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder || "Digite o conteúdo aqui..."}
        wrapperClassName="w-full text-gray-900 dark:text-white"
        editorClassName="min-h-[300px] max-h-[600px] px-4 py-2"
        toolbarClassName="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700"
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'image', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: false },
            previewImage: true,
          }
        }}
      />
    </div>
  );
}
