import React from "react";
import { Issue } from "../../types";
import styles from "./IssueCard.module.css";

interface IssueCardProps {
  issue: Issue;
  isAdmin: boolean;
  onClick: (issue: Issue) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  isAdmin,
  onClick,
  onDragStart,
}) => {
  return (
    <div
      className={`${styles.card} ${isAdmin ? styles.cardGrab : ''}`}
      draggable={isAdmin}
      onDragStart={(e) => onDragStart(e, issue)}
      title={!isAdmin ? "Read only access" : undefined}
      onClick={() => onClick(issue)}
    >
      <div className={styles.cardTitleWrapper}>
          <strong className={styles.cardTitle}>{issue.title}</strong>
          {isAdmin ? <span className={styles.dragHandle}
                title="Drag to move">☰</span> : ''}
      </div>
      <p className={styles.cardMeta}>Assignee: {issue.assignee}</p>
      <p className={styles.cardSubmeta}>
        Priority: {issue.priority} | Severity: {issue.severity}
      </p>
    </div>
  );
};