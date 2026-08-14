"use client";

import { useEffect, useMemo, useState } from "react";

import { getStorageImageUrl } from "@/lib/supabase/actions/storage.actions";
import { getTeamMembers } from "@/lib/supabase/actions/team.actions";

import { teamDetails } from "./data/team_details";

import TeamMemberCard from "../../components/TeamMemberCard";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description?: string;
  location?: string;
  image: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [resolvedImageUrls, setResolvedImageUrls] = useState<
    Record<string, string | null>
  >({});

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  /*
   * Add information from team_details.ts to the Supabase members.
   *
   * Supabase provides:
   * - name
   * - role
   * - image
   *
   * team_details.ts provides:
   * - description
   * - location
   * - socials
   */
  const membersWithDetails = useMemo(() => {
    return teamMembers.map((member) => {
      const details = teamDetails[member.name];

      return {
        ...member,

        description:
          member.description ??
          details?.description ??
          "Core member of the Robotics Society team.",

        location:
          member.location ??
          details?.location,

        socials: {
          ...details?.socials,
          ...member.socials,
        },
      };
    });
  }, [teamMembers]);

  /*
   * Fetch team members from Supabase
   */
  useEffect(() => {
    let isActive = true;

    const fetchMembers = async () => {
      setLoadingMembers(true);

      try {
        const data = await getTeamMembers();

        if (!isActive) {
          return;
        }

        const formattedMembers: TeamMember[] = data.map(
          (member: {
            id: string;
            firstName: string;
            lastName: string;
            role: string;
            image: string;
          }) => ({
            id: member.id,
            name: `${member.firstName} ${member.lastName}`.trim(),
            role: member.role,
            image: member.image,
          })
        );

        setTeamMembers(formattedMembers);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to fetch team members:", error);
        setTeamMembers([]);
      } finally {
        if (isActive) {
          setLoadingMembers(false);
        }
      }
    };

    void fetchMembers();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Resolve Supabase Storage image URLs
   */
  useEffect(() => {
    let isActive = true;

    const fetchImageUrls = async () => {
      if (membersWithDetails.length === 0) {
        setResolvedImageUrls({});
        setLoadingImages(false);
        return;
      }

      setLoadingImages(true);

      const urlPairs = await Promise.all(
        membersWithDetails.map(async (member) => {
          const url = await getStorageImageUrl(member.image || "");

          return [member.id, url] as const;
        })
      );

      if (!isActive) {
        return;
      }

      setResolvedImageUrls(Object.fromEntries(urlPairs));
      setLoadingImages(false);
    };

    void fetchImageUrls();

    return () => {
      isActive = false;
    };
  }, [membersWithDetails]);

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-20 md:px-8 lg:px-12">

      {/* ================= HEADER ================= */}

      <section className="mx-auto max-w-7xl pb-14">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Our People
        </p>

        <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#202938] md:text-7xl">
          Meet the Team
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
          Meet the people behind the ideas, technology and innovation.
        </p>
      </section>

      {/* ================= TEAM GRID ================= */}

      <section className="mx-auto max-w-7xl">
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {membersWithDetails.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
            />
          ))}
        </div>
      </section>
    </main>
  );
}