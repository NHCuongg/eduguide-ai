"use client";

import { useState } from "react";
import { useJobStatus } from "@/hooks/useJobStatus";

export default function TestAsyncPage() {
    const [jobId, setJobId] = useState<string | null>(null);
    const { status, result } = useJobStatus(jobId);

    const startJob = async () => {
        setJobId(null);
        const res = await fetch("/api/test-job", {
            method: "POST",
            body: JSON.stringify({ name: "User" })
        });

        const data = await res.json();
        setJobId(data.jobId);
    };

    return (
        <div className="p-8 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Thử nghiệm Bất đồng bộ (Async Flow)</h1>
            <p className="text-gray-500">
                Click để gọi API. Backend sẽ lập tức trả về &lsquo;HTTP 202&rsquo; và &lsquo;jobId&rsquo;.
                Sau khoảng 3 giây, Inngest Worker chạy xong sẽ bắn Realtime event về.
            </p>

            <button
                onClick={startJob}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={status === "pending"}
            >
                {status === "pending" ? "Đang xử lý ngầm..." : "Bắt đầu Background Task"}
            </button>

            <div className="p-4 border rounded border-gray-200 mt-4 space-y-2">
                <p><strong>Job ID:</strong> {jobId || "Chưa có"}</p>
                <p><strong>Trạng thái:</strong> {status || "Chưa có"}</p>

                {status === "completed" && (
                    <div className="bg-green-50 p-2 text-green-800 rounded">
                        <strong>Kết quả từ Worker:</strong> {result?.message}
                    </div>
                )}
            </div>
        </div>
    );
}
