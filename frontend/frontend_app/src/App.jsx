/**
 * App.jsx
 * Root component — configures React Router and maps URL paths to pages.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Root from "@/pages/Root";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Test from "@/pages/Test";
import Play from "@/pages/Play";

/**
 * App
 *
 * Top-level component that configures client-side routing.
 * Each route renders a page-level component.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Routes defines the mapping between paths and components */}
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/test" element={<Test />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
