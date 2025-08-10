import { create } from "zustand";
import { Issue } from "../types";
import { mockFetchIssues, mockUpdateIssue } from "../utils/api";
import dayjs from "dayjs";
import  {toast} from 'react-toastify'

interface IssueStore {
  issues: Issue[];
  lastSyncedTime: string;
  fetchIssuesData: () => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  lastSyncedTime: "",

  // Fetch all issues and update last sync
  fetchIssuesData: async () => {
    try {
      const data = (await mockFetchIssues()) as Issue[];
      const currentIssues = get().issues;

      // Merge server data with local state to preserve optimistic updates
      const mergedData = data.map((serverIssueItem) => {
        const local = currentIssues.find((i) => i.id === serverIssueItem.id);
        return local ? { ...serverIssueItem, ...local } : serverIssueItem;
      });

      set({
        issues: mergedData, // new reference so React re-renders
        lastSyncedTime: dayjs().format("HH:mm:ss"),
      });
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      toast.error("Failed to fetch issues:")
    }
  },

  // Update a single issue
  updateIssue: async (id, updates) => {
    const originalIssues = get().issues;

    try {
      //Optimistically updating UI
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue.id === id ? { ...issue, ...updates } : issue
        ),
      }));
      const updated = (await mockUpdateIssue(id, updates)) as Issue;
      // Merge confirmed update back into state
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue.id === id ? { ...issue, ...updated } : issue
        ),
      }));
    } catch (error) {
      // Rollback showing toast message in case the server responds with error after the optiistic update - in real word scenerios
      set({ issues: originalIssues });
      toast.error("Failed to update issue. Changes were reverted.");
    }
  },
}));
