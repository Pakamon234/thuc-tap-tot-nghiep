import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DangKyForm from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyContracts from './pages/MyContracts';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<DangKyForm />} />

        {/* Các route có Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-contracts" element={<MyContracts />} />
          {/* Có thể thêm route con khác ở đây */}
        </Route>

        {/* Mặc định chuyển đến trang login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;













// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/Login';
// import DangKyForm from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Layout from './components/Layout';
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<DangKyForm />} />
//         {/* Thêm các route khác tại đây */}
//         <Route element={<Layout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           {/* Thêm route con tại đây */}
//           {/* <Route path="/residents" element={<Residents />} /> */}
//         </Route>
//         <Route path="/" element={<Login />} /> {/* Mặc định chuyển đến trang login */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
