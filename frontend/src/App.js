import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Thêm route con tại đây */}
          {/* <Route path="/residents" element={<Residents />} /> */}
        </Route>
        <Route path="/" element={<Login />} /> {/* Mặc định chuyển đến trang login */}
      </Routes>
    </Router>
  );
}

export default App;
