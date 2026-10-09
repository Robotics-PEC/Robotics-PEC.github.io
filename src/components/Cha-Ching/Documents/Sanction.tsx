import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const Sanction = ({ formData = {} }: { formData: any }) => {
    const formatDate = (date: string) => {
        if (!date) return "";
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        return new Date(date).toLocaleDateString("en-GB", options);
    };

    const formatTime = (time: string) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const styles = StyleSheet.create({
        page: {
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 30,
            paddingBottom: 70,
            fontSize: 12,
            flexDirection: "column",
            fontFamily: "Times-Roman",
            // lineHeight: 1.3,
        },
        header: {
            textAlign: "center",
            marginBottom: 20,
        },
        title1: {
            fontSize: 16,
            fontFamily: "Times-Bold",
        },
        title2: {
            fontSize: 13,
            fontFamily: "Times-Bold",
            marginTop: 3,
        },
        formSection: {
            marginBottom: 15,
        },
        fieldRow: {
            flexDirection: "row",
            marginBottom: 8,
        },
        fieldLabel: {
            fontFamily: "Times-Bold",
            minWidth: 150,
        },
        fieldValue: {
            flex: 1,
            borderBottom: "1pt solid black",
            minHeight: 10,
        },
        multiFieldRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
        },
        multiField: {
            flexDirection: "row",
            flex: 1,
            marginRight: 10,
        },
        multiFieldLabel: {
            fontFamily: "Times-Bold",
            marginRight: 5,
        },
        multiFieldValue: {
            flex: 1,
            borderBottom: "1pt solid black",
            minHeight: 10,
        },
        yesNoRow: {
            flexDirection: "row",
            marginBottom: 8,
        },
        yesNoText: {
            flex: 1,
        },
        yesNoAnswer: {
            fontFamily: "Times-Bold",
        },
        permissionText: {
            marginBottom: 15,
        },
        expenditureHeader: {
            fontSize: 13,
            fontFamily: "Times-Bold",
            marginBottom: 6,
            textAlign: "center",
        },
        table: {
            border: "1pt solid black",
            marginBottom: 15,
        },
        tableHeader: {
            flexDirection: "row",
            borderBottom: "1pt solid black",
            backgroundColor: "#f0f0f0",
        },
        tableRow: {
            flexDirection: "row",
            borderBottom: "1pt solid black",
            minHeight: 10,
        },
        lastRow: {
            borderBottom: "none",
        },
        tableCell: {
            padding: 2,
            borderRight: "1pt solid black",
            fontSize: 10,
            justifyContent: "center",
        },
        tableCellHeader: {
            fontFamily: "Times-Bold",
            fontSize: 11,
        },
        colSNo: { width: "8%", textAlign: "center" },
        colDesc: { width: "25%" },
        colQty: { width: "10%", textAlign: "center" },
        colCost: { width: "20%", textAlign: "center" },
        colJust: { width: "37%", borderRight: "none" },
        financialSection: {
            marginBottom: 0,
        },
        financialText: {
            marginBottom: 0,
        },
        signatureSection: {
            paddingTop: 20,
            marginTop: 0,
        },
        signatureRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
        },
        signature: {
            width: "45%",
            textAlign: "center",
        },
        signatureLabel: {
            fontSize: 10,
        },
        approvalSection: {
            marginTop: 40,
            fontSize: 11,
        },
        approvalHeader: {
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 10,
        },
        approvalItem: {
            marginBottom: 15,
        },
        footer: {
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 10,
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ ...styles.title1, textAlign: "center" }}>
                        PUNJAB ENGINEERING COLLEGE
                    </Text>
                    <Text style={{ ...styles.title2, textAlign: "center" }}>
                        (Deemed to be University)
                    </Text>
                    <Text style={{ ...styles.title2, textAlign: "center" }}>
                        PERFORMA FOR EVENT PERMISSION AND FINANCIAL SANCTION BY
                    </Text>
                    <Text style={{ ...styles.title2, textAlign: "center" }}>
                        CLUBS/SOCIETIES/SPORTS DEPARTMENT
                    </Text>
                </View>

                {/* Event Details */}
                <View style={styles.formSection}>
                    {/* Event Details Table */}
                    <View style={styles.table}>
                        {/* Club/Society */}
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "30%", fontFamily: "Times-Bold" },
                                ]}
                            >
                                Name of Club/Technical Society
                            </Text>
                            <Text style={[styles.tableCell, { width: "70%" }]}>
                                {formData.clubName || ""}
                            </Text>
                        </View>

                        {/* Event Name */}
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "30%", fontFamily: "Times-Bold" },
                                ]}
                            >
                                Event Name
                            </Text>
                            <Text style={[styles.tableCell, { width: "70%" }]}>
                                {formData.eventName || ""}
                            </Text>
                        </View>

                        {/* Date, Venue, Time in one row */}
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "30%", fontFamily: "Times-Bold" },
                                ]}
                            >
                                Date:{" "}
                                <Text style={{ fontFamily: "Times-Roman" }}>
                                    {`${formatDate(formData.fromEventDate)} ${
                                        formData.toEventDate &&
                                        `- ${formatDate(formData.toEventDate)}`
                                    }`}
                                </Text>
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "33%", fontFamily: "Times-Bold" },
                                ]}
                            >
                                Venue(s):{" "}
                                <Text style={{ fontFamily: "Times-Roman" }}>
                                    {formData.venues || ""}
                                </Text>
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    {
                                        width: "34%",
                                        borderRight: "none",
                                        fontFamily: "Times-Bold",
                                    },
                                ]}
                            >
                                Time:{" "}
                                <Text style={{ fontFamily: "Times-Roman" }}>
                                    {`${formatTime(formData.fromTime)} - ${formatTime(formData.toTime)}`}
                                </Text>
                            </Text>
                        </View>

                        {/* Event Description */}
                        <View style={styles.tableRow}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { width: "30%", fontFamily: "Times-Bold" },
                                ]}
                            >
                                Brief Event Description
                            </Text>
                            <Text style={[styles.tableCell, { width: "70%" }]}>
                                {formData.eventDescription || ""}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.yesNoRow}>
                        <Text style={styles.yesNoText}>
                            Have the details of the event signed by Club
                            Secretary attached along with the sanction?
                        </Text>
                        <Text style={styles.yesNoAnswer}>{"YES / NO"}</Text>
                    </View>
                    <View style={styles.permissionText}>
                        <Text>
                            Permission may please be granted for conducting
                            above mentioned event.
                        </Text>
                    </View>
                </View>

                {/* Expenditure Table */}
                <View style={styles.expenditureHeader}>
                    <Text>
                        EXPENDITURE DETAILS (Enter NIL if no funding required)
                    </Text>
                </View>

                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colSNo,
                                styles.tableCellHeader,
                            ]}
                        >
                            S. No.
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colDesc,
                                styles.tableCellHeader,
                            ]}
                        >
                            Description
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colQty,
                                styles.tableCellHeader,
                            ]}
                        >
                            Qty.
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colCost,
                                styles.tableCellHeader,
                            ]}
                        >
                            Approx. Cost
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colJust,
                                styles.tableCellHeader,
                            ]}
                        >
                            Justification
                        </Text>
                    </View>

                    {/* Rows */}
                    {formData.expenditureItems?.map(
                        (item: any, index: number) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.colSNo]}>
                                    {index + 1}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.colDesc]}
                                >
                                    {item.description || ""}
                                </Text>
                                <Text style={[styles.tableCell, styles.colQty]}>
                                    {item.quantity || 0}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.colCost]}
                                >
                                    {item.cost && item.quantity
                                        ? `Rs. ${item.cost}x${item.quantity}=${item.cost * item.quantity}`
                                        : ""}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.colJust]}
                                >
                                    {item.justification || ""}
                                </Text>
                            </View>
                        ),
                    )}

                    {/* Total */}
                    <View style={[styles.tableRow, styles.lastRow]}>
                        <Text style={[styles.tableCell, styles.colSNo]} />
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colDesc,
                                styles.tableCellHeader,
                            ]}
                        >
                            TOTAL
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colQty,
                                styles.tableCellHeader,
                            ]}
                        />
                        <Text
                            style={[
                                styles.tableCell,
                                styles.colCost,
                                styles.tableCellHeader,
                            ]}
                        >
                            {formData.totalAmount > 0
                                ? `Rs. ${formData.totalAmount.toFixed(2)}`
                                : ""}
                        </Text>
                        <Text style={[styles.tableCell, styles.colJust]} />
                    </View>
                </View>

                {/* Financial sanction */}
                <View style={styles.financialSection}>
                    <Text style={styles.financialText}>
                        Financial Sanction may kindly be accorded for Rs.{" "}
                        <Text style={{ borderBottom: "1pt solid black" }}>
                            {formData.totalAmount > 0
                                ? formData.totalAmount.toFixed(2)
                                : "________"}
                        </Text>{" "}
                        as per the above details.
                    </Text>
                    <Text style={styles.financialText}>
                        The expenditure will be met out from the{" "}
                        <Text style={{ borderBottom: "1pt solid black" }}>
                            {formData.fundSource || "________________"}
                        </Text>{" "}
                        Fund.
                    </Text>
                    <Text style={styles.financialText}>
                        An advance of Rs.{" "}
                        <Text style={{ borderBottom: "1pt solid black" }}>
                            {formData.advanceAmount || "________"}
                        </Text>{" "}
                        against this sanction may be given in the name of{" "}
                        <Text style={{ borderBottom: "1pt solid black" }}>
                            {formData.recipientName || "________________"}
                        </Text>
                    </Text>
                </View>

                {/* Signatures */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureRow}>
                        <View style={styles.signature}>
                            <Text style={styles.signatureLabel}>
                                (Name & Signatures of Club Secretary)
                            </Text>
                        </View>
                        <View style={styles.signature}>
                            <Text style={styles.signatureLabel}>
                                (Name & Signatures of CCS/CTS/Sports Secy.)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Approval Section as Table */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text
                            style={[
                                styles.tableCell,
                                { width: "100%", textAlign: "center" },
                                styles.tableCellHeader,
                            ]}
                        >
                            EVENT DETAILS & EXPENDITURE HAS BEEN VERIFIED
                        </Text>
                    </View>

                    {/* Main Row (Left 1 cell spanning, Right 2 stacked cells) */}
                    <View style={styles.tableRow}>
                        {/* Left cell (spans vertically) */}
                        <View
                            style={[
                                styles.tableCell,
                                { width: "40%", fontFamily: "Times-Bold" },
                            ]}
                        >
                            <Text>1.</Text>
                            <Text style={{ paddingTop: 35 }}>
                                P/I or Convener of Club/Technical Societies,
                                PECFEST Committee
                            </Text>
                        </View>

                        {/* Right side with two stacked rows */}
                        <View style={{ width: "60%", flexDirection: "column" }}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    {
                                        borderRight: "none",
                                        fontFamily: "Times-Bold",
                                        borderBottom: 1,
                                    },
                                ]}
                            >
                                Recommended / Not Recommended
                            </Text>
                            <View
                                style={[
                                    styles.tableCell,
                                    {
                                        borderRight: "none",
                                        fontFamily: "Times-Bold",
                                    },
                                ]}
                            >
                                <Text>2.</Text>
                                <Text style={{ paddingTop: 30 }}>
                                    ADSA(C)/ ADSA (T.S.)/ADSA (H)/ Coordinator,
                                    NSS, NCC
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Sanction / Not Sanctioned with signature */}
                <View style={{ marginTop: 5 }}>
                    <Text style={{ fontFamily: "Times-Bold", marginTop: 5 }}>
                        Verified by Dealing Assistant, DSA Office
                    </Text>
                    <Text style={{ fontFamily: "Times-Bold", marginTop: 5 }}>
                        Sanction / Not Sanctioned
                    </Text>
                    <Text style={{ marginTop: 50, fontFamily: "Times-Bold" }}>
                        Dean Students Affairs
                    </Text>
                </View>
                <Text
                    fixed
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages}`
                    }
                />
            </Page>
        </Document>
    );
};

export default Sanction;
