"use client";

import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { getBasePath } from "@/lib/utils";

const styles = StyleSheet.create({
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 80,
        height: 80,
    },
    middleSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 14,
        fontWeight: "extrabold",
        fontFamily: "Times-Bold",
        textAlign: "center",
        lineHeight: 1.5,
    },
    headerSubText: {
        fontSize: 12,
        textAlign: "center",
        lineHeight: 1.4,
    },
});

export const PECHeader = ({
    middleText = "PUNJAB ENGINEERING COLLEGE\n(DEEMED TO BE UNIVERSITY)\nCHANDIGARH",
    leftLogo = {
        logo: `${getBasePath()}pec_logo.png`,
        width: 60,
        height: 40,
    },
    rightLogo = {
        logo: `${getBasePath()}pec_seal.png`,
        width: 60,
        height: 60,
    },
}) => {
    // Handle both string and array input for middleText
    const textLines = Array.isArray(middleText)
        ? middleText
        : middleText.split("\n");
    return (
        <View style={styles.headerContainer}>
            {/* Left Logo */}
            <View style={styles.logoSection}>
                <Image
                    src={leftLogo.logo}
                    style={{ width: leftLogo.width, height: leftLogo.height }}
                />
            </View>

            {/* Middle Text Section */}
            <View style={styles.middleSection}>
                {textLines.map((line, index) => (
                    <Text key={index} style={styles.headerText}>
                        {line}
                    </Text>
                ))}
            </View>

            {/* Right Logo */}
            <View style={styles.logoSection}>
                <Image
                    src={rightLogo.logo}
                    style={{ width: rightLogo.width, height: rightLogo.height }}
                />
            </View>
        </View>
    );
};

export default PECHeader;
