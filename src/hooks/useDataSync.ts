import { useEffect } from 'react';
import { useERPStore } from '@/stores/erpStore';
import {TIME} from "@/utils/constants.ts";

export function useDataSync(intervalMs: number = 2 * TIME.MINUTE) {
    const fetchAllData = useERPStore((state) => state.fetchAllData);
    const fetchAllAnalytics = useERPStore((state) => state.fetchAllAnalytics);

    useEffect(() => {
        fetchAllData();
        fetchAllAnalytics();

        const timer = setInterval(() => {
            if (!document.hidden) {
                fetchAllData();
                fetchAllAnalytics();
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [intervalMs, fetchAllData, fetchAllAnalytics]);
}