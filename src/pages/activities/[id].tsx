import { Loader } from '@/components/layout/Loader';
import PageHead from '@/components/layout/PageHead';
import PageLayout from '@/components/layout/PageLayout';
import { getMarkdownFile } from '@/lib/supabase/actions/storage.actions';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';

const ActivityPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [eventData, setEventData] = useState<string | null>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (router.isReady) {
                const file = await getMarkdownFile(`${id}.md`, "activities");
                if (!file) return;
                setEventData(file);
                setLoading(false);
            }
        };

        fetch();
    }, [router.isReady, router.query]);

    return (
        <PageLayout>
            <Loader isLoading={loading}>
                <PageHead
                    title="Robotics Society | Punjab Engineering College"
                    description="Join us in our robotics journey. Explore our activities and be part of our community."
                />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={id as string}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-20 pb-10 px-4 sm:px-6"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="container mx-auto">
                                <div className="max-w-3xl mx-auto mb-12 px-4 sm:px-0">

                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-4" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed mb-2" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-blue-600 underline" {...props} />,
                                        }}>
                                        {`${eventData}`}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Loader >
        </PageLayout>
    )
}

export default ActivityPage;