import { filterAndSortIssues } from "./filterAndSortIssues";
import { Issue } from "../types";

const sampleIssues: Issue[] = [
  {
    id: "1",
    title: "Fix login bug",
    status: "Backlog",
    priority: "high",
    severity: 3,
    createdAt: "2025-07-09T10:00:00Z",
    assignee: "alice",
    tags: ["auth", "bug"],
    userDefinedRank: 1
  },
  {
    id: "2",
    title: "Add dark mode",
    status: "Done",
    priority: "low",
    severity: 1,
    createdAt: "2025-07-07T09:30:00Z",
    assignee: "bob",
    tags: ["ui"],
    userDefinedRank: 0
  },
  {
    id: "3",
    title: "Improve dashboard loading",
    status: "In Progress",
    priority: "medium",
    severity: 2,
    createdAt: "2025-07-08T12:00:00Z",
    assignee: "carol",
    tags: ["performance"],
    userDefinedRank: 0
  }
];

describe("filterAndSortIssues", () => {
  it("filters by search term (title)", () => {
    const result = filterAndSortIssues(sampleIssues, "login", "", "");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Fix login bug");
  });

  it("filters by search term (tags)", () => {
    const result = filterAndSortIssues(sampleIssues, "performance", "", "");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Improve dashboard loading");
  });

  it("filters by assignee", () => {
    const result = filterAndSortIssues(sampleIssues, "", "bob", "");
    expect(result.length).toBe(1);
    expect(result[0].assignee).toBe("bob");
  });

  it("filters by severity", () => {
    const result = filterAndSortIssues(sampleIssues, "", "", "3");
    expect(result.length).toBe(1);
    expect(result[0].severity).toBe(3);
  });

  it("sorts by priority score (highest first)", () => {
    const result = filterAndSortIssues(sampleIssues, "", "", "");
    expect(result[0].severity).toBeGreaterThanOrEqual(result[1].severity);
  });

  it("uses tie-breaker: newer issues first", () => {
    const sameScoreIssues: Issue[] = [
      { ...sampleIssues[0], createdAt: "2025-07-09T10:00:00Z", severity: 2, userDefinedRank: 0 },
      { ...sampleIssues[1], createdAt: "2025-07-10T10:00:00Z", severity: 2, userDefinedRank: 0 }
    ];
    const result = filterAndSortIssues(sameScoreIssues, "", "", "");
    expect(result[0].createdAt).toBe("2025-07-10T10:00:00Z");
  });
});
