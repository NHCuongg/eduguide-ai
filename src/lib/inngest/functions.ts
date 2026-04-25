import { inngest } from "./client";
import { resend } from "../resend";

export const sendWelcomeEmail = inngest.createFunction(
    {
        id: "send-welcome-email",
        retries: 3,
        onFailure: async ({ event, error }) => {
            const original = (event.data as { event?: { data?: { email?: string; name?: string } } })?.event?.data
            console.error("[welcome-email] permanently failed after retries", {
                email: original?.email,
                name: original?.name,
                message: error?.message ?? String(error),
            })
        },
    },
    { event: "user/signup" },
    async ({ event, step }) => {
        const { email, name } = event.data;

        await step.run("send-email-via-resend", async () => {
            if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_dummy')) {
                console.log(`[MOCK EMAIL] To: ${email}, Subject: Welcome to EduGuide AI, ${name}!`);
                return { simulated: true, email };
            }

            const { data, error } = await resend.emails.send({
                from: 'EduGuide AI <onboarding@eduguide.ai>',
                to: [email],
                subject: `Welcome to EduGuide AI, ${name}!`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2>Welcome to EduGuide AI, ${name}!</h2>
                        <p>We are thrilled to have you onboard.</p>
                        <p>Your journey to a personalized curriculum begins now. If you haven't already, please complete your onboarding assessment so we can tailor the best experience for you.</p>
                        <br/>
                        <p>Cheers,</p>
                        <p><strong>The EduGuide AI Team</strong></p>
                    </div>
                `,
            });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        });

        return { success: true, user: email };
    }
);
