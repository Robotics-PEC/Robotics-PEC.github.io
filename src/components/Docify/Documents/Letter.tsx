"use client";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export const Letter = ({ formData }: { formData: any }) => {
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        return new Date(date).toLocaleDateString("en-GB", options);
    };

    const styles = StyleSheet.create({
        page: { padding: 30, fontSize: 11 },
        text: {
            margin: 12,
            fontSize: 11,
            fontFamily: "Times-Roman",
        },
        section: { marginBottom: 10 },
        header: {
            fontSize: 18,
            marginBottom: 10,
            textAlign: "center",
            fontWeight: "bold",
        },
        footer: {
            position: "absolute",
            bottom: 30,
            left: 30,
            right: 30,
            fontSize: 10,
            textAlign: "center",
            borderTop: "1px solid #000",
            paddingTop: 10,
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={{ fontFamily: "Times-Roman", fontSize: 11 }}>
                        To,
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Times-Roman",
                            fontSize: 11,
                            marginBottom: 10,
                        }}
                    >
                        {formData.receiver}
                    </Text>
                    {formData.receiver2 && (
                        <>
                            <Text
                                style={{
                                    fontFamily: "Times-Roman",
                                    fontSize: 11,
                                }}
                            >
                                Through,
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Times-Roman",
                                    fontSize: 11,
                                    marginBottom: 10,
                                }}
                            >
                                {formData.receiver2}
                            </Text>
                        </>
                    )}
                    <Text
                        style={{
                            fontFamily: "Times-Roman",
                            fontSize: 11,
                            marginBottom: 10,
                        }}
                    >
                        Date: {formatDate(formData.date)}
                    </Text>
                    <Text style={{ fontFamily: "Times-Roman", fontSize: 11 }}>
                        Subject: {formData.subject}
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Times-Roman",
                            fontSize: 11,
                            marginTop: 10,
                        }}
                    >
                        Respected {formData.respected},
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Times-Roman",
                            fontSize: 11,
                            marginTop: 10,
                            textAlign: "justify",
                        }}
                    >
                        {formData.message}
                    </Text>

                    <Text style={{ fontFamily: "Times-Roman" }}>
                        Best Regards,
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 30,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Times-Roman",
                                fontSize: 11,
                                textAlign: "left",
                            }}
                        >
                            {formData.signatory1}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "Times-Roman",
                                fontSize: 11,
                                textAlign: "right",
                            }}
                        >
                            {formData.signatory2}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 30,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Times-Roman",
                                fontSize: 11,
                                textAlign: "left",
                            }}
                        >
                            {formData.signatory3}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "Times-Roman",
                                fontSize: 11,
                                textAlign: "right",
                            }}
                        >
                            {formData.signatory4}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
