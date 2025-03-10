import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, User } from "lucide-react";
import { Card } from "@/components/ui/card";

// Default team members data structure

interface Team {
  id: string
  firstName: string
  lastName: string
  role: string
  bio: string
  imageUrl: string
  email: string
  github: string
  linkedin: string
}

const defaultTeamMembers: Team[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    role: "President",
    bio: "John is a final year student with expertise in AI and robotics control systems.",
    imageUrl: "/projects/robot1.jpg",
    email: "john.doe@example.com",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  }
];

const TeamEditor = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<Team[]>(defaultTeamMembers);
  const [newMember, setNewMember] = useState<Team>({
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    bio: "",
    imageUrl: "",
    email: "",
    github: "",
    linkedin: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load team members from localStorage if exists
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem("teamMembersData");
    if (savedTeamMembers) {
      try {
        setTeamMembers(JSON.parse(savedTeamMembers));
      } catch (error) {
        console.error("Failed to parse saved team members data:", error);
      }
    }
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem("teamMembersData", JSON.stringify(teamMembers));
    toast({
      title: "Changes saved",
      description: "Team members have been updated successfully.",
    });
  };

  const handleAddMember = () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.role) {
      toast({
        title: "Error",
        description: "First name, last name, and role are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Date.now().toString();
    setTeamMembers(prev => [...prev, { ...newMember, id: newId }]);
    setNewMember({
      id: "",
      firstName: "",
      lastName: "",
      role: "",
      bio: "",
      imageUrl: "",
      email: "",
      github: "",
      linkedin: ""
    });
  };

  const handleUpdateMember = () => {
    if (!editingId) return;

    setTeamMembers(prev =>
      prev.map(member =>
        member.id === editingId ? newMember : member
      )
    );
    setEditingId(null);
    setNewMember({
      id: "",
      firstName: "",
      lastName: "",
      role: "",
      bio: "",
      imageUrl: "",
      email: "",
      github: "",
      linkedin: ""
    });
  };

  const handleEditMember = (member: Team) => {
    setNewMember(member);
    setEditingId(member.id);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewMember({
        id: "",
        firstName: "",
        lastName: "",
        role: "",
        bio: "",
        imageUrl: "",
        email: "",
        github: "",
        linkedin: ""
      });
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
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newMember.firstName}
                onChange={(e) => setNewMember(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newMember.lastName}
                onChange={(e) => setNewMember(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={newMember.role}
              onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., President, Technical Lead"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={newMember.bio}
              onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Short biography"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              value={newMember.imageUrl}
              onChange={(e) => setNewMember(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="URL to profile image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={newMember.github}
                onChange={(e) => setNewMember(prev => ({ ...prev, github: e.target.value }))}
                placeholder="GitHub profile URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={newMember.linkedin}
                onChange={(e) => setNewMember(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>

          {editingId ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdateMember} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Update Member
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setNewMember({
                    id: "",
                    firstName: "",
                    lastName: "",
                    role: "",
                    bio: "",
                    imageUrl: "",
                    email: "",
                    github: "",
                    linkedin: ""
                  });
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
                      {member.imageUrl && (
                        <img
                          src={member.imageUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-24 h-24 object-cover rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">Bio:</p>
                        <p className="text-sm text-gray-600 mb-2">{member.bio || "No bio provided"}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Email:</p>
                            <p className="text-sm text-gray-600">
                              {member.email ? (
                                <a href={`mailto:${member.email}`} className="text-blue-500 hover:underline">
                                  {member.email}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">GitHub:</p>
                            <p className="text-sm text-gray-600 truncate">
                              {member.github ? (
                                <a href={member.github} target="_blank" className="text-blue-500 hover:underline">
                                  {member.github.replace('https://github.com/', '@')}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">LinkedIn:</p>
                            <p className="text-sm text-gray-600 truncate">
                              {member.linkedin ? (
                                <a href={member.linkedin} target="_blank" className="text-blue-500 hover:underline">
                                  {member.linkedin.replace('https://linkedin.com/in/', '')}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
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
                        onClick={() => handleRemoveMember(member.id)}
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