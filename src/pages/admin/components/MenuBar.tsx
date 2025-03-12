import React from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    FileText,
    Eye
} from 'lucide-react';
import FormatButton from './FormatButton';
import { Separator } from '@/components/ui/separator';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return null;

    return (
        <div className="flex items-center gap-1 p-2 overflow-x-auto bg-card border-b border-border">
            <FormatButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={<Undo className="h-4 w-4" />}
                tooltip="Undo (ctrl+Z)"
            />
            <FormatButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={<Redo className="h-4 w-4" />}
                tooltip="Redo (ctrl+Shift+Z)"
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <FormatButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                icon={<Bold className="h-4 w-4" />}
                tooltip="Bold (ctrl+B)"
                isActive={editor.isActive('bold')}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                icon={<Italic className="h-4 w-4" />}
                tooltip="Italic (ctrl+I)"
                isActive={editor.isActive('italic')}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                icon={<Code className="h-4 w-4" />}
                tooltip="Code (ctrl+E)"
                isActive={editor.isActive('code')}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                icon={<Heading1 className="h-4 w-4" />}
                tooltip="Heading 1 (ctrl+Alt+1)"
                isActive={editor.isActive('heading', { level: 1 })}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                icon={<Heading2 className="h-4 w-4" />}
                tooltip="Heading 2 (ctrl+Alt+2)"
                isActive={editor.isActive('heading', { level: 2 })}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                icon={<Heading3 className="h-4 w-4" />}
                tooltip="Heading 3 (ctrl+Alt+3)"
                isActive={editor.isActive('heading', { level: 3 })}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            <FormatButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                icon={<List className="h-4 w-4" />}
                tooltip="Bullet List (ctrl+Shift+8)"
                isActive={editor.isActive('bulletList')}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                icon={<ListOrdered className="h-4 w-4" />}
                tooltip="Ordered List (ctrl+Shift+7)"
                isActive={editor.isActive('orderedList')}
            />
            <FormatButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                icon={<Quote className="h-4 w-4" />}
                tooltip="Blockquote (ctrl+Shift+B)"
                isActive={editor.isActive('blockquote')}
            />

            <div className="flex-1" />
        </div>
    );
};

export default MenuBar;
