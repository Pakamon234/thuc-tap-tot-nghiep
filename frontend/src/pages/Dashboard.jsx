import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {Layout} from '../components/Layout';
const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [apartment, setApartment] = useState('');

  const currentTime = new Date().toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    const roleLS = localStorage.getItem('loaiTaiKhoan');
    const nameLS = localStorage.getItem('userName');
    const apartmentLS = localStorage.getItem('canHo');

    setRole(roleLS);
    setName(nameLS);
    setApartment(apartmentLS);

    // Nếu là quản lý thì gọi API, còn cư dân thì dữ liệu mẫu
    if (roleLS === 'BQL') {
      loadDashboardStats();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      // TODO: Gọi API từ backend thật ở đây
      const mockStats = {
        CuDans: { total: 120, pending: 5, approved: 100, suspended: 15 },
        invoices: { total: 200, pending: 12, paid: 170, overdue: 18 },
        revenue: { monthly: 48500000, growth: 5.2 },
        contracts: { active: 90, expiring: 6 },
      };
      setDashboardStats(mockStats);
    } catch (err) {
      console.error('Lỗi load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {role === 'BQL' ? `Chào mừng, ${name}` : `Xin chào, ${name}`}
            </h1>
            <p className="text-blue-100 mt-1">
              {role === 'BQL' ? 'Ban quản lý chung cư' : `Căn hộ ${apartment}`}
            </p>
            <p className="text-blue-200 text-sm mt-2">{currentTime}</p>
          </div>
          <Building2 className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* Quản lý */}
      {role === 'BQL' && dashboardStats && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tổng cư dân */}
            <StatCard
              label="Tổng cư dân"
              value={dashboardStats.CuDans.total}
              icon={<Users className="h-8 w-8 text-blue-600" />}
              subLabel={`+${dashboardStats.CuDans.pending} chờ duyệt`}
              subColor="text-green-600"
              subIcon={<TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
            />

            {/* Hóa đơn chưa thanh toán */}
            <StatCard
              label="Hóa đơn chưa thanh toán"
              value={dashboardStats.invoices.pending}
              icon={<FileText className="h-8 w-8 text-orange-600" />}
              subLabel="Cần xử lý"
              subColor="text-orange-600"
              subIcon={<AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />}
            />

            {/* Doanh thu */}
            <StatCard
              label="Doanh thu tháng này"
              value={`${(dashboardStats.revenue.monthly / 1_000_000).toFixed(1)}M`}
              icon={<BarChart3 className="h-8 w-8 text-green-600" />}
              subLabel={`${dashboardStats.revenue.growth > 0 ? '+' : ''}${dashboardStats.revenue.growth.toFixed(1)}% so với tháng trước`}
              subColor="text-green-600"
              subIcon={<TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
            />

            {/* Hợp đồng sắp hết hạn */}
            <StatCard
              label="Hợp đồng sắp hết hạn"
              value={dashboardStats.contracts.expiring}
              icon={<Clock className="h-8 w-8 text-red-600" />}
              subLabel="Trong 30 ngày tới"
              subColor="text-red-600"
              subIcon={<AlertTriangle className="h-4 w-4 mr-1 text-red-500" />}
            />
          </div>

          {/* Thao tác nhanh */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickLink to="/users" icon={<Users className="text-blue-600 h-6 w-6" />} label="Quản lý cư dân" sub="Duyệt và cập nhật cư dân" />
              <QuickLink to="/services" icon={<FileText className="text-green-600 h-6 w-6" />} label="Cấu hình dịch vụ" sub="Giá & điều khoản" />
              <QuickLink to="/invoices" icon={<CreditCard className="text-purple-600 h-6 w-6" />} label="Lập hóa đơn" sub="Tạo và quản lý hóa đơn" />
            </div>
          </div>
        </>
      )}

      {/* Cư dân */}
      {role === 'CuDan' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Hợp đồng đang hiệu lực" value="5" icon={<CheckCircle className="h-8 w-8 text-green-600" />} subLabel="Tất cả đều ổn" />
            <StatCard label="Hóa đơn chưa thanh toán" value="3" icon={<FileText className="h-8 w-8 text-orange-600" />} subLabel="Tổng: 2.450.000 VND" />
            <StatCard label="Thông báo mới" value="2" icon={<Bell className="h-8 w-8 text-blue-600" />} subLabel="Có thông báo mới" />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickLink to="/payments" icon={<CreditCard className="text-green-600 h-6 w-6" />} label="Thanh toán hóa đơn" sub="3 hóa đơn chưa thanh toán" />
              <QuickLink to="/my-contracts" icon={<FileText className="text-blue-600 h-6 w-6" />} label="Xem hợp đồng" sub="Quản lý 5 hợp đồng" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sub component
const StatCard = ({ label, value, icon, subLabel, subColor, subIcon }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
    {subLabel && (
      <div className={`mt-2 flex items-center text-sm ${subColor || 'text-gray-500'}`}>
        {subIcon}
        {subLabel}
      </div>
    )}
  </div>
);

const QuickLink = ({ to, icon, label, sub }) => (
  <Link to={to} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
    {icon}
    <div className="ml-3">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{sub}</p>
    </div>
  </Link>
);

export default Dashboard;
