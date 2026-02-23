import { inngest } from "./client";
import { supabaseAdmin } from "../supabase-admin";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        // 1. Dùng step.sleep để mô phỏng tác vụ ngầm tốn thời gian (ví dụ: AI generating)
        await step.sleep("wait-a-moment", "3s");

        // 2. Chạy logic
        const jobId = event.data.jobId;
        const message = `Xin chào ${event.data.name || "bạn"}! Mình là Inngest Worker đã chạy ngầm xong.`;
        const result = { message, timestamp: new Date().toISOString() };

        // 3. Bắn event realtime qua Supabase báo cho Frontend
        if (jobId) {
            await step.run("broadcast-result", async () => {
                const channel = supabaseAdmin.channel(`job_${jobId}`);
                await channel.send({
                    type: "broadcast",
                    event: "status_update",
                    payload: { status: "completed", result },
                });
                // Xóa channel sau khi gửi để tránh rác channel trên Supabase
                supabaseAdmin.removeChannel(channel);
            });
        }

        return result;
    }
);
