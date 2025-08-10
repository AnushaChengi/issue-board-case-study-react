import React, { useState, useEffect, useMemo} from 'react';
import { toast } from "react-toastify";

import { Issue } from "../../types";

import { BoardColumn } from '../../components/BoardColumn/BoardColumn';
import { BoardFilters } from "../../components/BoardFiltters/BoardFilters";
import { Layout } from "../../components/Layout/Layout";

import { useIssueStore } from "../../store/useIssueStore";
import { useSettingsStore } from '../../store/useSettingsStore';

import { filterAndSortIssues } from "../../utils/filterAndSortIssues";

import { currentUser } from "../../constants/currentUser"; 

import styles from "./BoardPage.module.css";


export const BoardPage = () => {
    const { issues, lastSyncedTime, fetchIssuesData, updateIssue } = useIssueStore();
    const pollingInterval = useSettingsStore(state => state.pollingInterval);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAssignee, setFilterAssignee] = useState("");
    const [filterSeverity, setFilterSeverity] = useState("");
    const columns: { title: string; status: Issue["status"] }[] = [
        { title: "Backlog", status: "Backlog" },
        { title: "In Progress", status: "In Progress" },
        { title: "Done", status: "Done" },
      ];

    const handleDrop = (status: "Backlog" | "In Progress" | "Done") => {
        return (issueId: string) => {
            if (currentUser.role !== "admin") {
                toast.warn("You have read-only access");
                return;
            }
          const originalIssue = issues.find((i) => i.id === issueId);
          if (!originalIssue || originalIssue.status === status) return;
    
          // Optimistic UI update
          updateIssue(issueId, { status });
    
          // Undo toast when clicked
          const undoId = toast.info(`Moved to ${status}. Click on this to Undo the move`, {
            autoClose: 10000,
            onClick: () => {
              updateIssue(issueId, { status: originalIssue.status });
              toast.dismiss(undoId);
            },
          });
        };
    };

    useEffect(()=>{
        fetchIssuesData()
        const interval = setInterval(() => {
            fetchIssuesData()
        }, pollingInterval) //get the polling interval value from settings

        return () => clearInterval(interval)
    }, [fetchIssuesData, pollingInterval])
    
    const filteredIssues = useMemo(() => {
        return filterAndSortIssues(
        issues,
        searchTerm,
        filterAssignee,
        filterSeverity
        );
    }, [issues, searchTerm, filterAssignee, filterSeverity]);

    return (
        <Layout showSidebar>
            <div style={{ padding: "1rem" }}>
                <div className={styles.pageHeader}>
                    <h1>Issue Board</h1>
                    <p>Last synced: {lastSyncedTime || "Loading..."}</p>
                </div>
                
                {/* Issue Board Filters */}
                <BoardFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterAssignee={filterAssignee}
                    onAssigneeChange={setFilterAssignee}
                    filterSeverity={filterSeverity}
                    onSeverityChange={setFilterSeverity}
                    allIssues={issues}
                />
                {/* Issue Board Columns */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    {columns.map(({ title, status }) => (
                        <BoardColumn
                        key={status}
                        title={title}
                        issues={filteredIssues.filter((i) => i.status === status)}
                        onDropIssue={handleDrop(status)}
                        />
                    ))}
                </div>
            </div>
        </Layout>
        
      );
};

