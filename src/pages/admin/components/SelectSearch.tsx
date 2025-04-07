import React, { useState, useRef, useEffect, SetStateAction } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectSearchProps {
    options: SelectOption[];
    value: string;
    onChange: ((value: SetStateAction<string>) => void)
    placeholder?: string;
    className?: string;
}

const SelectSearch = ({
    options,
    value,
    onChange,
    placeholder = "Select a category",
    className,
}: SelectSearchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = options?.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const selectedOption = options?.find((option) => option.value === value);

    // Handle option selection
    const handleSelect = (option: SelectOption) => {
        onChange(option.value);
        setSearchTerm("");
        setIsOpen(false);
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm("");
        }
    };

    // Handle keyboard navigation and accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        } else if (e.key === "Enter" && !isOpen) {
            setIsOpen(true);
        }
    };

    return (
        <div
            ref={selectRef}
            className={cn(
                "relative font-sans w-full max-w-sm",
                className
            )}
            onKeyDown={handleKeyDown}
        >
            {/* Select header */}
            <div
                className={cn(
                    "select-trigger flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-xl bg-white border border-[#eeeeee] cursor-pointer transition-all duration-300 ease-out",
                    "hover:border-[#dddddd] focus:outline-none",
                    "shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                    isOpen && "border-[#dddddd] shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                )}
                onClick={toggleDropdown}
                tabIndex={0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={cn("truncate", !selectedOption && "text-[#8E9196]")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="text-[#8E9196]">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {/* Dropdown */}
            <div
                className={cn(
                    "select-dropdown absolute z-50 w-full mt-1 overflow-hidden bg-white rounded-xl border border-[#eeeeee] shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
                    "transition-all duration-300 ease-out origin-top",
                    isOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                )}
            >
                {/* Search input */}
                <div className="p-2 border-b border-[#f3f3f3]">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8E9196]">
                            <Search size={16} />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full py-2 pl-10 pr-4 text-sm bg-[#f9f9f9] border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e5e5e5] placeholder-[#8E9196]"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Options list */}
                <div
                    ref={optionsRef}
                    className="max-h-60 overflow-y-auto overscroll-contain select-options"
                    role="listbox"
                >
                    {filteredOptions?.length > 0 ? (
                        filteredOptions?.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "py-2.5 px-4 cursor-pointer text-sm transition-colors duration-150 hover:bg-[#f9f9f9]",
                                    option.value === value && "bg-[#f5f5f5] font-medium"
                                )}
                                onClick={() => handleSelect(option)}
                                role="option"
                                aria-selected={option.value === value}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="py-3 px-4 text-sm text-[#8E9196] text-center">
                            No options found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectSearch;