import dynamic from "next/dynamic";

const ChaChinApp = dynamic(
    () => import("@/components/Cha-Ching/Cha-ChingApp"),
    {
        ssr: false,
    },
);

export default function ChaChingPage() {
    return <ChaChinApp />;
}
