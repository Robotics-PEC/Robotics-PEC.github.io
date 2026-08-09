import MarkdownEditor from "../pages/admin/components/MarkdownEditor";

export default {
    title: "Components/MarkdownEditor",
    component: MarkdownEditor,
};

export const Default = () => (
    <MarkdownEditor
        value="Type your markdown here..."
        onChange={(value) => console.log(value)}
        placeholder="Enter markdown text..."
    />
);

