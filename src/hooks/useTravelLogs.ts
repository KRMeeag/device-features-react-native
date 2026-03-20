import { useEffect, useState } from "react"
import type { TravelEntry } from "../types"
import { LogService } from "../services";

export const useTravelLogs = () => {
    const [logs, setLogs] = useState<TravelEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async() => {
        const data = await LogService.getAll();
        setLogs(data)
        setLoading(false);
    }

    useEffect(() => {
      fetchLogs();
    }, [])
    
    const saveLog = async(log: TravelEntry) => {
        await LogService.add(log);
        await fetchLogs();
    }

    const deleteLog = async(id: string) => {
        await LogService.remove(id);
        await fetchLogs();
    }

    return { logs, loading, saveLog, deleteLog };
}