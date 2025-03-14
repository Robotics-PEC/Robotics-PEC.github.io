import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import BubbleMenu from "./BubbleMenu";
import MenuBar from "./MenuBar";
import { useEffect } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder }) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
  return (
    <div className="my-8 animate-fade-in">
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border transition-all duration-300">
        <MenuBar editor={editor} />
        {editor && <BubbleMenu editor={editor} />}
        <EditorContent editor={editor} className="animate-slide-up" />
      </div>
    </div>
  );
}

export default MarkdownEditor;