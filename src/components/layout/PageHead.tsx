import Head from "next/head";
import { useRouter } from "next/router";

interface PageHeadProps {
    title: string;
    description?: string;
}

const PageHead: React.FC<PageHeadProps> = ({ title, description }) => {
    const router = useRouter();
    const currentUrl = `https://roboticspec.com${router.asPath}`;

    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.png" />
            {description && (
                <>
                    <meta name="description" content={description} />
                    <meta property="og:description" content={description} />
                </>
            )}
            <meta name="keywords" content="PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects" />
            <meta name="author" content="PEC Robotics Society" />
            <meta property="og:title" content={title} />
            <meta property="og:image" content="/logo.png" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <link rel="canonical" href={currentUrl} />
        </Head>
    );
}

export default PageHead;