import { PanelistType } from "@/types";
import PanelStatusIcon from "./PanelStatusIcon";

export interface MiniPanelIconProps {
    panelist: PanelistType;
}

const MiniPanelIcon = ({ panelist }: MiniPanelIconProps) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <PanelStatusIcon
                isOccupied={panelist.isOccupied}
                size="sm"
            />

            <span className="text-xs font-medium text-gray-700 text-center px-1">
                {panelist.name} (P{panelist.panelNumber})
            </span>
        </div>
    );
};

export default MiniPanelIcon;