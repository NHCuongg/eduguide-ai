import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { helloWorld, sendWelcomeEmail } from "@/lib/inngest/functions";

// Cấu hình Next.js App Router handler cho Inngest
// API route này là nơi Inngest Server sẽ gọi đến (webhook)
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        helloWorld, // Thêm các function khác vào mảng này khi project phát triển
        sendWelcomeEmail,
    ],
});
