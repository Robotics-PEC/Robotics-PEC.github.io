import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS",
};

const SLOT_MINUTES = 10;
const FIRST_SLOT_MINUTES =
    17 * 60 + 10; // 5:10 PM

const SLOTS_PER_PANEL = 11;

const INITIAL_DAY_1_PANELS = 10;
const MAX_ONE_DAY_PANELS = 15;

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
    day:
        | "Day 1"
        | "Day 2";

    time: string;

    panel: number;
};

type PublicScheduleRow = {
    day:
        | "Day 1"
        | "Day 2";

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
 *
 * Legacy/unspecified applicants get priority 5.
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
 * Randomize only within the same priority
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
 * Determine exact day/panel state
 * ---------------------------------------------------------
 *
 * One-day rule:
 *
 * <=165 applicants
 * → minimum panels needed
 * → Day 1 only
 *
 * Two-day rule:
 *
 * Start:
 *   10-0
 *
 * Then:
 *   10-1
 *   10-2
 *   ...
 *   10-10
 *
 * Then:
 *   11-10
 *   11-11
 *   12-11
 *   12-12
 *   ...
 *
 * where:
 *
 *   first number = Day 1 panels
 *   second number = Day 2 panels
 */

function determinePanelLayout(
    applicantCount: number
): {
    days: 1 | 2;
    day1Panels: number;
    day2Panels: number;
} {
    if (
        applicantCount <= 0
    ) {
        return {
            days: 1,
            day1Panels: 0,
            day2Panels: 0,
        };
    }

    /*
     * First determine whether everything can fit
     * into one day with at most 15 panels.
     */
    const requiredOneDayPanels =
        Math.ceil(
            applicantCount /
                SLOTS_PER_PANEL
        );

    if (
        requiredOneDayPanels <=
        MAX_ONE_DAY_PANELS
    ) {
        return {
            days: 1,
            day1Panels:
                requiredOneDayPanels,
            day2Panels: 0,
        };
    }

    /*
     * Two-day mode.
     *
     * Start with 10 panels on Day 1
     * and zero on Day 2.
     */
    let day1Panels =
        INITIAL_DAY_1_PANELS;

    let day2Panels = 0;

    while (
        day1Panels *
                SLOTS_PER_PANEL +
            day2Panels *
                SLOTS_PER_PANEL <
        applicantCount
    ) {
        /*
         * First fill Day 2 until it reaches
         * 10 panels.
         */
        if (
            day2Panels <
            INITIAL_DAY_1_PANELS
        ) {
            day2Panels += 1;

            continue;
        }

        /*
         * Once Day 2 reaches 10, increase
         * Day 1 and Day 2 alternately:
         *
         * 11-10
         * 11-11
         * 12-11
         * 12-12
         * ...
         */
        if (
            day1Panels ===
            day2Panels
        ) {
            day1Panels += 1;
        } else {
            day2Panels += 1;
        }
    }

    return {
        days: 2,
        day1Panels,
        day2Panels,
    };
}


/*
 * ---------------------------------------------------------
 * Generate chronological slot pool
 * ---------------------------------------------------------
 *
 * Within each time:
 *
 * Day 1 panels first
 * then Day 2 panels.
 *
 * This means that when we assign priority order,
 * higher-priority applicants get the earliest actual
 * available interview slots.
 */

function buildSlots(
    days: 1 | 2,
    day1Panels: number,
    day2Panels: number
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
         * Day 1.
         */
        for (
            let panel = 1;
            panel <= day1Panels;
            panel++
        ) {
            slots.push({
                day: "Day 1",
                time,
                panel,
            });
        }

        /*
         * Day 2.
         */
        if (
            days === 2
        ) {
            for (
                let panel = 1;
                panel <= day2Panels;
                panel++
            ) {
                slots.push({
                    day: "Day 2",
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
            day2Panels
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
     * Highest priority gets earliest available slot.
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

            /*
             * ONLY public information.
             */
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
             * -----------------------------------------------------
             * Authenticate caller.
             * -----------------------------------------------------
             */

            const authorization =
                req.headers.get(
                    "Authorization"
                );

            if (
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

            const authenticatedClient =
                createClient(
                    supabaseUrl,
                    supabaseAnonKey,
                    {
                        global: {
                            headers: {
                                Authorization:
                                    authorization,
                            },
                        },
                    }
                );

            const {
                data: {
                    user,
                },
                error:
                    userError,
            } =
                await authenticatedClient
                    .auth
                    .getUser();

            if (
                userError ||
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

            /*
             * Service-role client is only used inside
             * this trusted Edge Function.
             */
            const adminClient =
                createClient(
                    supabaseUrl,
                    serviceRoleKey
                );

            /*
             * -----------------------------------------------------
             * Google configuration.
             * -----------------------------------------------------
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
             * -----------------------------------------------------
             * Fetch current PENDING applicants.
             * -----------------------------------------------------
             *
             * PENDING means the applicant still needs
             * an interview.
             *
             * ACCEPTED/REJECTED are deliberately excluded.
             *
             * Walk-ins are excluded.
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
             * -----------------------------------------------------
             * Calculate complete schedule.
             * -----------------------------------------------------
             */

            const schedule =
                buildSchedule(
                    (
                        applicants ??
                        []
                    ) as ApplicantRow[]
                );

            /*
             * -----------------------------------------------------
             * Send ONLY:
             *
             * Day
             * Time
             * Panel
             * Name
             * SID
             *
             * to the shared Google Sheet.
             * -----------------------------------------------------
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

                                generatedAt,

                                generatedBy:
                                    user.id,

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