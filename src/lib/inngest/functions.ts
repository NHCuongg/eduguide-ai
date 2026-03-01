import { inngest } from "./client";
import { supabaseAdmin } from "../supabase-admin";
import { resend } from "../resend";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        
        await step.sleep("wait-a-moment", "3s");

        const jobId = event.data.jobId;
        const message = `Xin chào ${event.data.name || "bạn"}! Mình là Inngest Worker đã chạy ngầm xong.`;
        const result = { message, timestamp: new Date().toISOString() };

        if (jobId) {
            await step.run("broadcast-result", async () => {
                const channel = supabaseAdmin.channel(`job_${jobId}`);
                await channel.send({
                    type: "broadcast",
                    event: "status_update",
                    payload: { status: "completed", result },
                });
                
                supabaseAdmin.removeChannel(channel);
            });
        }

        return result;
    }
);

export const sendWelcomeEmail = inngest.createFunction(
    { id: "send-welcome-email" },
    { event: "user/signup" },
    async ({ event, step }) => {
        const { email, name } = event.data;

        await step.run("send-email-via-resend", async () => {
            try {
                
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
            } catch (error) {
                console.error("Failed to send welcome email:", error);
                throw error;
            }
        });

        return { success: true, user: email };
    }
);
