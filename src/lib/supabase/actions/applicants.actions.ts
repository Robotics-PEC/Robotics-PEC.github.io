import { apiFetch, client } from "../supabase";
import { ApplicantType } from "@/types";

const APPLICANTS_API = "/api/applicants";

const mapApplicant = (
    item: any
): ApplicantType => {
    const response =
        item.applicant_response;

    const responseData =
        Array.isArray(response)
            ? response[0]
            : response;

    return {
        ...item,

        userId:
            item.userId,

        status:
            item.status?.toLowerCase(),

        createdAt:
            item.createdAt ||
            item.created_at,

        gender:
            item.gender ?? null,

        isHostellers:
            item.isHostellers ?? null,

        branch:
            responseData?.branch,

        responses:
            responseData?.responses,
    } as ApplicantType;
};

export type CreateApplicantResult =
    | {
          success: true;
          applicant: ApplicantType;
      }
    | {
          success: false;
          reason: "duplicate" | "error";
      };

export const fetchApplicants =
    async (): Promise<
        ApplicantType[]
    > => {
        const response =
            await apiFetch(
                APPLICANTS_API
            );

        if (!response.ok) {
            console.error(
                "Error fetching applicants:",
                await response.text()
            );

            return [];
        }

        return response.json();
    };

export const fetchApplicantWithResponses =
    async (
        id: string
    ): Promise<
        ApplicantType | null
    > => {
        const response =
            await fetch(
                `${APPLICANTS_API}?id=${encodeURIComponent(
                    id
                )}`
            );

        if (!response.ok) {
            return null;
        }

        return response.json();
    };

export const fetchMyApplication =
    async (): Promise<
        ApplicantType | null
    > => {
        const response =
            await fetch(
                `${APPLICANTS_API}?myApplication=true`
            );

        if (!response.ok) {
            return null;
        }

        return response.json();
    };

export const createWalkIn =
    async (
        name: string,
        sid: string,
        phone: string
    ): Promise<
        ApplicantType | null
    > => {
        const response =
            await apiFetch(
                APPLICANTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "walk-in",

                            name,

                            sid,

                            phone,
                        }),
                }
            );

        if (!response.ok) {
            return null;
        }

        return response.json();
    };

export const createApplicant =
    async (
        name: string,
        sid: string,
        phone: string,
        branch: string,
        gender:
            | "male"
            | "female",
        isHostellers: boolean,
        responses: Record<
            string,
            string
        >
    ): Promise<
        CreateApplicantResult
    > => {
        const response =
            await apiFetch(
                APPLICANTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "application",

                            name,

                            sid,

                            phone,

                            branch,

                            gender,

                            isHostellers,

                            responses,
                        }),
                }
            );

        if (!response.ok) {
            return {
                success: false,
                reason: "error",
            };
        }

        return response.json();
    };

export const updateApplicantPersonalInfo =
    async (
        applicantId: string,
        name: string,
        phone: string,
        sid: string,
        branch: string,
        gender:
            | "male"
            | "female",
        isHostellers: boolean
    ): Promise<
        | {
              success: true;
              applicant: ApplicantType;
          }
        | {
              success: false;
              reason:
                  | "error"
                  | "not_found";
          }
    > => {
        const response =
            await apiFetch(
                APPLICANTS_API,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "personal-info",

                            applicantId,

                            name,

                            phone,

                            sid,

                            branch,

                            gender,

                            isHostellers,
                        }),
                }
            );

        if (!response.ok) {
            return {
                success: false,
                reason: "error",
            };
        }

        return response.json();
    };

export const updateApplicant =
    async (
        applicantId: string,
        data: {
            name: string;
            sid: string;
            phone: string;
            remarks?: string;
            branch?: string;
            gender?:
                | "male"
                | "female";
            isHostellers?: boolean;
            responses?: Record<
                string,
                string
            >;
        }
    ): Promise<
        ApplicantType | null
    > => {
        const response =
            await apiFetch(
                APPLICANTS_API,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "update",

                            applicantId,

                            data,
                        }),
                }
            );

        if (!response.ok) {
            return null;
        }

        return response.json();
    };

export const updateApplicantDecision =
    async (
        applicantId: string,
        status:
            | "accepted"
            | "rejected",
        remarks: string,
        reviewedBy: string
    ): Promise<boolean> => {
        const response =
            await apiFetch(
                APPLICANTS_API,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "decision",

                            applicantId,

                            status,

                            remarks,

                            reviewedBy,
                        }),
                }
            );

        if (!response.ok) {
            return false;
        }

        return response.json();
    };

export const resetApplicantDecision =
    async (
        applicantId: string
    ): Promise<boolean> => {
        const response =
            await fetch(
                APPLICANTS_API,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            action:
                                "reset-decision",

                            applicantId,
                        }),
                }
            );

        if (!response.ok) {
            return false;
        }

        return response.json();
    };

/*
 * ---------------------------------------------------------
 * Realtime applicant updates
 * ---------------------------------------------------------
 *
 * THIS IS INTENTIONALLY LEFT AS-IS.
 * ---------------------------------------------------------
 */

export const subscribeToApplicantUpdates =
    (
        onUpdate: (
            applicant: ApplicantType
        ) => void,

        onInsert: (
            applicant: ApplicantType
        ) => void
    ) => {
        const channel =
            client
                .channel(
                    `applicants-status-${Date.now()}`
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "UPDATE",

                        schema:
                            "public",

                        table:
                            "applicants",
                    },
                    (
                        payload: any
                    ) => {
                        onUpdate(
                            mapApplicant(
                                payload.new
                            )
                        );
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "INSERT",

                        schema:
                            "public",

                        table:
                            "applicants",
                    },
                    (
                        payload: any
                    ) => {
                        onInsert(
                            mapApplicant(
                                payload.new
                            )
                        );
                    }
                )
                .subscribe();

        return () => {
            client.removeChannel(
                channel
            );
        };
    };