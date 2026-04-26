import { inngest } from "./client";
import { resend } from "../resend";

function getAppUrl() {
    return process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3000";
}

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
                if (process.env.NODE_ENV !== 'production') {
                    console.info(`[MOCK EMAIL] welcome → ${email} (${name})`);
                }
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

export const sendPasswordResetEmail = inngest.createFunction(
    {
        id: "send-password-reset-email",
        retries: 3,
        onFailure: async ({ event, error }) => {
            const original = (event.data as { event?: { data?: { email?: string } } })?.event?.data
            console.error("[password-reset-email] permanently failed after retries", {
                email: original?.email,
                message: error?.message ?? String(error),
            })
        },
    },
    { event: "user/password-reset" },
    async ({ event, step }) => {
        const { email, token } = event.data;
        const resetUrl = new URL("/reset-password", getAppUrl());
        resetUrl.searchParams.set("token", token);

        await step.run("send-password-reset-via-resend", async () => {
            if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_dummy')) {
                if (process.env.NODE_ENV !== 'production') {
                    console.info(`[MOCK EMAIL] password-reset → ${email}: ${resetUrl.toString()}`);
                }
                return { simulated: true, email };
            }

            const { data, error } = await resend.emails.send({
                from: 'EduGuide AI <security@eduguide.ai>',
                to: [email],
                subject: 'Reset your EduGuide AI password',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2>Reset your EduGuide AI password</h2>
                        <p>We received a request to reset your password.</p>
                        <p><a href="${resetUrl.toString()}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">Reset password</a></p>
                        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
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
