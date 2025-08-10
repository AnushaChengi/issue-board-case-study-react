import React , {useEffect}from "react";
import { RecentlyAccessed } from "../RecentlyAccessed/RecentlyAccessed";
import { useRecentStore } from "../../store/useRecentStore";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
    const { loadFromStorage } = useRecentStore();
    
    useEffect(() => {
        if(showSidebar){
            loadFromStorage();
        }
    }, [loadFromStorage, showSidebar]);

  return (
    <div className={styles.wrapper}>

      <div className={styles.body}>
    
        {showSidebar && (
          <aside className={styles.sidebar}>
            <RecentlyAccessed />
          </aside>
        )}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};
