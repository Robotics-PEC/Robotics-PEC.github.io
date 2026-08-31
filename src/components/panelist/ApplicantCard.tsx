import { ApplicantType } from "@/types";
import { Badge } from "@/components/ui/badge";

export interface ApplicantCardProps {
    applicant: ApplicantType;
    onClick: (applicant: ApplicantType) => void;
}

const ApplicantCard = ({ applicant, onClick }: ApplicantCardProps) => {
    const isReviewed = applicant.reviewScore !== null && applicant.reviewScore !== undefined;

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
                <Badge className={isReviewed ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}>
                    {isReviewed ? "Reviewed" : "Pending"}
                </Badge>
            </div>
        </div>
    );
};

export default ApplicantCard;
