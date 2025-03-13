import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
}

const DatePicker = ({ date, setDate, className, placeholder = "Select date" }: DatePickerProps) => {
    const [inputValue, setInputValue] = React.useState<string>(
        date ? format(date, "dd/MM/yyyy") : ""
    );
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Update input value when date changes
    React.useEffect(() => {
        if (date) {
            setInputValue(format(date, "dd/MM/yyyy"));
        }
    }, [date]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setError(null);

        // Clear date if input is empty
        if (!value.trim()) {
            setDate(undefined);
            return;
        }

        // Try to parse date from input
        if (value.length === 10) {
            try {
                const parsedDate = parse(value, "dd/MM/yyyy", new Date());

                // Check if valid date (not an invalid date like 31/02/2023)
                if (format(parsedDate, "dd/MM/yyyy") === value) {
                    setDate(parsedDate);
                    setError(null);
                } else {
                    setError("Invalid date");
                }
            } catch (err) {
                setError("Invalid format (DD/MM/YYYY)");
            }
        }
    };

    // Handle calendar selection
    const handleCalendarSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setInputValue(format(selectedDate, "dd/MM/yyyy"));
        } else {
            setInputValue("");
        }
        setIsOpen(false);
        setError(null);
    };

    return (
        <div className={cn("relative", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleInputChange}
                            className={cn(
                                "pl-3 pr-10 py-2",
                                error ? "border-red-500 focus-visible:ring-red-500" : ""
                            )}
                        />
                        {error && (
                            <div className="text-red-500 text-xs mt-1 absolute">{error}</div>
                        )}
                    </div>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "px-3 h-10 w-10 flex items-center justify-center"
                            )}
                            onClick={() => setIsOpen(true)}
                        >
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleCalendarSelect}
                        initialFocus
                        className={cn("p-3 pointer-events-auto border rounded-md shadow-md")}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePicker;