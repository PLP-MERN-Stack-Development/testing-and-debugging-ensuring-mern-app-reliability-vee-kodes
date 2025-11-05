import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home"
import NewBugPage from "./pages/NewBugPage";
import BugListPage from "./pages/BugListPage";
import EditBug from "./pages/EditBug";

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-bug" element={<NewBugPage />} />
            <Route path="/bug-list" element={<BugListPage />} />
            <Route path="/edit/:id" element={<EditBug />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;