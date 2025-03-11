import { BubbleMenu as TiptapBubbleMenu, BubbleMenuProps as TiptapBubbleMenuProps } from '@tiptap/react';
import FormatButton from './FormatButton';
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote
} from 'lucide-react';

interface BubbleMenuProps extends Omit<TiptapBubbleMenuProps, 'children'> {
  children?: React.ReactNode;
}

const BubbleMenu = ({ editor, ...props }: BubbleMenuProps) => {
  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 200,
        animation: 'fade',
        offset: [0, 10],
      }}
      className="editor-bubble-menu"
      {...props}
    >
      <FormatButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="h-4 w-4" />}
        tooltip="Bold (⌘+B)"
        isActive={editor.isActive('bold')}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="h-4 w-4" />}
        tooltip="Italic (⌘+I)"
        isActive={editor.isActive('italic')}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Code className="h-4 w-4" />}
        tooltip="Code (⌘+E)"
        isActive={editor.isActive('code')}
      />
      <div className="h-4 w-[1px] bg-border mx-1" />
      <FormatButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={<Heading1 className="h-4 w-4" />}
        tooltip="Heading 1 (⌘+Alt+1)"
        isActive={editor.isActive('heading', { level: 1 })}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 className="h-4 w-4" />}
        tooltip="Heading 2 (⌘+Alt+2)"
        isActive={editor.isActive('heading', { level: 2 })}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        icon={<Heading3 className="h-4 w-4" />}
        tooltip="Heading 3 (⌘+Alt+3)"
        isActive={editor.isActive('heading', { level: 3 })}
      />
      <div className="h-4 w-[1px] bg-border mx-1" />
      <FormatButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={<List className="h-4 w-4" />}
        tooltip="Bullet List (⌘+Shift+8)"
        isActive={editor.isActive('bulletList')}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered className="h-4 w-4" />}
        tooltip="Ordered List (⌘+Shift+7)"
        isActive={editor.isActive('orderedList')}
      />
      <FormatButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote className="h-4 w-4" />}
        tooltip="Blockquote (⌘+Shift+B)"
        isActive={editor.isActive('blockquote')}
      />
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
