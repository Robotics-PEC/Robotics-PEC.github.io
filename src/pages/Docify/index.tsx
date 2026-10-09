import dynamic from "next/dynamic";

const DocifyApp = dynamic(() => import("@/components/Docify/DocifyApp"), {
    ssr: false,
});

export default function DocifyPage() {
    return <DocifyApp />;
}
