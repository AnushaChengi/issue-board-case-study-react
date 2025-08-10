import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIssueStore } from "../../store/useIssueStore";
import { toast } from "react-toastify";
import { Layout } from "../../components/Layout/Layout";
import { currentUser } from "../../constants/currentUser";
import styles from './IssueDetailPage.module.css';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, updateIssue, fetchIssuesData } = useIssueStore();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      if (issues.length === 0) {
        await fetchIssuesData();
      }
      setLoading(false);
    };
    loadData();
  }, [issues.length, fetchIssuesData]);


  const issue = issues.find((i) => i.id === id);

// Issue is loadng
  if (loading) {
    return (
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
        <div>Issue Loading</div>
      </div>
    );
  }
// Issue match not found
  if (!issue) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Issue not found</h2>
        <button onClick={() => navigate(-1)} className={styles.buttonSecondary}>Go Back</button>
      </div>
    );
  }

  //Resolve the issue ticket
  const handleResolve = () => {
    if (currentUser.role !== "admin") {
      toast.warn("You have read-only access");
      return;
    }
    if (issue.status === "Done") {
      toast.info("Issue already resolved");
      return;
    }
    updateIssue(issue.id, { status: "Done" });
    toast.success("Issue marked as resolved");
  };

  return (
    <Layout showSidebar>
        <div className={styles.layoutWrapper}>
          <h1>{issue.title}</h1>
          <p><strong>Status:</strong> {issue.status}</p>
          <p><strong>Priority:</strong> {issue.priority}</p>
          <p><strong>Severity:</strong> {issue.severity}</p>
          <p><strong>Assignee:</strong> {issue.assignee}</p>
          <p><strong>Tags:</strong> {issue.tags?.join(", ")}</p>
          <p><strong>Created At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>

          <button
              onClick={handleResolve}
              disabled={currentUser.role !== "admin" || issue.status === "Done"}
              className={styles.button}
          >
              Mark as Resolved
          </button>
          <button onClick={() => navigate(-1)} className={styles.buttonSecondary}>Go Back</button>
        </div>
    </Layout>
    
  );
};
