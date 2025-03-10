
import React from "react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
    variant?: "spinner" | "pulse" | "dots";
}

export const Loader = ({
    size = "md",
    text,
    className,
    variant = "spinner",
}: LoaderProps) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const renderLoader = () => {
        switch (variant) {
            case "spinner":
                return (
                    <div
                        className={cn(
                            "relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",
                            sizeClasses[size],
                            className
                        )}
                    />
                );
            case "pulse":
                return (
                    <div
                        className={cn(
                            "relative flex items-center justify-center",
                            sizeClasses[size],
                            className
                        )}
                    >
                        <div className="absolute w-full h-full rounded-full bg-primary/20 animate-ping" />
                        <div className="absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse" />
                        <div className="w-1/2 h-1/2 rounded-full bg-primary" />
                    </div>
                );
            case "dots":
                return (
                    <div className={cn("flex space-x-2", className)}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-full bg-primary",
                                    size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
                                    "animate-bounce",
                                    i === 0 ? "animate-delay-0" : i === 1 ? "animate-delay-150" : "animate-delay-300"
                                )}
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {renderLoader()}
            {text && <p className="text-foreground/80 animate-pulse text-sm md:text-base">{text}</p>}
        </div>
    );
};