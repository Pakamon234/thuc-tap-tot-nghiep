import React, { useState, useEffect } from 'react';
import {Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Building2,
} from 'lucide-react';
import { cn } from '../lib/utils'; // Đảm bảo utils.js đã có `cn`

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    role: '',
    apartmentNumber: '',
  });

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Người dùng';
    const role = localStorage.getItem('loaiTaiKhoan'); // 'BQL' | 'resident'
    const apartment = localStorage.getItem('canHo') || '';

    setUser({ name, role, apartmentNumber: apartment });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setSidebarOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const BQLMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: Users, label: 'Quản lý cư dân', path: '/residents' },
    { icon: Settings, label: 'Dịch vụ & hợp đồng', path: '/services' },
    { icon: FileText, label: 'Quản lý hóa đơn', path: '/invoices' },
    { icon: BarChart3, label: 'Báo cáo thanh toán', path: '/reports' },
  ];

  const residentMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: FileText, label: 'Hợp đồng của tôi', path: '/my-contracts' },
    { icon: CreditCard, label: 'Thanh toán', path: '/payments' },
    { icon: Bell, label: 'Thông báo', path: '/notifications' },
  ];

  const menuItems = user.role === 'BQL' ? BQLMenuItems : residentMenuItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row justify-start">
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">QuanLyChungCu</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">
                {user.role === 'BQL'
                  ? 'Ban quản lý'
                  : `Căn hộ ${user.apartmentNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

{/* Main content */}
 <div className="flex-1 p-6 overflow-x-auto">
      <Outlet />  {/* <-- Hiển thị nội dung route con như Dashboard */}
    </div>
  </div>
  );
};

export default Layout;
// import React, { useState, useEffect } from 'react';
// import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Home,
//   Users,
//   FileText,
//   CreditCard,
//   BarChart3,
//   Settings,
//   Bell,
//   Menu,
//   X,
//   LogOut,
//   Building2,
//   ChevronDown, // Icon cho dropdown
// } from 'lucide-react';
// import { cn } from '../lib/utils'; // Đảm bảo utils.js đã có `cn`

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [user, setUser] = useState({
//     name: '',
//     role: '',
//     apartmentNumber: '',
//   });
//   const [isResidentsMenuOpen, setIsResidentsMenuOpen] = useState(false); // Trạng thái dropdown
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const name = localStorage.getItem('userName') || 'Người dùng';
//     const role = localStorage.getItem('loaiTaiKhoan'); // 'BQL' | 'resident'
//     const apartment = localStorage.getItem('canHo') || '';

//     setUser({ name, role, apartmentNumber: apartment });
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setSidebarOpen(false);
//     navigate('/login');
//   };

//   const isActive = (path) => location.pathname === path;

//   const BQLMenuItems = [
//     { icon: Home, label: 'Trang chủ', path: '/dashboard' },
//     { icon: Users, label: 'Quản lý cư dân', path: '/residents' },
//     { icon: Settings, label: 'Dịch vụ & hợp đồng', path: '/services' },
//     { icon: FileText, label: 'Quản lý hóa đơn', path: '/invoices' },
//     { icon: BarChart3, label: 'Báo cáo thanh toán', path: '/reports' },
//   ];

//   const residentMenuItems = [
//     { icon: Home, label: 'Trang chủ', path: '/dashboard' },
//     { icon: FileText, label: 'Hợp đồng của tôi', path: '/my-contracts' },
//     { icon: CreditCard, label: 'Thanh toán', path: '/payments' },
//     { icon: Bell, label: 'Thông báo', path: '/notifications' },
//   ];

//   const residentsSubMenuItems = [
//     { label: 'Quản lý tài khoản', path: '/account-management' },
//     { label: 'Quản lý cư dân', path: '/manage-residents' },
//     { label: 'Quản lý ban quản lý', path: '/manage-bql' },
//   ];

//   const menuItems = user.role === 'BQL' ? BQLMenuItems : residentMenuItems;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-row justify-start">
//       {/* Overlay when sidebar is open */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={cn(
//           'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         )}
//       >
//         <div className="flex items-center justify-between h-16 px-6 border-b">
//           <div className="flex items-center space-x-2">
//             <Building2 className="h-8 w-8 text-primary" />
//             <h1 className="text-xl font-bold text-gray-900">QuanLyChungCu</h1>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* User info */}
//         <div className="px-6 py-4 border-b bg-blue-50">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//               {user.name.charAt(0)}
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{user.name}</p>
//               <p className="text-xs text-gray-500">
//                 {user.role === 'BQL'
//                   ? 'Ban quản lý'
//                   : `Căn hộ ${user.apartmentNumber}`}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation menu */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setSidebarOpen(false)}
//                 className={cn(
//                   'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
//                   isActive(item.path)
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 )}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}

//           {/* Dropdown for resident menu */}
//           {user.role === 'BQL' && (
//             <div>
//               <button
//                 onClick={() => setIsResidentsMenuOpen(!isResidentsMenuOpen)}
//                 className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full"
//               >
//                 <Users className="h-5 w-5" />
//                 <span>Quản lý cư dân</span>
//                 <ChevronDown className={`h-5 w-5 transform ${isResidentsMenuOpen ? 'rotate-180' : ''}`} />
//               </button>
//               {isResidentsMenuOpen && (
//                 <div className="ml-6 space-y-2">
//                   {residentsSubMenuItems.map((subItem) => (
//                     <Link
//                       key={subItem.path}
//                       to={subItem.path}
//                       onClick={() => setSidebarOpen(false)}
//                       className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                     >
//                       {subItem.label}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <LogOut className="h-5 w-5" />
//             <span>Đăng xuất</span>
//           </button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-6 overflow-x-auto">
//         <Outlet />  {/* Hiển thị nội dung route con như Dashboard */}
//       </div>
//     </div>
//   );
// };

// export default Layout;
