"use server";

import type {
    InterviewerType,
} from "@/types";

/*
 * ---------------------------------------------------------
 * Types
 * ---------------------------------------------------------
 */

export type CreateInterviewerResult =
    | {
          success: true;
          applicant: InterviewerType;
      }
    | {
          success: false;
          reason:
              | "duplicate"
              | "error";
      };

export type UpdateInterviewerResult =
    | {
          success: true;
          applicant: InterviewerType;
      }
    | {
          success: false;
          reason:
              | "not_found"
              | "error";
      };

/*
 * ---------------------------------------------------------
 * Apps Script API helper
 * ---------------------------------------------------------
 */

const appsScriptRequest =
    async (
        body: Record<
            string,
            unknown
        >
    ): Promise<any> => {
        const isServer =
            typeof window ===
            "undefined";

        if (isServer) {
            const appsScriptUrl =
                process.env
                    .INT_GOOGLE_APPS_SCRIPT_URL;

            if (
                !appsScriptUrl
            ) {
                throw new Error(
                    "INT_GOOGLE_APPS_SCRIPT_URL is not configured."
                );
            }

            const response =
                await fetch(
                    appsScriptUrl,
                    {
                        method: "POST",
                        redirect:
                            "follow",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            body
                        ),
                    }
                );

            if (
                !response.ok
            ) {
                throw new Error(
                    `Google Apps Script returned ${response.status}`
                );
            }

            return response.json();
        } else {
            const response =
                await fetch(
                    "/api/interviewer",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            body
                        ),
                    }
                );

            if (
                !response.ok
            ) {
                const errorData =
                    await response
                        .json()
                        .catch(
                            () =>
                                (
                                    {}
                                )
                        );

                throw new Error(
                    errorData.error ||
                        `API route returned status ${response.status}`
                );
            }

            return response.json();
        }
    };

/*
 * ---------------------------------------------------------
 * Map Apps Script applicant
 * ---------------------------------------------------------
 */

const mapInterviewer =
    (
        item: any
    ): InterviewerType => {
        return {
            id:
                String(
                    item.id || ""
                ),

            name:
                String(
                    item.name || ""
                ),

            email:
                String(
                    item.email || ""
                ),

            sid:
                String(
                    item.sid || ""
                ),
            phone:
                String(
                    item.phone || ""
                ),

            availableDays:
                Array.isArray(
                    item.availableDays
                )
                    ? item.availableDays
                    : [],

            responses:
                item.responses &&
                typeof item.responses ===
                    "object"
                    ? item.responses
                    : {},

            status:
                String(
                    item.status ||
                        "pending"
                ).toLowerCase() as
                    | "pending"
                    | "accepted"
                    | "rejected",

            createdAt:
                item.createdAt ||
                null,
        };
    };

/*
 * ---------------------------------------------------------
 * Fetch current user's application
 * ---------------------------------------------------------
 *
 * We currently use email as the identifier.
 * This is useful when we later add persistent
 * application lookup.
 * ---------------------------------------------------------
 */

export const fetchMyInterviewerApplication =
    async (
        email: string
    ): Promise<
        InterviewerType | null
    > => {
        try {
            if (
                !email.trim()
            ) {
                return null;
            }

            const result =
                await appsScriptRequest(
                    {
                        action:
                            "get_my_interviewer",

                        email:
                            email.trim(),
                    }
                );

            if (
                !result?.success ||
                !result?.applicant
            ) {
                return null;
            }

            return mapInterviewer(
                result.applicant
            );
        } catch (error) {
            console.error(
                "Error fetching interviewer application:",
                error
            );

            return null;
        }
    };

/*
 * ---------------------------------------------------------
 * Create interviewer application
 * ---------------------------------------------------------
 */

export const createInterviewer =
    async (
        name: string,
        sid: string,
        email: string,
        phone: string,
        availableDays: string[],
        responses: Record<
            string,
            string
        >
    ): Promise<
        CreateInterviewerResult
    > => {
        try {
            const result =
                await appsScriptRequest(
                    {
                        action:
                            "create_interviewer",

                        name:
                            name.trim(),

                        sid:
                            sid.trim(),

                        email:
                            email.trim(),

                        phone:
                            phone.trim(),

                        availableDays:
                            availableDays,

                        responses:
                            responses,
                    }
                );

            /*
             * Duplicate application
             */

            if (
                result?.reason ===
                "duplicate"
            ) {
                return {
                    success:
                        false,

                    reason:
                        "duplicate",
                };
            }

            /*
             * Apps Script returned an error
             */

            if (
                !result?.success ||
                !result?.applicant
            ) {
                console.error(
                    "Google Apps Script failed to create interviewer:",
                    result
                );

                return {
                    success:
                        false,

                    reason:
                        "error",
                };
            }

            return {
                success:
                    true,

                applicant:
                    mapInterviewer(
                        result.applicant
                    ),
            };
        } catch (error) {
            console.error(
                "Error creating interviewer:",
                error
            );

            return {
                success:
                    false,

                reason:
                    "error",
            };
        }
    };

/*
 * ---------------------------------------------------------
 * Update interviewer personal information
 * ---------------------------------------------------------
 *
 * Editable while status = pending:
 *
 * - Name
 * - Email
 * - SID
 * - Available days
 *
 * Responses are NOT changed.
 * ---------------------------------------------------------
 */

export const updateInterviewerPersonalInfo =
    async (
        applicationId: string,
        name: string,
        email: string,
        sid: string,
        phone: string, 
        availableDays: string[]
    ): Promise<
        UpdateInterviewerResult
    > => {
        try {
            const result =
                await appsScriptRequest(
                    {
                        action:
                            "update_interviewer",

                        applicationId,

                        name:
                            name.trim(),

                        email:
                            email.trim(),

                        sid:
                            sid.trim(),

                        phone:
                            phone.trim(),

                        availableDays:
                            availableDays,
                    }
                );

            /*
             * Application doesn't exist
             * or is no longer editable.
             */

            if (
                result?.reason ===
                "not_found"
            ) {
                return {
                    success:
                        false,

                    reason:
                        "not_found",
                };
            }

            /*
             * Apps Script returned an error
             */

            if (
                !result?.success ||
                !result?.applicant
            ) {
                console.error(
                    "Google Apps Script failed to update interviewer:",
                    result
                );

                return {
                    success:
                        false,

                    reason:
                        "error",
                };
            }

            return {
                success:
                    true,

                applicant:
                    mapInterviewer(
                        result.applicant
                    ),
            };
        } catch (error) {
            console.error(
                "Error updating interviewer:",
                error
            );

            return {
                success:
                    false,

                reason:
                    "error",
            };
        }
    };