import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-internal-secret",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS",
};

const SLOT_MINUTES = 10;

const FIRST_SLOT_MINUTES =
    17 * 60 + 10; // 5:10 PM

const SLOTS_PER_PANEL = 11;

/*
 * There is intentionally NO maximum panel count.
 *
 * Each panel can handle exactly 11 applicants
 * per day.
 */
const MAX_DAYS = 3;

type InterviewDay =
    | "Day 1"
    | "Day 2"
    | "Day 3";

type ApplicantRow = {
    id: string;
    name: string;
    sid: string;

    gender?:
        | "male"
        | "female"
        | null;

    isHostellers?:
        | boolean
        | null;

    applicant_response?:
        | {
              branch?:
                  | string
                  | null;
          }
        | {
              branch?:
                  | string
                  | null;
          }[]
        | null;
};

type OrderedApplicant = {
    applicant: ApplicantRow;
    priority: number;
};

type ScheduleSlot = {
    day: InterviewDay;
    time: string;
    panel: number;
};

type PublicScheduleRow = {
    day: InterviewDay;
    time: string;
    panel: number;
    name: string;
    sid: string;
};


/*
 * ---------------------------------------------------------
 * Academic year
 * ---------------------------------------------------------
 */

function getAcademicYear(): string {
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        now.getMonth();

    const startYear =
        month >= 6
            ? year
            : year - 1;

    return `${startYear}-${String(
        startYear + 1
    ).slice(-2)}`;
}


/*
 * ---------------------------------------------------------
 * Priority
 * ---------------------------------------------------------
 *
 * 1. Female + Day Scholar
 * 2. Male   + Day Scholar
 * 3. Female + Hosteller
 * 4. Male   + Hosteller
 * 5. Legacy / unspecified
 */

function getPriority(
    gender:
        | "male"
        | "female"
        | null
        | undefined,

    isHostellers:
        | boolean
        | null
        | undefined
): number {
    if (
        gender === "female" &&
        isHostellers === false
    ) {
        return 1;
    }

    if (
        gender === "male" &&
        isHostellers === false
    ) {
        return 2;
    }

    if (
        gender === "female" &&
        isHostellers === true
    ) {
        return 3;
    }

    if (
        gender === "male" &&
        isHostellers === true
    ) {
        return 4;
    }

    return 5;
}


/*
 * ---------------------------------------------------------
 * Randomize only within same priority
 * ---------------------------------------------------------
 */

function shuffle<T>(
    items: T[]
): T[] {
    const result = [
        ...items,
    ];

    for (
        let i =
            result.length - 1;
        i > 0;
        i--
    ) {
        const random =
            new Uint32Array(1);

        crypto.getRandomValues(
            random
        );

        const j =
            random[0] %
            (i + 1);

        [
            result[i],
            result[j],
        ] = [
            result[j],
            result[i],
        ];
    }

    return result;
}

function orderApplicants(
    applicants: ApplicantRow[]
): OrderedApplicant[] {
    const groups =
        new Map<
            number,
            ApplicantRow[]
        >();

    for (
        const applicant of
        applicants
    ) {
        const priority =
            getPriority(
                applicant.gender,
                applicant.isHostellers
            );

        const group =
            groups.get(
                priority
            ) ?? [];

        group.push(
            applicant
        );

        groups.set(
            priority,
            group
        );
    }

    const result:
        OrderedApplicant[] = [];

    for (
        const priority of [
            1,
            2,
            3,
            4,
            5,
        ]
    ) {
        const group =
            groups.get(
                priority
            );

        if (
            !group ||
            group.length === 0
        ) {
            continue;
        }

        for (
            const applicant of
            shuffle(group)
        ) {
            result.push({
                applicant,
                priority,
            });
        }
    }

    return result;
}


/*
 * ---------------------------------------------------------
 * Time formatting
 * ---------------------------------------------------------
 */

function formatTime(
    totalMinutes: number
): string {
    const hour24 =
        Math.floor(
            totalMinutes / 60
        );

    const minute =
        totalMinutes % 60;

    const suffix =
        hour24 >= 12
            ? "PM"
            : "AM";

    const hour12 =
        hour24 % 12 || 12;

    return `${hour12}:${String(
        minute
    ).padStart(
        2,
        "0"
    )} ${suffix}`;
}


