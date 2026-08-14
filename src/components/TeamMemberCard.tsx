"use client";

import Image from "next/image";
import { useState } from "react";

import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  location?: string;
  image: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({
  member,
}: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        overflow-hidden
        rounded-[24px]
        bg-[#f0f1f3]
        p-2.5
        transition-all
        duration-500
        ${isHovered ? "-translate-y-1 shadow-xl" : ""}
      `}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[19px]">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className={`
            object-cover
            transition-all
            duration-700
            ease-in-out
            ${isHovered ? "grayscale-0 scale-105" : "grayscale"}
          `}
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            25vw
          "
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* INFO */}
      <div className="mt-2.5 rounded-[19px] bg-white p-5">

        {/* ALWAYS VISIBLE */}
        <h3 className="text-xl font-semibold tracking-tight text-[#202938]">
          {member.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-gray-500">
          {member.role}
        </p>

        {/* HOVER CONTENT */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-500
            ease-in-out
            ${
              isHovered
                ? "mt-5 max-h-[250px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          {/* DESCRIPTION */}
          <p className="text-sm leading-relaxed text-gray-500">
            {member.description}
          </p>

          {/* BOTTOM */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

            {/* LOCATION */}
            {member.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                {member.location}
              </div>
            )}

            {member.socials?.linkedin && (
  <a
    href={member.socials.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${member.name} LinkedIn`}
    className="
      text-gray-400
      transition-all
      duration-200
      hover:scale-110
      hover:text-[#0a66c2]
    "
  >
    <Linkedin size={20} strokeWidth={2} />
  </a>
)}

          </div>
        </div>
      </div>
    </div>
  );
}