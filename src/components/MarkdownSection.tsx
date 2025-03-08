import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownSection: React.FC<{ markdown: string }> = ({ markdown }) => {
    return (
        <div className="prose">
            <Markdown remarkPlugins={[remarkGfm]}>
                {markdown}
            </Markdown>
        </div>
    );
};

export default MarkdownSection;
