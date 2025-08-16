import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import JobsPage from "./JobPage";

// Wrapper to protect JobsPage route
function ProtectedJobsPage({ token, setToken }) {
  if (!token) return <Navigate to="/login" />;
  return <JobsPage setToken={setToken} />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />
        <Route
          path="/jobs"
          element={<ProtectedJobsPage token={token} setToken={setToken} />}
        />
        <Route path="*" element={<Navigate to={token ? "/jobs" : "/login"} />} />
      </Routes>
    </Router>
  );
}
