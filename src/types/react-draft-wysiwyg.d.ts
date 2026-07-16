declare module 'react-draft-wysiwyg' {
  import type { EditorState } from 'draft-js';

  export interface EditorProps {
    editorState: EditorState;
    onEditorStateChange: (editorState: EditorState) => void;
    placeholder?: string;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbarClassName?: string;
    toolbar?: Record<string, unknown>;
  }

  export class Editor extends React.Component<EditorProps> {}
}
