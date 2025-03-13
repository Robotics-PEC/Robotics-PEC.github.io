
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    TimeValue,
    convertToTotalMinutes,
    isEndTimeAfterStartTime,
    getNextValidTime
} from "@/lib/utils";

interface TimeSelectorProps {
    value: TimeValue | null;
    onChange: (time: TimeValue) => void;
    interval?: number;
    className?: string;
    isEndTime?: boolean;
    startTime?: TimeValue | null;
}

const TimeSelector = ({
    value,
    onChange,
    interval = 1,
    className,
    isEndTime = false,
    startTime = null,
}: TimeSelectorProps) => {
    const [hours, setHours] = useState<number>(value?.hours ?? 12);
    const [minutes, setMinutes] = useState<number>(value?.minutes ?? 0);
    const [period, setPeriod] = useState<"AM" | "PM">(value?.period ?? "AM");
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [isEditingMinutes, setIsEditingMinutes] = useState(false);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const minutesInputRef = useRef<HTMLInputElement>(null);

    // Update internal state when controlled value changes
    useEffect(() => {
        if (value) {
            setHours(value.hours);
            setMinutes(value.minutes);
            setPeriod(value.period);
        }
    }, [value]);

    // When any part changes, call onChange with the full time value
    useEffect(() => {
        const newTimeValue: TimeValue = { hours, minutes, period };

        // For end time, validate against start time
        if (isEndTime && startTime) {
            if (!isEndTimeAfterStartTime(startTime, newTimeValue)) {
                // Set to start time + interval instead
                const adjustedTime = getNextValidTime(startTime, interval);
                setHours(adjustedTime.hours);
                setMinutes(adjustedTime.minutes);
                setPeriod(adjustedTime.period);
                onChange(adjustedTime);
                return;
            }
        }

        onChange(newTimeValue);
    }, [hours, minutes, period, onChange, isEndTime, startTime, interval]);

    const isTimeBeforeStartTime = (endTime: TimeValue, startTime: TimeValue): boolean => {
        return !isEndTimeAfterStartTime(startTime, endTime);
    };

    const incrementHours = () => {
        setHours(prev => {
            const newHours = prev === 12 ? 1 : prev + 1;

            // For end time, check if incrementing would make it valid
            if (isEndTime && startTime) {
                const potentialNewTime: TimeValue = { hours: newHours, minutes, period };
                if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                    // Skip to a valid time
                    const validTime = getNextValidTime(startTime, interval);
                    setMinutes(validTime.minutes);
                    setPeriod(validTime.period);
                    return validTime.hours;
                }
            }

            return newHours;
        });
    };

    const decrementHours = () => {
        setHours(prev => {
            const newHours = prev === 1 ? 12 : prev - 1;

            // For end time, check if decrementing would make it invalid
            if (isEndTime && startTime) {
                const potentialNewTime: TimeValue = { hours: newHours, minutes, period };
                if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                    // Don't allow decrementing to an invalid time
                    return prev;
                }
            }

            return newHours;
        });
    };

    const incrementMinutes = () => {
        const newMinutes = (minutes + interval) % 60;
        if (newMinutes === 0 && minutes > 0) {
            incrementHours();
        }
        setMinutes(newMinutes);
    };

    const decrementMinutes = () => {
        if (isEndTime && startTime) {
            // Check if decrementing would make the time invalid
            const potentialNewMinutes = minutes === 0 ? 60 - interval : minutes - interval;
            const potentialNewHours = minutes === 0 ? (hours === 1 ? 12 : hours - 1) : hours;
            const potentialNewTime: TimeValue = {
                hours: potentialNewHours,
                minutes: potentialNewMinutes,
                period
            };

            if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                // Don't allow decrementing to an invalid time
                return;
            }
        }

        if (minutes === 0) {
            decrementHours();
            setMinutes(60 - interval);
        } else {
            setMinutes(minutes - interval < 0 ? 60 - interval : minutes - interval);
        }
    };

    const togglePeriod = () => {
        setPeriod(prev => {
            const newPeriod: "AM" | "PM" = prev === "AM" ? "PM" : "AM";

            // For end time, check if toggling would make it invalid
            if (isEndTime && startTime) {
                const potentialNewTime: TimeValue = { hours, minutes, period: newPeriod };
                if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                    // Don't allow toggling to an invalid time
                    return prev;
                }
            }

            return newPeriod;
        });
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setHours(0);
            return;
        }

        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 12) {
            // For end time, check if the new hours would make the time invalid
            if (isEndTime && startTime) {
                const potentialNewTime: TimeValue = {
                    hours: parsed === 0 ? 12 : parsed,
                    minutes,
                    period
                };
                if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                    // Don't set invalid hours
                    return;
                }
            }

            setHours(parsed === 0 ? 12 : parsed);
        }
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setMinutes(0);
            return;
        }

        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < 60) {
            // For end time, check if the new minutes would make the time invalid
            if (isEndTime && startTime) {
                const potentialNewTime: TimeValue = { hours, minutes: parsed, period };
                if (isTimeBeforeStartTime(potentialNewTime, startTime)) {
                    // Don't set invalid minutes
                    return;
                }
            }

            setMinutes(parsed);
        }
    };

    const handleHoursBlur = () => {
        setIsEditingHours(false);
        if (hours === 0) setHours(12);
    };

    const handleMinutesBlur = () => {
        setIsEditingMinutes(false);
    };

    return (
        <div className={cn("p-3 flex items-center space-x-3", className)}>
            {/* Hours */}
            <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" onClick={incrementHours}>
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div
                    className="w-10 h-10 flex items-center justify-center font-mono text-lg"
                    onClick={() => {
                        setIsEditingHours(true);
                        setTimeout(() => hoursInputRef.current?.focus(), 0);
                    }}
                >
                    {isEditingHours ? (
                        <Input
                            ref={hoursInputRef}
                            type="text"
                            value={hours === 12 && period === "AM" ? "0" : hours.toString()}
                            onChange={handleHoursChange}
                            onBlur={handleHoursBlur}
                            className="w-10 h-8 p-0 text-center font-mono text-lg"
                            autoFocus
                        />
                    ) : (
                        hours.toString().padStart(2, "0")
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={decrementHours}>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            <div className="text-lg">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" onClick={incrementMinutes}>
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div
                    className="w-10 h-10 flex items-center justify-center font-mono text-lg"
                    onClick={() => {
                        setIsEditingMinutes(true);
                        setTimeout(() => minutesInputRef.current?.focus(), 0);
                    }}
                >
                    {isEditingMinutes ? (
                        <Input
                            ref={minutesInputRef}
                            type="text"
                            value={minutes.toString()}
                            onChange={handleMinutesChange}
                            onBlur={handleMinutesBlur}
                            className="w-10 h-8 p-0 text-center font-mono text-lg"
                            autoFocus
                        />
                    ) : (
                        minutes.toString().padStart(2, "0")
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={decrementMinutes}>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {/* AM/PM */}
            <Button
                variant="outline"
                className="w-16 h-10"
                onClick={togglePeriod}
            >
                {period}
            </Button>
        </div>
    );
}
export default TimeSelector;