/*
 * ---------------------------------------------------------
 * Determine panel/day layout
 * ---------------------------------------------------------
 *
 * Every panel gives:
 *
 *   11 applicants/day
 *
 * No maximum number of panels.
 *
 * We determine the minimum total number of
 * panel-days required and then distribute those
 * panels as evenly as possible across up to 3 days.
 *
 * Examples:
 *
 * 11 applicants
 *   -> 1 panel
 *   -> Day 1 = 1
 *
 * 12 applicants
 *   -> 2 panels
 *   -> Day 1 = 1
 *   -> Day 2 = 1
 *
 * 23 applicants
 *   -> 3 panels
 *   -> Day 1 = 1
 *   -> Day 2 = 1
 *   -> Day 3 = 1
 *
 * 34 applicants
 *   -> 4 panels
 *   -> 2 / 1 / 1
 *
 * 60 applicants
 *   -> 6 panels
 *   -> 2 / 2 / 2
 *
 * We never create unnecessary days if everything
 * fits into fewer days.
 */

function determinePanelLayout(
    applicantCount: number
): {
    days: 1 | 2 | 3;
    day1Panels: number;
    day2Panels: number;
    day3Panels: number;
} {
    if (
        applicantCount <= 0
    ) {
        return {
            days: 1,
            day1Panels: 0,
            day2Panels: 0,
            day3Panels: 0,
        };
    }

    /*
     * Minimum total panels required if we use
     * only one day.
     */
    const requiredPanels =
        Math.ceil(
            applicantCount /
                SLOTS_PER_PANEL
        );

    /*
     * First try one day.
     *
     * There is no panel cap.
     */
    if (
        requiredPanels <=
        Math.ceil(
            applicantCount /
                SLOTS_PER_PANEL
        ) &&
        applicantCount <=
        requiredPanels *
            SLOTS_PER_PANEL
    ) {
        /*
         * Keep one day only for a single panel
         * worth of applicants.
         *
         * For more than 11 applicants we spread
         * across additional days to keep the
         * panel count balanced and the daily
         * interview load reasonable.
         */
        if (
            requiredPanels === 1
        ) {
            return {
                days: 1,
                day1Panels: 1,
                day2Panels: 0,
                day3Panels: 0,
            };
        }
    }

    /*
     * Determine the minimum number of days needed
     * while keeping panel counts balanced.
     *
     * Prefer:
     *
     *   1 day for <= 11
     *   2 days for <= 22
     *   3 days for > 22
     *
     * But there is NO hard applicant maximum.
     *
     * Since there is also no maximum panel count,
     * three days can scale indefinitely.
     */
    let days:
        | 1
        | 2
        | 3;

    if (
        applicantCount <=
        SLOTS_PER_PANEL
    ) {
        days = 1;
    } else if (
        applicantCount <=
        SLOTS_PER_PANEL * 2
    ) {
        days = 2;
    } else {
        days = 3;
    }

    /*
     * Total panels required if the panels were
     * used across the chosen number of days.
     */
    const totalPanels =
        Math.ceil(
            applicantCount /
                SLOTS_PER_PANEL
        );

    /*
     * Distribute panels as evenly as possible.
     *
     * Example:
     *
     * 4 panels / 3 days
     *   -> 2 / 1 / 1
     *
     * 5 panels / 3 days
     *   -> 2 / 2 / 1
     *
     * 6 panels / 3 days
     *   -> 2 / 2 / 2
     *
     * The first days receive the extra panel
     * when perfect equality is impossible.
     */
    const basePanels =
        Math.floor(
            totalPanels /
                days
        );

    const remainder =
        totalPanels %
        days;

    const day1Panels =
        basePanels +
        (
            remainder >= 1
                ? 1
                : 0
        );

    const day2Panels =
        days >= 2
            ? basePanels +
              (
                  remainder >= 2
                      ? 1
                      : 0
              )
            : 0;

    const day3Panels =
        days >= 3
            ? basePanels +
              (
                  remainder >= 3
                      ? 1
                      : 0
              )
            : 0;

    return {
        days,
        day1Panels,
        day2Panels,
        day3Panels,
    };
}


/*
 * ---------------------------------------------------------
 * Generate chronological slot pool
 * ---------------------------------------------------------
 *
 * Within each time:
 *
 *   Day 1 panels
 *   Day 2 panels
 *   Day 3 panels
 *
 * The priority ordering is therefore preserved
 * across the entire schedule.
 */

