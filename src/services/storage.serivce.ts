import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TravelEntry } from "../types";

const LOG_KEY = "TravelDiaryLogs";

export const LogService = {
  async getAll(): Promise<TravelEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(LOG_KEY);
      return raw ? (JSON.parse(raw) as TravelEntry[]) : [];
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return [];
    }
  },

  async add(newLog: TravelEntry): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = [newLog, ...existing];
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const existing = await this.getAll();
      const filtered = existing.filter((log) => log.id !== id);
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to remove log;", error);
    }
  },
};
