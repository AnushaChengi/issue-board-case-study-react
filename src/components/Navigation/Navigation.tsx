import React from 'react';
import { Link } from 'react-router-dom';
import styles  from './Navigation.module.css'

export const Navigation = () => (
    <nav className={styles.navigation}>
        <Link to="/board" className={styles.nagivationItem}>Board</Link>
        <Link to="/settings" className={styles.nagivationItem}>Settings</Link>
    </nav>
);