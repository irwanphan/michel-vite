import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ConfigScreen from './src/screens/Config';
import MainScreen from '@renderer/screens/Main';

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/config" element={<ConfigScreen />} />
      </Routes>
    </Router>
  );
}
