import React from "react";
import { Issue } from "../../types";
import styles from "./BoardFilters.module.css";

interface BoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterAssignee: string;
  onAssigneeChange: (value: string) => void;
  filterSeverity: string;
  onSeverityChange: (value: string) => void;
  allIssues: Issue[];
}

export const BoardFilters: React.FC<BoardFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterAssignee,
  onAssigneeChange,
  filterSeverity,
  onSeverityChange,
  allIssues
}) => {
  const uniqueAssignees = Array.from(new Set(allIssues.map(i => i.assignee)));
  const uniqueSeverities = Array.from(new Set(allIssues.map(i => i.severity)));

  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <label className={styles.label}>Search</label>
        <input
          className={styles.input}
          type="text"
          placeholder="By title or tag..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Assignee</label>
        <select
          className={styles.select}
          value={filterAssignee}
          onChange={(e) => onAssigneeChange(e.target.value)}
        >
          <option value="">All</option>
          {uniqueAssignees.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Severity</label>
        <select
          className={styles.select}
          value={filterSeverity}
          onChange={(e) => onSeverityChange(e.target.value)}
        >
          <option value="">All</option>
          {uniqueSeverities.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
