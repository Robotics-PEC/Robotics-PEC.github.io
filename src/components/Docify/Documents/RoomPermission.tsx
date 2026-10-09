"use client";

import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import PECHeader from "./PECHeader";
import { getBasePath } from "@/lib/utils";

export const RoomPermission = ({ formData }: { formData: any }) => {
    const formatDate = (date: string) => {
        if (!date) return "N/A";
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        return new Date(date).toLocaleDateString("en-GB", options);
    };

    const formatTime = (time: string) => {
        if (!time) return "N/A";
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const styles = StyleSheet.create({
        page: {
            padding: 30,
            fontSize: 14,
            flexDirection: "column",
        },
        Heading1: {
            fontSize: 22,
            fontFamily: "Times-Roman",
            textAlign: "center",
        },
        Heading2: {
            fontSize: 20,
            fontFamily: "Times-Bold",
            textAlign: "center",
        },
        titleText: {
            fontSize: 12,
            fontFamily: "Times-Bold",
            textDecoration: "underline",
            lineHeight: 1.5,
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        table: {
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#000",
        },
        tableRow: {
            flexDirection: "row",
        },
        tableCol: {
            width: "50%",
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#000",
            padding: 5,
        },
        tableCellMain: {
            fontSize: 14,
            fontFamily: "Times-Bold",
        },
        tableCell: {
            fontSize: 14,
            fontFamily: "Times-Roman",
        },
        lastCol: {
            borderRightWidth: 0,
        },
        lastRow: {
            borderBottomWidth: 0,
        },
        note: {
            marginTop: 20,
            fontSize: 10,
        },
        signatureContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 50,
        },
        signature: {
            fontFamily: "Times-Bold",
            fontSize: 14,
        },
        signatureLeft: {
            textAlign: "left",
        },
        signatureRight: {
            textAlign: "right",
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PECHeader
                    rightLogo={{
                        logo: `${getBasePath()}pec_seal.png`,
                        width: 60,
                        height: 60,
                    }}
                />
                <View style={{ margin: 10 }}></View>

                <View
                    style={{
                        ...styles.titleText,
                        textAlign: "center",
                        margin: 24,
                    }}
                >
                    <Text>
                        Performa for Booking OF Lecture Rooms by Clubs/
                        Society/NSS/Sports & departments
                    </Text>
                </View>

                <View
                    style={{ margin: 10, paddingLeft: 10, ...styles.titleText }}
                >
                    <Text>P/I Security</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.table}>
                        {[
                            {
                                label: "Name of Club/Society",
                                value: formData.society,
                            },
                            { label: "Event Name", value: formData.eventName },
                            {
                                label: "Brief Event Description",
                                value: formData.eventDescription,
                            },
                            {
                                label: "Date",
                                value: `${formatDate(formData.fromDate)} ${formData.toDate ? `- ${formatDate(formData.toDate)}` : ""}`,
                            },
                            {
                                label: "Time",
                                value: `${formatTime(formData.fromTime)} - ${formatTime(
                                    formData.toTime,
                                )}`,
                            },
                            {
                                label: "Room Number",
                                value: formData.roomNumber,
                            },
                            { label: "Department", value: formData.department },
                            {
                                label: "Expected participation & Audience",
                                value: formData.audience,
                            },
                        ].map((row, index, array) => (
                            <View
                                style={[
                                    styles.tableRow,
                                    index === array.length - 1
                                        ? styles.lastRow
                                        : undefined,
                                ]}
                                key={row.label}
                            >
                                <View
                                    style={[
                                        styles.tableCol,
                                        index === array.length - 1
                                            ? styles.lastRow
                                            : undefined,
                                    ]}
                                >
                                    <Text style={styles.tableCellMain}>
                                        {row.label}:
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.tableCol,
                                        styles.lastCol,
                                        index === array.length - 1
                                            ? styles.lastRow
                                            : undefined,
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        {row.value}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.note}>
                        <Text>
                            Note: The undersigned takes full responsibility for
                            any damage to the institute’s property in the
                            above-mentioned rooms during the specified time.
                        </Text>
                        <Text style={{ marginTop: 20 }}>
                            NOTE: Proper disciplined will be maintained during
                            practices/activity by everyone and secretary/ joint
                            secretary are responsible for it.
                        </Text>
                        <Text style={{ marginTop: 20 }}>
                            Any financial assistance required? (Yes/No)
                        </Text>
                    </View>

                    <View style={styles.signatureContainer}>
                        <Text style={[styles.signature, styles.signatureLeft]}>
                            (Secretary/J. Secretary)
                        </Text>
                        <Text style={[styles.signature, styles.signatureRight]}>
                            (CCS/CSTS)
                        </Text>
                    </View>

                    <View style={styles.signatureContainer}>
                        <Text style={[styles.signature, styles.signatureLeft]}>
                            (Officer Incharge)
                        </Text>
                        <Text style={[styles.signature, styles.signatureRight]}>
                            (ADSA)
                        </Text>
                        <Text style={[styles.signature, styles.signatureLeft]}>
                            (DSA)
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