function buildSlots(
    days: 1 | 2 | 3,
    day1Panels: number,
    day2Panels: number,
    day3Panels: number
): ScheduleSlot[] {
    const slots:
        ScheduleSlot[] = [];

    for (
        let slotIndex = 0;
        slotIndex <
        SLOTS_PER_PANEL;
        slotIndex++
    ) {
        const start =
            FIRST_SLOT_MINUTES +
            slotIndex *
                SLOT_MINUTES;

        const time =
            `${formatTime(
                start
            )} - ${formatTime(
                start +
                    SLOT_MINUTES
            )}`;

        /*
         * Day 1
         */
        for (
            let panel = 1;
            panel <=
            day1Panels;
            panel++
        ) {
            slots.push({
                day: "Day 1",
                time,
                panel,
            });
        }

        /*
         * Day 2
         */
        if (
            days >= 2
        ) {
            for (
                let panel = 1;
                panel <=
                day2Panels;
                panel++
            ) {
                slots.push({
                    day: "Day 2",
                    time,
                    panel,
                });
            }
        }

        /*
         * Day 3
         */
        if (
            days === 3
        ) {
            for (
                let panel = 1;
                panel <=
                day3Panels;
                panel++
            ) {
                slots.push({
                    day: "Day 3",
                    time,
                    panel,
                });
            }
        }
    }

    return slots;
}


/*
 * ---------------------------------------------------------
 * Build schedule
 * ---------------------------------------------------------
 */

function buildSchedule(
    applicants: ApplicantRow[]
) {
    const {
        days,
        day1Panels,
        day2Panels,
        day3Panels,
    } =
        determinePanelLayout(
            applicants.length
        );

    const orderedApplicants =
        orderApplicants(
            applicants
        );

    const slots =
        buildSlots(
            days,
            day1Panels,
            day2Panels,
            day3Panels
        );

    if (
        orderedApplicants.length >
        slots.length
    ) {
        throw new Error(
            `Insufficient interview capacity for ${orderedApplicants.length} applicants`
        );
    }

    const rows:
        PublicScheduleRow[] = [];

    /*
     * Highest priority gets the earliest slot.
     *
     * Within the same priority, order was
     * randomized above.
     */
    for (
        let index = 0;
        index <
        orderedApplicants.length;
        index++
    ) {
        const slot =
            slots[index];

        const {
            applicant,
        } =
            orderedApplicants[
                index
            ];

        rows.push({
            day:
                slot.day,

            time:
                slot.time,

            panel:
                slot.panel,

            name:
                applicant.name,

            sid:
                applicant.sid,
        });
    }

    return {
        academicYear:
            getAcademicYear(),

        days,

        day1Panels,

        day2Panels,

        day3Panels,

        rows,
    };
}


/*
 * ---------------------------------------------------------
 * Edge Function
 * ---------------------------------------------------------
 */

