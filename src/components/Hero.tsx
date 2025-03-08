import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-dark-gray">
                        PEC Robotics Society
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                        Pushing the boundaries of innovation through robotics and automation
                    </p>
                    <Button
                        className="mt-8 px-8 py-6 text-lg rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-105"
                        onClick={handleClick}
                    >
                        Explore Our Projects <ChevronRight className="ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;