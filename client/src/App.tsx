import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { CollabRoomsPage } from './pages/CollabRoomsPage';
import { CodeReviewPage } from './pages/CodeReviewPage';
import { DsaPracticePage } from './pages/DsaPracticePage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';

// App Layout wrapper with Sidebar & Navbar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Route title helper
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview';
      case '/projects':
        return 'My Projects';
      case '/editor':
        return 'AI Code Editor Workspace';
      case '/playground':
        return 'AI Playground';
      case '/rooms':
        return 'Collaborative Coding Rooms';
      case '/review':
        return 'AI Code Review & Quality Audit';
      case '/dsa':
        return 'DSA Practice & Problem Catalog';
      case '/interview':
        return 'Technical Mock Interview';
      case '/analytics':
        return 'Learning Analytics';
      case '/settings':
        return 'Workspace Settings';
      default:
        return 'CodeBuddy AI Platform';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090B] text-zinc-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={getTitle()} />
        <main className="flex-1 overflow-y-auto bg-[#09090B]">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Main Workspace Routes */}
            <Route
              path="/"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <AppLayout>
                  <ProjectsPage />
                </AppLayout>
              }
            />
            <Route
              path="/editor"
              element={
                <AppLayout>
                  <EditorPage />
                </AppLayout>
              }
            />
            <Route
              path="/playground"
              element={
                <AppLayout>
                  <PlaygroundPage />
                </AppLayout>
              }
            />
            <Route
              path="/rooms"
              element={
                <AppLayout>
                  <CollabRoomsPage />
                </AppLayout>
              }
            />
            <Route
              path="/review"
              element={
                <AppLayout>
                  <CodeReviewPage />
                </AppLayout>
              }
            />
            <Route
              path="/dsa"
              element={
                <AppLayout>
                  <DsaPracticePage />
                </AppLayout>
              }
            />
            <Route
              path="/interview"
              element={
                <AppLayout>
                  <MockInterviewPage />
                </AppLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
};
export default App;
