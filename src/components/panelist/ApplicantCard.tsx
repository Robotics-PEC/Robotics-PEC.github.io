import { ApplicantType } from "@/types";
import { Badge } from "@/components/ui/badge";

export interface ApplicantCardProps {
    applicant: ApplicantType;
    onClick: (applicant: ApplicantType) => void;
}

const ApplicantCard = ({ applicant, onClick }: ApplicantCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-500 hover:bg-green-600 text-white';
            case 'rejected': return 'bg-red-500 hover:bg-red-600 text-white';
            default: return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        }
    };

    return (
        <div 
            onClick={() => onClick(applicant)}
            className={`flex items-center justify-between p-4 border rounded-lg mb-2 cursor-pointer hover:bg-accent transition-colors ${applicant.isWalkin ? 'bg-gray-100' : 'bg-white'}`}
        >
            <div>
                <h3 className="font-medium text-lg flex items-center gap-2">
                    {applicant.name}
                    {applicant.isWalkin && <Badge variant="outline" className="text-xs">Walk-In</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground">SID: {applicant.sid}</p>
            </div>
            <div>
                <Badge className={getStatusColor(applicant.status)}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </Badge>
            </div>
        </div>
    );
};

export default ApplicantCard;
