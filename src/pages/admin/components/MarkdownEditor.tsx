import { useState, useEffect } from "react";
// import SimpleMDE from "react-simplemde-editor";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "easymde/dist/easymde.min.css";
import { Card } from "@/components/ui/card";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

const MarkdownEditor = ({ value, onChange, placeholder = "Write content using Markdown...", minHeight = "200px" }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("write");
  const [mounted, setMounted] = useState(false);

  // This is needed because SimpleMDE is client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const options = {
    autofocus: false,
    spellChecker: false,
    placeholder: placeholder,
    status: ["lines", "words"],
    minHeight: minHeight,
  };

  if (!mounted) {
    return <div className="h-[200px] border rounded-md p-4 bg-gray-50">Loading editor...</div>;
  }

  return (
    <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="write" className="mt-0">
        <SimpleMDE value={value} onChange={onChange} options={options} />
      </TabsContent>

      <TabsContent value="preview" className="mt-0">
        <Card className="p-4 min-h-[200px] prose max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">No content to preview</p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MarkdownEditor;
