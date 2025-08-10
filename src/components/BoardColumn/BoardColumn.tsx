import React from 'react'
import { useNavigate } from "react-router-dom";
import { Issue } from '../../types'
import { currentUser } from '../../constants/currentUser' 
import { useRecentStore } from "../../store/useRecentStore";
import {toast} from 'react-toastify'
import styles from './BoardColumn.module.css'; 
import { IssueCard } from '../IssueCard/IssueCard';


interface BoardColumnProps{
    title: string;
    issues: Issue[];
    onDropIssue: (issueId: string) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({title, issues, onDropIssue}) => {
  const { addRecentIssue } = useRecentStore();
  const navigate = useNavigate();
  const isAdmin = currentUser.role === "admin"


  //handle issue card hover
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  //handle issue card drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const issueId = event.dataTransfer.getData("text/plain");
    if (issueId) {
      onDropIssue(issueId);
    }
  };

  // Handle drag start for an issue card
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
      issueId: string
    ) => {
      event.dataTransfer.setData("text/plain", issueId);
  }

  const onDragStart= (e: React.DragEvent<HTMLDivElement>, issue: any) => {
    if (!isAdmin) {
      e.preventDefault();
      toast.warn("You have read-only access");
      return;
    }
    handleDragStart(e, issue.id);
  }

  const onCardClick = (issue : Issue) => {
    addRecentIssue(issue); 
    navigate(`/issue/${issue.id}`);
  }

  return(
    <div
      className={styles.column}
      onDragOver={isAdmin ? handleDragOver : undefined}
      onDrop={isAdmin ? handleDrop : undefined}
    >
      <h2 className={styles.columnTitle}>{title}</h2>
      {issues.length === 0 ? (
        <p className={styles.emptyText}>No issues</p>
      ) : (
        issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            isAdmin={isAdmin}
            onClick={onCardClick}
            onDragStart={onDragStart}
          />
        ))
      )}
    </div>
  )
}