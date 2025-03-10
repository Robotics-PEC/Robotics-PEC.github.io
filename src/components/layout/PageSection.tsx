import { motion } from "framer-motion";

interface PageSectionProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const PageSection: React.FC<PageSectionProps> = ({ title, subtitle, children }) => {
    return (
        <div className="container mx-auto px-6">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-medium mb-4">{title}</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-16"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageSection;