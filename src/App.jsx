import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import GoalFoodInput from './pages/GoalFoodInput';
import NearbyHealthyOptions from './pages/NearbyHealthyOptions';
import AiAnalysisResults from './pages/AiAnalysisResults';
import ProfileSettings from './pages/ProfileSettings';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/input" element={<GoalFoodInput />} />
        <Route path="/nearby" element={<NearbyHealthyOptions />} />
        <Route path="/analysis" element={<AiAnalysisResults />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </Router>
  );
}
