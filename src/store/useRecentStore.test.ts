import { act } from "@testing-library/react";
import { useRecentStore } from "./useRecentStore";
import { Issue } from "../types";

const sampleIssue: Issue = {
  id: "1",
  title: "Fix login bug",
  status: "Backlog",
  priority: "high",
  severity: 3,
  createdAt: "2025-07-09T10:00:00Z",
  assignee: "alice",
  tags: ["auth", "bug"],
  userDefinedRank: 0
};

describe("useRecentStore", () => {
  beforeEach(() => {
    // Clear Zustand state and localStorage before each test
    const { recentIssues } = useRecentStore.getState();
    useRecentStore.setState({ recentIssues: [] });
    localStorage.clear();
  });

  it("adds a new issue to recent list", () => {
    act(() => {
      useRecentStore.getState().addRecentIssue(sampleIssue);
    });
    const { recentIssues } = useRecentStore.getState();
    expect(recentIssues[0].id).toBe("1");
  });

  it("moves an existing issue to the top if clicked again", () => {
    const otherIssue = { ...sampleIssue, id: "2", title: "Dark mode" };
    act(() => {
      useRecentStore.getState().addRecentIssue(sampleIssue);
      useRecentStore.getState().addRecentIssue(otherIssue);
      useRecentStore.getState().addRecentIssue(sampleIssue); 
    });
    const { recentIssues } = useRecentStore.getState();
    expect(recentIssues[0].id).toBe("1"); // moved to top
  });

  it("keeps only the last 5 issues", () => {
    for (let i = 1; i <= 6; i++) {
      const issue = { ...sampleIssue, id: String(i), title: `Issue ${i}` };
      act(() => {
        useRecentStore.getState().addRecentIssue(issue);
      });
    }
    const { recentIssues } = useRecentStore.getState();
    expect(recentIssues.length).toBe(5);
    expect(recentIssues.find((i) => i.id === "1")).toBeUndefined(); // oldest removed
  });

  it("loads issues from localStorage", () => {
    const savedData = [sampleIssue];
    localStorage.setItem("recentIssues", JSON.stringify(savedData));

    act(() => {
      useRecentStore.getState().loadFromStorage();
    });

    const { recentIssues } = useRecentStore.getState();
    expect(recentIssues.length).toBe(1);
    expect(recentIssues[0].id).toBe("1");
  });
});
