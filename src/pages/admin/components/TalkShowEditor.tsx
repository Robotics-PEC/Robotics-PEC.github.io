import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";
import {
    TechTalkDetailsInsert,
} from "@/types";
import { getTechTalkDetails, updateTechTalkDetails, insertTechTalkDetails } from "@/lib/supabase/actions/tech-talk.actions";
import {
    DynamicForm,
    FormConfigKey,
    SectionKey,
    FieldConfigKey,
    FieldType,
    SubmitConfigKey,
    ValidationKey,
    InputMode,
    type FormConfig
} from "@/lib/form-builder";

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

type TechTalkFormValues = {
    societyName: string;
    showName: string;
    tagline: string;
    episodeNumber: string;
    channelId: string;
    channelUrl: string;
    currentVideoId: string;
};

type ChallengeFormValues = {
    week: string;
    title: string;
    brief: string;
    deadline: string;
};

type SocialFormValues = {
    label: string;
    href: string;
};

const TalkShowEditor = () => {
    const { toast } = useToast();

    const [details, setDetails] = useState<TechTalkDetailsInsert>(emptyData);
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
                    description: error instanceof Error ? error.message : "Something went wrong",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [toast]);

    const handleFormSubmit = async (values: TechTalkFormValues) => {
        setSaving(true);

        try {
            const updatedDetails = {
                ...details,
                societyName: values.societyName,
                showName: values.showName,
                tagline: values.tagline,
                episodeNumber: Number(values.episodeNumber),
                channelId: values.channelId,
                channelUrl: values.channelUrl,
                currentVideoId: values.currentVideoId || null,
            };

            if (existingId) {
                await updateTechTalkDetails(details.showName, updatedDetails);
                toast({
                    title: "Success",
                    description: "Tech Talk details have been updated",
                });
            } else {
                const data = await insertTechTalkDetails(updatedDetails);
                setExistingId(data.id);
                toast({
                    title: "Success",
                    description: "Tech Talk details have been added",
                });
            }

            setDetails(updatedDetails);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChallengeSubmit = (values: ChallengeFormValues) => {
        setDetails(prev => ({
            ...prev,
            challenge: {
                week: Number(values.week),
                title: values.title,
                brief: values.brief,
                deadline: values.deadline,
            },
        }));

        toast({
            title: "Success",
            description: "Challenge updated",
        });
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

    const handleSocialSubmit = (index: number) => (values: SocialFormValues) => {
        setDetails((prev) => ({
            ...prev,
            socials: prev.socials.map((social, i) =>
                i === index ? values : social
            ),
        }));

        toast({
            title: "Success",
            description: "Social link updated",
        });
    };

    const handleRemoveSocial = (index: number) => {
        setDetails((prev) => ({
            ...prev,
            socials: prev.socials.filter((_, i) => i !== index),
        }));

        toast({
            title: "Success",
            description: "Social link removed",
        });
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

    const techTalkFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.TITLE]: "Show Information",
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "societyName",
                        [FieldConfigKey.LABEL]: "Society Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Bytes & Banter Society",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "showName",
                        [FieldConfigKey.LABEL]: "Show Name",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "The Midnight Stack",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "tagline",
                        [FieldConfigKey.LABEL]: "Tagline",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "A tech talk show, served late-night style.",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "episodeNumber",
                        [FieldConfigKey.LABEL]: "Episode Number",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "12",
                        [FieldConfigKey.REQUIRED]: true,
                        [FieldConfigKey.INPUT_MODE]: InputMode.NUMERIC,
                        [FieldConfigKey.VALIDATION]: {
                            [ValidationKey.PATTERN]: /^\d+$/,
                            [ValidationKey.MESSAGE]: "Episode number must be a valid number",
                        },
                    },
                ],
            },
            {
                [SectionKey.TITLE]: "YouTube",
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "channelId",
                        [FieldConfigKey.LABEL]: "Channel ID",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "UC...",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "channelUrl",
                        [FieldConfigKey.LABEL]: "Channel URL",
                        [FieldConfigKey.TYPE]: FieldType.URL,
                        [FieldConfigKey.PLACEHOLDER]: "https://www.youtube.com/@...",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "currentVideoId",
                        [FieldConfigKey.LABEL]: "Current Video ID",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Leave empty when offline",
                        [FieldConfigKey.REQUIRED]: false,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: existingId ? "Update Tech Talk Details" : "Add Tech Talk Details",
            [SubmitConfigKey.LOADING_LABEL]: "Saving...",
        },
    };

    const challengeFormConfig: FormConfig = {
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "week",
                        [FieldConfigKey.LABEL]: "Week",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "1",
                        [FieldConfigKey.REQUIRED]: true,
                        [FieldConfigKey.INPUT_MODE]: InputMode.NUMERIC,
                        [FieldConfigKey.VALIDATION]: {
                            [ValidationKey.PATTERN]: /^\d+$/,
                            [ValidationKey.MESSAGE]: "Week must be a valid number",
                        },
                    },
                    {
                        [FieldConfigKey.NAME]: "deadline",
                        [FieldConfigKey.LABEL]: "Deadline",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Sunday, 11:59 PM",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
            {
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "title",
                        [FieldConfigKey.LABEL]: "Title",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Ship a one-file web toy",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "brief",
                        [FieldConfigKey.LABEL]: "Brief",
                        [FieldConfigKey.TYPE]: FieldType.MARKDOWN,
                        [FieldConfigKey.PLACEHOLDER]: "Describe this week's challenge...",
                        [FieldConfigKey.REQUIRED]: true,
                        dontWantImage: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: "Update Challenge",
        },
    };

    const socialFormConfig = (index: number): FormConfig => ({
        [FormConfigKey.SECTIONS]: [
            {
                [SectionKey.COLUMNS]: 2,
                [SectionKey.FIELDS]: [
                    {
                        [FieldConfigKey.NAME]: "label",
                        [FieldConfigKey.LABEL]: "Label",
                        [FieldConfigKey.TYPE]: FieldType.TEXT,
                        [FieldConfigKey.PLACEHOLDER]: "Instagram",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                    {
                        [FieldConfigKey.NAME]: "href",
                        [FieldConfigKey.LABEL]: "URL",
                        [FieldConfigKey.TYPE]: FieldType.URL,
                        [FieldConfigKey.PLACEHOLDER]: "https://instagram.com/...",
                        [FieldConfigKey.REQUIRED]: true,
                    },
                ],
            },
        ],
        [FormConfigKey.SUBMIT]: {
            [SubmitConfigKey.LABEL]: "Update",
        },
    });

    const defaultValues = {
        societyName: details.societyName,
        showName: details.showName,
        tagline: details.tagline,
        episodeNumber: String(details.episodeNumber),
        channelId: details.channelId,
        channelUrl: details.channelUrl,
        currentVideoId: details.currentVideoId || "",
    };

    const challengeDefaultValues = {
        week: String(details.challenge.week),
        title: details.challenge.title,
        brief: details.challenge.brief,
        deadline: details.challenge.deadline,
    };

    return (
        <div className="space-y-8">
            <DynamicForm
                config={techTalkFormConfig}
                onSubmit={handleFormSubmit}
                defaultValues={defaultValues}
                disabled={saving}
            />

            {/* Weekly Challenge */}
            <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium">Weekly Challenge</h3>
                <DynamicForm
                    config={challengeFormConfig}
                    onSubmit={handleChallengeSubmit}
                    defaultValues={challengeDefaultValues}
                />
            </Card>

            {/* Socials */}
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Socials</h3>
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
                            <Card key={index} className="p-4">
                                <div className="space-y-4">
                                    <DynamicForm
                                        config={socialFormConfig(index)}
                                        onSubmit={handleSocialSubmit(index)}
                                        defaultValues={{
                                            label: social.label,
                                            href: social.href,
                                        }}
                                        key={`${social.label}-${social.href}`}
                                        footer={
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveSocial(index)}
                                                className="w-full"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Remove Social Link
                                            </Button>
                                        }
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TalkShowEditor;
