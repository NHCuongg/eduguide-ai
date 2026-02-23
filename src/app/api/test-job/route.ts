import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        // Tạo 1 ID ngẫu nhiên cho job (hoặc dùng CUID/UUID)
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Đẩy task vào Inngest (Fire and Forget)
        await inngest.send({
            name: "test/hello.world",
            data: { name, jobId },
        });

        // Phản hồi HTTP 202 ngay lấp tức cho Client
        return NextResponse.json(
            { message: "Job accepted", jobId },
            { status: 202 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to queue job" },
            { status: 500 }
        );
    }
}
