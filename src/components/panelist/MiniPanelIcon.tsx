import { PanelistType } from "@/types";
import PanelStatusIcon from "./PanelStatusIcon";

export interface MiniPanelIconProps {
    panelist: PanelistType;
}

const MiniPanelIcon = ({ panelist }: MiniPanelIconProps) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <PanelStatusIcon
                isOccupied={panelist.is_occupied}
                size="sm"
            />

            <span className="text-xs font-medium text-white">
                Panel {panelist.panel_number}
            </span>
        </div>
    );
};

export default MiniPanelIcon;