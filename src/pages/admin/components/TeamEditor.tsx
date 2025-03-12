import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormTeamType } from "@/types";
import FormField from "../../../components/FormField";
import { addTeamMember, deleteTeamMember, getTeamMembers, updateTeamMember } from "@/lib/supabase/actions/team.actions";
import { urlToBase64 } from "@/lib/utils";

// Default team members data structure

const emptyData: FormTeamType = {
  id: "",
  firstName: "",
  lastName: "",
  role: "",
  image: "",
};

const TeamEditor = () => {
  const { toast } = useToast();

  const [teamMembers, setTeamMembers] = useState<FormTeamType[]>([]);
  const [newMember, setNewMember] = useState<FormTeamType>(emptyData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  // Load team members from localStorage if exists
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem("teamMembersData");
    if (savedTeamMembers) {
      try {
        setTeamMembers(JSON.parse(savedTeamMembers));
      } catch (error) {
        console.error("Failed to parse saved team members data:", error);
      }
    };
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

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.role || !newMember.image) {
      toast({
        title: "Error",
        description: "All Fields are required",
        variant: "destructive",
      });
      return;
    }
    const { error } = await addTeamMember(newMember, imageName);

    if (error) {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive"
      });
    }
    else {
      toast({
        title: "Success",
        description: "Team Member has been Added"
      });
    };
    setTeamMembers(prev => [...prev, { ...newMember }]);
    setNewMember(emptyData);
  };

  const handleUpdateMember = async () => {
    if (!editingId) return;

    setTeamMembers(prev =>
      prev.map(member =>
        member.id === editingId ? newMember : member
      )
    );

    const error = await updateTeamMember(newMember, imageName);
    newMember.image = `https://bkbmdjdypixbskuvrkxi.supabase.co/storage/v1/object/public/media/team/${imageName}`;
    setNewMember(emptyData);
    setEditingId(null);

    if (error) {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive"
      });
    }
    else {
      toast({
        title: "Success",
        description: "Team Member has been Updated"
      });
    }

  };


  const handleEditMember = async (member: FormTeamType) => {
    setImageName((member.image.split("/").pop())!);
    member.image = await urlToBase64(member.image);
    setNewMember(member);
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
    }
    else {
      toast({
        title: "Member Couldn't be deleted",
        description: `${member.firstName} ${member.lastName} unable to be deleted`
      });
    }
    if (editingId === member.id) {
      setEditingId(null);
      setNewMember(emptyData);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Team Member" : "Add New Team Member"}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="firstName"
              htmlFor="firstName"
              onChange={setNewMember}
              placeholder="First Name"
              value={newMember.firstName}
              title="First Name"
              type="TEXT"
            />
            <FormField
              id="lastName"
              htmlFor="lastName"
              onChange={setNewMember}
              placeholder="Last Name"
              value={newMember.lastName}
              title="Last Name"
              type="TEXT"
            />
          </div>

          <FormField
            id="image"
            htmlFor="image"
            onChange={setNewMember}
            placeholder="Upload your image"
            value={newMember.role}
            title="Upload your Image"
            type="IMAGE"
            setFileName={setImageName}
          />

          <FormField
            id="role"
            htmlFor="role"
            onChange={setNewMember}
            placeholder="Website Head"
            value={newMember.role}
            title="Role"
            type="TEXT"
          />

          {editingId ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdateMember} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Update Member
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setNewMember(emptyData);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddMember} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Team Member
            </Button>
          )}
        </div>
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