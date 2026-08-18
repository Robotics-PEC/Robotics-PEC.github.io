import PageSection from "@/components/layout/PageSection";
import FeedbackForm, {
    FeedbackData,
} from "@/components/FeedbackForm";

export default function FeedbackPage() {
    const handleContinue = (
        data: FeedbackData
    ) => {
        /*
         * For now, we are only building the form.
         *
         * Later this is where we can:
         * 1. Create/start the Dino game session.
         * 2. Pass the applicant information to the game.
         * 3. Add fingerprinting / one-attempt protection.
         * 4. Eventually save the final result to Google Sheets.
         */

        console.log(
            "Ready to start Dino game:",
            data
        );
    };

    return (
        <section className="py-24">
            <PageSection
                title="Feedback Form"
                subtitle="A tiny surprise awaits 👀"
            >
                <FeedbackForm
                    onContinue={
                        handleContinue
                    }
                />
            </PageSection>
        </section>
    );
}