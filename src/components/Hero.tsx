import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getImagesFromFolder } from "@/lib/supabase/actions/storage.actions";
import { Loader } from "./layout/Loader";
import { getHeroData } from "@/lib/supabase/actions/hero.actions";
import { HeroType } from "@/types";

const emptyData = {
    heading: "",
    description: ""
}

const Hero: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState<HeroType>(emptyData);

    useEffect(() => {
        const fetch = async () => {
            const hero: HeroType | null = await getHeroData();
            const publicUrls = await getImagesFromFolder("hero");
            setImages(publicUrls);
            setHeroData(hero);
            setLoading(false);
        }
        fetch();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!images || images.length === 0) return;
            setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <Loader isLoading={loading}>
            <section className="relative w-full h-screen overflow-hidden">
                {/* Full-width image slider */}
                <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${images[currentIndex]})`,
                                    filter: "brightness(0.5)"
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Overlay content */}
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white">
                                {heroData.heading}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                                {heroData.description}
                            </p>
                            <div className="mt-12">
                                <Button
                                    className="px-8 py-6 text-lg rounded-full  text-white transition-all duration-300 ease-in-out hover:scale-105 backdrop-blur-sm bg-opacity-80"
                                    onClick={handleClick}
                                >
                                    Explore Our Projects <ChevronRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation dots */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-white scale-110 w-4"
                                    : "bg-white/50 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </Loader>
    );
};

export default Hero;