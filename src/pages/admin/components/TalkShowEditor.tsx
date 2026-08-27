import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save } from "lucide-react";

import FormField from "../../../components/FormField";
import MarkdownEditor from "../components/MarkdownEditor";

import {
  TechTalkDetails,
  TechTalkDetailsInsert,
  TechTalkDetailsUpdate,
} from "@/types";
import { getTechTalkDetails,updateTechTalkDetails,insertTechTalkDetails } from "@/lib/supabase/actions/tech-talk.actions";

const emptyData: TechTalkDetailsInsert = {
  societyName: "",
  showName: "",
  tagline: "",
  episodeNumber: 0,

  channelId: "",
  channelUrl: "",
  currentVideoId: null,

  challenge: {
    week: 0,
    title: "",
    brief: "",
    deadline: "",
  },

  socials: [],
};

const TechTalkEditor = () => {
  const { toast } = useToast();

  const [details, setDetails] =
    useState<TechTalkDetailsInsert>(emptyData);

  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTechTalkDetails("The Talk Show");

        if (data) {
          setExistingId(data.id);

          setDetails({
            societyName: data.societyName,
            showName: data.showName,
            tagline: data.tagline,
            episodeNumber: data.episodeNumber,

            channelId: data.channelId,
            channelUrl: data.channelUrl,
            currentVideoId: data.currentVideoId,

            challenge: data.challenge,
            socials: data.socials,
          });
        }
      } catch (error) {
        toast({
          title: "Failed to load Tech Talk details",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [toast]);

  const handleChallengeChange = (
    field: keyof TechTalkDetailsInsert["challenge"],
    value: string,
  ) => {
    setDetails((prev) => ({
      ...prev,
      challenge: {
        ...prev.challenge,
        [field]: field === "week" ? Number(value) : value,
      },
    }));
  };

  const handleAddSocial = () => {
    setDetails((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          label: "",
          href: "",
        },
      ],
    }));
  };

  const handleSocialChange = (
    index: number,
    field: "label" | "href",
    value: string,
  ) => {
    setDetails((prev) => ({
      ...prev,
      socials: prev.socials.map((social, i) =>
        i === index
          ? {
              ...social,
              [field]: value,
            }
          : social,
      ),
    }));
  };

  const handleRemoveSocial = (index: number) => {
    setDetails((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (
      !details.societyName.trim() ||
      !details.showName.trim() ||
      !details.tagline.trim() ||
      !details.channelId.trim() ||
      !details.channelUrl.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });

      return;
    }

    if (
      !details.challenge.title.trim() ||
      !details.challenge.brief.trim() ||
      !details.challenge.deadline.trim()
    ) {
      toast({
        title: "Error",
        description: "Please complete all challenge fields",
        variant: "destructive",
      });

      return;
    }

    setSaving(true);

    try {
      if (existingId) {
        const updates: TechTalkDetailsUpdate = details;

        await updateTechTalkDetails(
          details.showName,
          updates,
        );

        toast({
          title: "Success",
          description: "Tech Talk details have been updated",
        });
      } else {
        const data = await insertTechTalkDetails(details);

        setExistingId(data.id);

        toast({
          title: "Success",
          description: "Tech Talk details have been added",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading Tech Talk details...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Show Information */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">
          Show Information
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              id="societyName"
              htmlFor="societyName"
              onChange={setDetails}
              placeholder="Bytes & Banter Society"
              value={details.societyName}
              title="Society Name"
              type="TEXT"
            />

            <FormField
              id="showName"
              htmlFor="showName"
              onChange={setDetails}
              placeholder="The Midnight Stack"
              value={details.showName}
              title="Show Name"
              type="TEXT"
            />
          </div>

          <FormField
            id="tagline"
            htmlFor="tagline"
            onChange={setDetails}
            placeholder="A tech talk show, served late-night style."
            value={details.tagline}
            title="Tagline"
            type="TEXT"
          />

          <FormField
            id="episodeNumber"
            htmlFor="episodeNumber"
            onChange={setDetails}
            placeholder="12"
            value={String(details.episodeNumber)}
            title="Episode Number"
            type="TEXT"
          />
        </div>
      </Card>

      {/* YouTube */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">
          YouTube
        </h3>

        <div className="space-y-4">
          <FormField
            id="channelId"
            htmlFor="channelId"
            onChange={setDetails}
            placeholder="UC..."
            value={details.channelId}
            title="Channel ID"
            type="TEXT"
          />

          <FormField
            id="channelUrl"
            htmlFor="channelUrl"
            onChange={setDetails}
            placeholder="https://www.youtube.com/@..."
            value={details.channelUrl}
            title="Channel URL"
            type="TEXT"
          />

          <FormField
            id="currentVideoId"
            htmlFor="currentVideoId"
            onChange={setDetails}
            placeholder="Leave empty when offline"
            value={details.currentVideoId ?? ""}
            title="Current Video ID"
            type="TEXT"
          />
        </div>
      </Card>

      {/* Weekly Challenge */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">
          Weekly Challenge
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="challengeWeek">
                Week
              </Label>

              <Input
                id="challengeWeek"
                type="number"
                value={details.challenge.week}
                onChange={(e) =>
                  handleChallengeChange(
                    "week",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challengeDeadline">
                Deadline
              </Label>

              <Input
                id="challengeDeadline"
                value={details.challenge.deadline}
                onChange={(e) =>
                  handleChallengeChange(
                    "deadline",
                    e.target.value,
                  )
                }
                placeholder="Sunday, 11:59 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challengeTitle">
              Title
            </Label>

            <Input
              id="challengeTitle"
              value={details.challenge.title}
              onChange={(e) =>
                handleChallengeChange(
                  "title",
                  e.target.value,
                )
              }
              placeholder="Ship a one-file web toy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challengeBrief">
              Brief
            </Label>

            <MarkdownEditor
              value={details.challenge.brief}
              onChange={(value) =>
                handleChallengeChange(
                  "brief",
                  value,
                )
              }
              placeholder="Describe this week's challenge..."
            />
          </div>
        </div>
      </Card>

      {/* Socials */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Socials
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSocial}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Social
          </Button>
        </div>

        {details.socials.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            No social links added.
          </p>
        ) : (
          <div className="space-y-4">
            {details.socials.map((social, index) => (
              <div
                key={index}
                className="flex items-end gap-3"
              >
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`social-label-${index}`}>
                      Label
                    </Label>

                    <Input
                      id={`social-label-${index}`}
                      value={social.label}
                      onChange={(e) =>
                        handleSocialChange(
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Instagram"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`social-href-${index}`}>
                      URL
                    </Label>

                    <Input
                      id={`social-href-${index}`}
                      value={social.href}
                      onChange={(e) =>
                        handleSocialChange(
                          index,
                          "href",
                          e.target.value,
                        )
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    handleRemoveSocial(index)
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        <Save className="mr-2 h-4 w-4" />

        {saving
          ? "Saving..."
          : existingId
            ? "Update Tech Talk Details"
            : "Add Tech Talk Details"}
      </Button>
    </div>
  );
};

export default TechTalkEditor;