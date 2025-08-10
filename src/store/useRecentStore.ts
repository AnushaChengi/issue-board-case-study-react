import { create } from 'zustand'
import { Issue } from '../types'

interface RecentIssueStore{
    recentIssues: Issue[];
    addRecentIssue: (issue: Issue) => void;
    loadFromStorage: () => void;
}

export const useRecentStore = create<RecentIssueStore>((set,get)=> ({
    recentIssues: [],

    addRecentIssue: (issue) => {
        const currentIssues = get().recentIssues;  
        // Remove if it already exists to avoid duplication
        const filteredIssue = currentIssues.filter((item: Issue) => issue.id !== item.id)
        //Add to front, keep only recent 5
        const updated = [issue, ...filteredIssue].slice(0, 5);
        //Set it to the store
        set({recentIssues : updated})
        //Set in local storage
        localStorage.setItem("recentIssues", JSON.stringify(updated))
    },

    loadFromStorage: () => {
        const stored = localStorage.getItem("recentIssues");
        if (stored) {
          try {
            const parsed: Issue[] = JSON.parse(stored);
            set({ recentIssues: parsed });
          } catch (e) {
            console.error("Failed to parse recent issues from storage", e);
          }
        }
    }

}))