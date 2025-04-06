import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RepoType } from "@/types/index";
import { Building } from "lucide-react";

interface CenterCardProps {
    repo: RepoType;
}

const ResourceCard = ({ repo }: CenterCardProps) => {

    const handleRedirect = (url: string) => {
        if (!url) return;
        console.log(window.location.href);
        if (url.startsWith("https://")) {
            window.location.href = url;
        }
        else {
            window.location.href = "https://" + url;
        }
    }

    return (
        
        <Card className="mb-4 overflow-hidden border-0 shadow-md" onClick={() => handleRedirect(repo.url)}>
            <Accordion type="single" className="w-full">
                <AccordionItem value={repo.url} className="border-0">
                    <AccordionTrigger className="cursor-pointer bg-white hover:bg-gray-50 px-6 py-4 text-left">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Building className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-center">{repo.name}</h3>
                                </div>
                            </div>
                        </div>
                    </AccordionTrigger>
                </AccordionItem>
            </Accordion>
        </Card>
    );
};

export default ResourceCard;