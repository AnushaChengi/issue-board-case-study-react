// import React from 'react';
// import { useSettingsStore } from "../store/useSettingsStore";
// import { useTheme } from "../context/ThemeContext";

// export const SettingsPage = () => {
//     const { pollingInterval, setPollingInterval } = useSettingsStore();
//     const { theme, toggleTheme } = useTheme();


//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const value = parseInt(e.target.value);
//       setPollingInterval(value);
//     };
//     return (
//         <>
//             <div style={{ padding: "1rem" }}>
//             <h2>Settings</h2>
//             <label>
//             Polling Interval:
//             <select value={pollingInterval} onChange={handleChange} style={{ marginLeft: "1rem" }}>
//                 <option value={5000}>5 seconds</option>
//                 <option value={10000}>10 seconds</option>
//                 <option value={30000}>30 seconds</option>
//                 <option value={60000}>60 seconds</option>
//             </select>
//             </label>
//             </div>
//             <button onClick={toggleTheme}>
//                 Switch to {theme === "light" ? "Dark" : "Light"} Mode
//             </button>
//         </>
//   )
// };
import React from "react";
import styles from "./SettingsPage.module.css";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTheme } from "../../context/ThemeContext";
import { Layout } from "../../components/Layout/Layout";

export const SettingsPage: React.FC = () => {
  const { pollingInterval, setPollingInterval } = useSettingsStore();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPollingInterval(parseInt(e.target.value, 10));
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Settings</h2>
          </div>

          <div className={styles.row}>
            {/* Polling interval */}
            <div className={styles.field}>
              <span className={styles.label}>Polling Interval</span>
              <select
                className={styles.select}
                value={pollingInterval}
                onChange={handleChange}
              >
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
                <option value={60000}>60 seconds</option>
              </select>
            </div>

            {/* Theme toggle */}
            <div className={styles.field}>
              <span className={styles.label}>Theme</span>
              <div className={styles.toggleWrap}>
                <span className={styles.toggleText}>
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
                <label className={styles.toggle} aria-label="Toggle theme">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
