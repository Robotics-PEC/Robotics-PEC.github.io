import { motion } from "framer-motion";
import { TeamData, TeamMember } from "@/types";
import Image from "next/image";
import PageSection from "@/components/layout/PageSection";
import { teamCategoryOptions } from "@/lib/utils";

const Team: React.FC<{ teamMembers: TeamData }> = ({ teamMembers }) => {

    return (
        <section className="py-24" id="team">
            <PageSection
                title="Our Team"
                subtitle="Meet the minds behind the innovation"
            >
                <div className={`grid grid-rows-${5 - teamMembers.emptyArrays}`}>
                    {teamCategoryOptions.map((category: { value: string, label: string }, index) => (
                        <div className={`${teamMembers[category.value].length <= 0 && "hidden"}`}>
                            <h1 className="text-center font-bold text-4xl">{category.label}</h1>
                            <div className={teamMembers.length >= 4 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8" : "grid grid-cols-2 md:flex lg:flex md:justify-center lg:justify-center md:items-center lg:items-center md:gap-8 lg:gap-8"}>
                                {teamMembers[category.value].length > 0 && teamMembers[category.value].map((member: TeamMember, index: number) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="glass-card my-5 text-center"
                                    >
                                        <div className="relative w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4">
                                            <Image
                                                src={member.image}
                                                alt={member.firstName}
                                                fill
                                                className="object-contain rounded-[50px]"
                                            />
                                        </div>
                                        <p className="text-gray-600">Name : {member.firstName} {member.lastName}</p>
                                        <p className="text-gray-600">Role : {member.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </PageSection>
        </section>
    );
}

export default Team;