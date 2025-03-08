import { motion } from "framer-motion";
import { TeamMember } from "@/types";
import Image from "next/image";

const Team: React.FC<{ teamMembers: TeamMember[] }> = ({ teamMembers }) => {

    return (
        <section className="py-24" id="team">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Team</h2>
                    <p className="text-gray-600">Meet the minds behind the innovation</p>
                </div>
                {
                    teamMembers.length >= 4 ?
                        (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {teamMembers?.map((member: TeamMember, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="glass-card p-6 text-center"
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
                        )
                        :
                        (
                            <div className="flex justify-center gap-8">
                                {teamMembers?.map((member: TeamMember, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="glass-card p-6 text-center"
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
                        )
                }
            </div>
        </section>
    );
}

export default Team;