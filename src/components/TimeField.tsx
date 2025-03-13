
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TimeSelector from "@/components/TimeSelector";
import {
    format12Hour,
    isTimeValid,
    parseTime,
    TimeValue,
    convertToTotalMinutes,
    isEndTimeAfterStartTime
} from "@/lib/utils";

interface TimeFieldProps {
    startTime: TimeValue | null;
    endTime: TimeValue | null;
    onStartTimeChange: (time: TimeValue | null) => void;
    onEndTimeChange: (time: TimeValue | null) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const TimeField = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    error,
    disabled = false,
    className,
}: TimeFieldProps) => {
    const [startInputValue, setStartInputValue] = useState("");
    const [endInputValue, setEndInputValue] = useState("");
    const [localError, setLocalError] = useState<string | undefined>(error);

    // Update input values when the controlled values change
    useEffect(() => {
        if (startTime) {
            setStartInputValue(format12Hour(startTime));
        }
    }, [startTime]);

    useEffect(() => {
        if (endTime) {
            setEndInputValue(format12Hour(endTime));
        }
    }, [endTime]);

    // Update local error when prop changes
    useEffect(() => {
        setLocalError(error);
    }, [error]);

    // Clear error when both times are set and end time is after start time
    useEffect(() => {
        if (startTime && endTime) {
            if (isEndTimeAfterStartTime(startTime, endTime)) {
                setLocalError(undefined);
            }
        }
    }, [startTime, endTime]);

    const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStartInputValue(value);

        if (value === "") {
            onStartTimeChange(null);
            return;
        }

        const parsedTime = parseTime(value);
        if (parsedTime) {
            onStartTimeChange(parsedTime);

            // Clear errors as the validation will now be handled in the TimeSelector
            setLocalError(undefined);
        }
    };

    const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEndInputValue(value);

        if (value === "") {
            onEndTimeChange(null);
            return;
        }

        const parsedTime = parseTime(value);
        if (parsedTime) {
            onEndTimeChange(parsedTime);

            // Clear errors as the validation will now be handled in the TimeSelector
            setLocalError(undefined);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="start-time">Start Time</Label>
                    <div className="relative flex items-center">
                        <Input
                            id="start-time"
                            value={startInputValue}
                            onChange={handleStartInputChange}
                            placeholder="e.g. 9:00 AM"
                            disabled={disabled}
                            className={cn(
                                "pr-10",
                                localError && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 h-full rounded-l-none"
                                    disabled={disabled}
                                >
                                    <Clock className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <TimeSelector
                                    value={startTime}
                                    onChange={onStartTimeChange}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <Label htmlFor="end-time">End Time</Label>
                    <div className="relative flex items-center">
                        <Input
                            id="end-time"
                            value={endInputValue}
                            onChange={handleEndInputChange}
                            placeholder="e.g. 5:00 PM"
                            disabled={disabled}
                            className={cn(
                                "pr-10",
                                localError && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 h-full rounded-l-none"
                                    disabled={disabled}
                                >
                                    <Clock className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <TimeSelector
                                    value={endTime}
                                    onChange={onEndTimeChange}
                                    isEndTime={true}
                                    startTime={startTime}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {localError && (
                <p className="text-sm text-destructive">{localError}</p>
            )}
        </div>
    );
}
export default TimeField;