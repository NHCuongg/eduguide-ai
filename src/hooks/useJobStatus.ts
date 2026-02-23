"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

interface UseJobStatusResult {
    status: JobStatus | null;
    result: any | null;
    error: string | null;
}

export function useJobStatus(jobId: string | null): UseJobStatusResult {
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setStatus(null);
            setResult(null);
            setError(null);
            return;
        }

        setStatus("pending");

        // Lắng nghe qua Supabase Broadcast / Postgres Changes
        // Ở ví dụ này, mình giả định backend phát broadcast event vào room 'jobs'
        const channel = supabase.channel(`job_${jobId}`)
            .on(
                'broadcast',
                { event: 'status_update' },
                (payload) => {
                    console.log('Nhận được update từ backend:', payload);
                    if (payload.status) setStatus(payload.status);
                    if (payload.result) setResult(payload.result);
                    if (payload.error) setError(payload.error);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Đã kết nối Realtime chờ kết quả Job ${jobId}`);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [jobId]);

    return { status, result, error };
}
