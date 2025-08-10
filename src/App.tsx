import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage/IssueDetailPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { Navigation } from './components/Navigation/Navigation';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

export const App = () => {

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/board" element={<BoardPage />} />
            <Route path="/issue/:id" element={<IssueDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/board" />} />
          </Routes>
          <ToastContainer position="bottom-left" />

        </Router>
      </ErrorBoundary>
    </ThemeProvider>
      
  );
}