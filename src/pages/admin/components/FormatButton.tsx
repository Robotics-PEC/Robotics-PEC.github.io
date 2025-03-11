import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormatButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  isActive?: boolean;
}

const FormatButton = ({ 
  onClick, 
  icon, 
  tooltip, 
  isActive = false 
}: FormatButtonProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "format-button",
              isActive && "active"
            )}
            type="button"
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormatButton;
