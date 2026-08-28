import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormTeamType } from "@/types";
import { addTeamMember, deleteTeamMember, getTeamMembers, updateTeamMember } from "@/lib/supabase/actions/team.actions";
import { urlToBase64, teamCategoryOptions } from "@/lib/utils";
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    type FormConfig
} from "@/lib/form-builder";

const emptyData: FormTeamType = {
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    image: "",
    category: ""
};

type TeamFormValues = {
    firstName: string;
    lastName: string;
    image: string;
    role: string;
    category: string;
};

const TeamEditor = () => {
    const { toast } = useToast();

    const [teamMembers, setTeamMembers] = useState<FormTeamType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string>("");

    useEffect(() => {
        const fetch = async () => {
            const data = await getTeamMembers();
            setTeamMembers(data);
        };
        fetch();
    }, []);

    const handleSaveAll = () => {
        localStorage.setItem("teamMembersData", JSON.stringify(teamMembers));
        toast({
            title: "Changes saved",
            description: "Team members have been updated successfully.",
        });
    };

    const handleAddMember = async (values: TeamFormValues) => {
        const newMember = { ...emptyData, ...values };
        const { error } = await addTeamMember(newMember, imageName);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Team Member has been Added"
            });
            setTeamMembers(prev => [...prev, newMember]);
        }
    };

    const handleUpdateMember = async (values: TeamFormValues) => {
        if (!editingId) return;

        const updatedMember = { ...emptyData, id: editingId, ...values };

        setTeamMembers(prev =>
            prev.map(member =>
                member.id === editingId ? updatedMember : member
            )
        );

        const error = await updateTeamMember(updatedMember, imageName);
        updatedMember.image = `https://bkbmdjdypixbskuvrkxi.supabase.co/storage/v1/object/public/media/team/${imageName}`;
        setEditingId(null);

        if (error) {
            toast({
                title: error.name,
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Team Member has been Updated"
            });
        }
    };

    const handleEditMember = async (member: FormTeamType) => {
        setImageName((member.image.split("/").pop())!);
        member.image = await urlToBase64(member.image);
        setEditingId(member.id);
    };

    const handleRemoveMember = async (member: FormTeamType) => {
        setTeamMembers(prev => prev.filter(mem => mem.id !== member.id));
        const response = await deleteTeamMember(member);
        if (response.status == 204) {
            toast({
                title: "Member Removed Successfully",
                description: `${member.firstName} ${member.lastName} was successfully deleted`
            });
        } else {
            toast({
                title: "Member Couldn't be deleted",
                description: `${member.firstName} ${member.lastName} unable to be deleted`
            });
        }
        if (editingId === member.id) {
            setEditingId(null);
        }
    };

    const teamFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "firstName",
                        [FieldConfigKey.LABEL]: "First Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "First Name",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "lastName",
                        [FieldConfigKey.LABEL]: "Last Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Last Name",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "image",
                        [FieldConfigKey.LABEL]: "Upload Image",
                        [FieldConfigKey.TYPE]: FieldType.IMAGE,
                        [FieldConfigKey.REQUIRED]: true,
                        onFileNameChange: setImageName,
                    },
                    {
                        [FieldConfigKey.NAME]: "role",
                        [FieldConfigKey.LABEL]: "Role",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Website Head",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "category",
                        [FieldConfigKey.LABEL]: "Category",
                        [FieldConfigKey.TYPE]: FieldType.CATEGORY,
                        [FieldConfigKey.PLACEHOLDER]: "Select category",
                        [FieldConfigKey.OPTIONS]: teamCategoryOptions,
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: editingId ? "Update Member" : "Add Team Member",
            [SubmitConfigKey.LOADING_LABEL]: editingId ? "Updating..." : "Adding...",
        },
    };

    const editingMember = editingId ? teamMembers.find(m => m.id === editingId) : null;
    const defaultValues = editingMember ? {
        firstName: editingMember.firstName,
        lastName: editingMember.lastName,
        image: editingMember.image,
        role: editingMember.role,
        category: editingMember.category,
    } : undefined;

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                    {editingId ? "Edit Team Member" : "Add New Team Member"}
                </h3>
                <DynamicForm
                    config={teamFormConfig}
                    onSubmit={editingId ? handleUpdateMember : handleAddMember}
                    defaultValues={defaultValues}
                    key={editingId || "new"}
                    footer={
                        editingId ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        ) : null
                    }
                />
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Team Members</h3>

                {teamMembers.length === 0 ? (
                    <p className="text-gray-500 italic">No team members added yet.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {teamMembers.map((member) => (
                            <AccordionItem key={member.id} value={member.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between items-center w-full pr-4">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{member.firstName} {member.lastName}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 mr-4">{member.role}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4 space-y-4">
                                        <div className="flex gap-4">
                                            {member.image && (
                                                <img
                                                    src={member.image}
                                                    alt={`${member.firstName} ${member.lastName}`}
                                                    className="w-24 h-24 object-cover rounded-full"
                                                />
                                            )}
                                        </div>

                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditMember(member)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRemoveMember(member)}
                                            >
                                                <Trash className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                <Button onClick={handleSaveAll} className="w-full mt-4">
                    <Save className="h-4 w-4 mr-2" /> Save All Changes
                </Button>
            </div>
        </div>
    );
};

export default TeamEditor;
