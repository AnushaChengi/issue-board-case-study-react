import React from "react";
import { useRecentStore } from "../../store/useRecentStore";
import styles from './RecentlyAccessed.module.css';

export const RecentlyAccessed: React.FC = () => {
  const { recentIssues } = useRecentStore();

  if (!recentIssues.length) return null;

  return (
    <div className={styles.sidebar}>
    <h3>Recently Accessed</h3>
    {recentIssues.length === 0 ? (
      <p className={styles.issueMeta}>No recently viewed issues.</p>
    ) : (
      <div className={styles.timeline}>
        {recentIssues.map((issue, index) => (
          <div className={styles.item} key={issue.id}>
            <div className={styles.dot} />
            <div className={styles.content}>
              <strong>{issue.title}</strong>
              <p>{issue.assignee} • Priority: {issue.priority}</p>
            </div>
            {index !== recentIssues.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </div>
    )}
  </div>
  );
};
