import { useEditor, EditorContent, generateJSON } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import BubbleMenu from "./BubbleMenu";
import MenuBar from "./MenuBar";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { Label } from "@/components/ui/label";
import Blob from "@/components/Blob";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    dontWantImage?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder, dontWantImage }) => {

    const [imageData, setImageData] = useState("");

    const hasLoaded = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({ allowBase64: true }),
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
        if (!hasLoaded.current && value !== "") {
            value = value.replace(/<p>\s*(<img[^>]+>)\s*<\/p>/g, '$1');
            value = value.replace(/<img([^>]*)>/g, '<img$1 />');
            hasLoaded.current = true;
        }
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    const addImage = useCallback(() => {
        if (imageData && editor) {
            editor.chain().focus("end").setImage({ src: imageData }).run()
        }
    }, [editor, imageData]);

    return (
        <div className="my-8 animate-fade-in">
            <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border transition-all duration-300">
                <MenuBar editor={editor} />
                {editor && <BubbleMenu editor={editor} />}
                <EditorContent editor={editor} className="animate-slide-up" />
            </div>
            {!dontWantImage && (
                <div className="space-y-2">
                    <Label htmlFor="imageURL">Image (if any)</Label>
                    <Blob setData={setImageData} uploadCallback={addImage} />
                </div>
            )
            }
        </div>
    );
}

export default MarkdownEditor;