Deno.serve(
    async (
        req: Request
    ) => {
        if (
            req.method ===
            "OPTIONS"
        ) {
            return new Response(
                "ok",
                {
                    headers:
                        corsHeaders,
                }
            );
        }

        if (
            req.method !==
            "POST"
        ) {
            return new Response(
                JSON.stringify({
                    success:
                        false,
                    error:
                        "Method not allowed",
                }),
                {
                    status: 405,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }

        try {
            /*
             * ---------------------------------------------
             * Authenticate caller
             * ---------------------------------------------
             */

            const authorization =
                req.headers.get(
                    "Authorization"
                );

            const internalSecret =
                Deno.env.get(
                    "SCHEDULE_INTERNAL_SECRET"
                );

            const providedInternalSecret =
                req.headers.get(
                    "x-internal-secret"
                );

            const isInternalRequest =
                Boolean(
                    internalSecret &&
                    providedInternalSecret &&
                    providedInternalSecret ===
                        internalSecret
                );

            if (
                !isInternalRequest &&
                !authorization
            ) {
                return new Response(
                    JSON.stringify({
                        success:
                            false,
                        error:
                            "Authentication required",
                    }),
                    {
                        status: 401,
                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );
            }

            const supabaseUrl =
                Deno.env.get(
                    "SUPABASE_URL"
                );

            const supabaseAnonKey =
                Deno.env.get(
                    "SUPABASE_ANON_KEY"
                );

            const serviceRoleKey =
                Deno.env.get(
                    "SUPABASE_SERVICE_ROLE_KEY"
                );

            if (
                !supabaseUrl ||
                !supabaseAnonKey ||
                !serviceRoleKey
            ) {
                throw new Error(
                    "Supabase environment variables are missing"
                );
            }

            let user:
                {
                    id: string;
                } | null =
                null;

            if (
                !isInternalRequest
            ) {
                const authenticatedClient =
                    createClient(
                        supabaseUrl,
                        supabaseAnonKey,
                        {
                            global: {
                                headers: {
                                    Authorization:
                                        authorization!,
                                },
                            },
                        }
                    );

                const authResult =
                    await authenticatedClient
                        .auth
                        .getUser();

                user =
                    authResult.data.user
                        ? {
                              id:
                                  authResult
                                      .data
                                      .user
                                      .id,
                          }
                        : null;

                if (
                    authResult.error ||
                    !user
                ) {
                    return new Response(
                        JSON.stringify({
                            success:
                                false,
                            error:
                                "Invalid or expired Supabase session",
                        }),
                        {
                            status: 401,
                            headers: {
                                ...corsHeaders,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );
                }
            }

            const adminClient =
                createClient(
                    supabaseUrl,
                    serviceRoleKey
                );

            /*
             * ---------------------------------------------
             * Google configuration
             * ---------------------------------------------
             */

            const googleScriptUrl =
                Deno.env.get(
                    "GOOGLE_SHEETS_SCRIPT_URL"
                );

            const googleSheetsSecret =
                Deno.env.get(
                    "GOOGLE_SHEETS_SECRET"
                );

            if (
                !googleScriptUrl ||
                !googleSheetsSecret
            ) {
                throw new Error(
                    "Google Sheets configuration is missing"
                );
            }

            /*
             * ---------------------------------------------
             * Fetch current pending applicants
             * ---------------------------------------------
             *
             * Pending + non-walk-in applicants only.
             */

            const {
                data: applicants,
                error:
                    applicantsError,
            } =
                await adminClient
                    .from(
                        "applicants"
                    )
                    .select(
                        "id, name, sid, gender, isHostellers, applicant_response(branch)"
                    )
                    .eq(
                        "status",
                        "PENDING"
                    )
                    .eq(
                        "isWalkin",
                        false
                    )
                    .order(
                        "created_at",
                        {
                            ascending:
                                true,
                        }
                    );

            if (
                applicantsError
            ) {
                throw new Error(
                    `Failed to fetch pending applicants: ${applicantsError.message}`
                );
            }

            /*
             * ---------------------------------------------
             * Build schedule
             * ---------------------------------------------
             */

            const schedule =
                buildSchedule(
                    (
                        applicants ??
                        []
                    ) as ApplicantRow[]
                );

            /*
             * ---------------------------------------------
             * Synchronize Google Sheet
             * ---------------------------------------------
             */

            const generatedAt =
                Date.now();

            const googleResponse =
                await fetch(
                    googleScriptUrl,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                operation:
                                    "schedule",

                                academicYear:
                                    schedule.academicYear,

                                days:
                                    schedule.days,

                                day1Panels:
                                    schedule.day1Panels,

                                day2Panels:
                                    schedule.day2Panels,

                                day3Panels:
                                    schedule.day3Panels,

                                generatedAt,

                                generatedBy:
                                    user?.id ??
                                    "background-scheduler",

                                rows:
                                    schedule.rows,

                                secret:
                                    googleSheetsSecret,
                            }),
                    }
                );

            let googleResult:
                {
                    success?: boolean;
                    stale?: boolean;
                    error?: string;
                };

            try {
                googleResult =
                    await googleResponse.json();
            } catch {
                throw new Error(
                    `Google Apps Script returned an invalid response (HTTP ${googleResponse.status})`
                );
            }

            if (
                !googleResponse.ok ||
                !googleResult.success
            ) {
                throw new Error(
                    googleResult.error ||
                        `Interview schedule synchronization failed (HTTP ${googleResponse.status})`
                );
            }

            return new Response(
                JSON.stringify({
                    success:
                        true,

                    academicYear:
                        schedule.academicYear,

                    days:
                        schedule.days,

                    day1Panels:
                        schedule.day1Panels,

                    day2Panels:
                        schedule.day2Panels,

                    day3Panels:
                        schedule.day3Panels,

                    applicantCount:
                        applicants?.length ??
                        0,

                    stale:
                        googleResult.stale ??
                        false,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        } catch (error) {
            console.error(
                "schedule-interviews error:",
                error
            );

            return new Response(
                JSON.stringify({
                    success:
                        false,

                    error:
                        error instanceof
                        Error
                            ? error.message
                            : "Unknown error",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                }
            );
        }
    }
);