import { Issue } from "../types";
import dayjs from "dayjs";

export function filterAndSortIssues(
  issues: Issue[],
  searchTerm: string,
  filterAssignee: string,
  filterSeverity: string
): Issue[] {
  return issues
    .filter((issue) => {
      // Search by title or tags
      const searchMatch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filter by assignee
      const assigneeMatch = filterAssignee
        ? issue.assignee === filterAssignee
        : true;

      // Filter by severity
      const severityMatch = filterSeverity
        ? issue.severity === Number(filterSeverity)
        : true;

      return searchMatch && assigneeMatch && severityMatch;
    })
    .sort((a, b) => {
      // Calculate priority score
      const daysSinceCreatedA = dayjs().diff(dayjs(a.createdAt), "day");
      const daysSinceCreatedB = dayjs().diff(dayjs(b.createdAt), "day");

      const scoreA =
        a.severity * 10 +
        daysSinceCreatedA * -1 +
        (a.userDefinedRank || 0);
      const scoreB =
        b.severity * 10 +
        daysSinceCreatedB * -1 +
        (b.userDefinedRank || 0);

      // Higher score first
      if (scoreB !== scoreA) return scoreB - scoreA;

      // Tie-breaker, we will consider newer first
      return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
    });
}
