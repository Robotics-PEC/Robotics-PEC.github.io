import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$*&%";

export function useScrambleText(targetText: string, delayMs = 0, durationMs = 1500) {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

useEffect(() => {
        setIsComplete(false);
        setDisplayText("");
        let startTime: number | null = null;
        let animationFrameId = 0;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / durationMs, 1);

            if (progress === 1) {
                setDisplayText(targetText);
                setIsComplete(true);
                return;
            }

            // Number of characters to reveal based on progress
            const revealCount = Math.floor(targetText.length * progress);
            
            let scrambled = "";
            for (let i = 0; i < targetText.length; i++) {
                if (i < revealCount) {
                    scrambled += targetText[i];
                } else if (targetText[i] === " ") {
                    scrambled += " ";
                } else {
                    scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(scrambled);
            animationFrameId = requestAnimationFrame(animate);
        };

        const timeoutId = setTimeout(() => {
            animationFrameId = requestAnimationFrame(animate);
        }, delayMs);

        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(animationFrameId);
        };
    }, [targetText, delayMs, durationMs]);

    return { displayText, isComplete };
}
