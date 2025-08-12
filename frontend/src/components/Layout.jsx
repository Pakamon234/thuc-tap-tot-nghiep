// import React, { useState, useEffect } from 'react';
// import {Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
// } from 'lucide-react';
// import { cn } from '../lib/utils'; // Đảm bảo utils.js đã có cn

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     name: '',
//     role: '',
//     apartmentNumber: '',
//   });

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

// const BQLMenuItems = [
//   { icon: Home, label: 'Trang chủ', path: '/dashboard' },
//   {
//     icon: Users,
//     label: 'Quản lý người dùng',
//     path: '/user',
//     children: [
//       { label: 'Quản lý tài khoản', path: '/user/accounts' },
//       { label: 'Quản lý cư dân', path: '/user/residents' },
//       { label: 'Quản lý ban quản lý', path: '/user/managers' },
//     ],
//   },
//   { icon: Settings, label: 'Dịch vụ & hợp đồng', path: '/services' },
//   { icon: FileText, label: 'Quản lý hóa đơn', path: '/invoices' },
//   { icon: BarChart3, label: 'Báo cáo thanh toán', path: '/reports' },
// ];
// const [openSubmenu, setOpenSubmenu] = useState(null);

//   const residentMenuItems = [
//     { icon: Home, label: 'Trang chủ', path: '/dashboard' },
//     { icon: FileText, label: 'Hợp đồng của tôi', path: '/my-contracts' },
//     { icon: CreditCard, label: 'Thanh toán', path: '/payments' },
//     { icon: Bell, label: 'Thông báo', path: '/notifications' },
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
//                   ? 'Ban quản lý':''}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation menu */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
// {menuItems.map((item) => {
//   const Icon = item.icon;
//   const hasChildren = item.children && item.children.length > 0;
//   const isOpen = openSubmenu === item.label;

//   return (
//     <div key={item.path}>
//       <button
//         onClick={() =>
//           hasChildren
//             ? setOpenSubmenu(isOpen ? null : item.label)
//             : navigate(item.path)
//         }
//         className={cn(
//           'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
//           isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
//         )}
//       >
//         <span className="flex items-center space-x-3">
//           <Icon className="h-5 w-5" />
//           <span>{item.label}</span>
//         </span>
//         {hasChildren && (
//           <svg
//             className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//           </svg>
//         )}
//       </button>

//       {/* Submenu items */}
//       {hasChildren && isOpen && (
//         <div className="ml-8 mt-1 space-y-1">
//           {item.children.map((child) => (
//             <Link
//               key={child.path}
//               to={child.path}
//               onClick={() => setSidebarOpen(false)}
//               className={cn(
//                 'block px-3 py-1 rounded-md text-sm',
//                 isActive(child.path)
//                   ? 'bg-blue-100 text-blue-700'
//                   : 'text-gray-600 hover:bg-gray-100'
//               )}
//             >
//               {child.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// })}

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

// {/* Main content */}
//  <div className="flex-1 p-6 overflow-x-auto">
//       <Outlet />  {/* <-- Hiển thị nội dung route con như Dashboard */}
//     </div>
//   </div>
//   );
// };

// export default Layout;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import {
  Home, Users, FileText, CreditCard, BarChart3, Settings,
  Bell, Menu, X, LogOut, Building2
} from 'lucide-react';
import { cn } from '../lib/utils';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Nếu bạn dùng AuthContext, giữ 2 dòng dưới; nếu không, xem phần NOTE ở cuối
  const { user, logout } = { user: null, logout: () => {} }; // <-- tạm placeholder nếu chưa có AuthContext
  // Ví dụ user mong đợi: { name: 'Admin', role: 'management', apartmentNumber: 'A101' }

  const location = useLocation();
  const navigate = useNavigate();

  const managementMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: Users, label: 'Quản lý người dùng', path: '/users' },
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

  const role = user?.role || (localStorage.getItem('loaiTaiKhoan') === 'BQL' ? 'BQL' : 'CuDan');
  const name = user?.name || localStorage.getItem('userName') || 'Người dùng';
  const apartmentNumber = user?.apartmentNumber || localStorage.getItem('canHo') || '';

  const menuItems = role === 'BQL' ? managementMenuItems : residentMenuItems;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (logout) logout();
    localStorage.clear();
    setSidebarOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Topbar (mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-semibold">QuanLyChungCu</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Overlay khi mở sidebar trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="hidden lg:flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">QuanLyChungCu</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info (click mở ProfileModal) */}
        <div className="px-6 py-4 border-b bg-blue-50">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full text-left hover:bg-blue-100 transition-colors rounded-lg p-2 -m-2"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">
                  {role === 'BQL' ? 'Ban quản lý' : `Căn hộ ${apartmentNumber}`}
                </p>
              </div>
              <Settings className="h-4 w-4 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Navigation */}
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
                  isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
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
      </aside>

      {/* Content area */}
      <main className="flex-1 p-6 pt-20 lg:pt-6 overflow-x-auto">
        {/* Nếu bạn dùng nested routes, Outlet sẽ render page con; 
            nếu bạn render như component thường, truyền children vào cũng ok */}
        <Outlet />
      </main>

      {/* Profile Modal */}
      {typeof ProfileModal === 'function' && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
