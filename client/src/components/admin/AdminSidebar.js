import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Users,
  Plane,
  Building2,
  Tags,
  FileText,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/store';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'deals', label: 'Deals', icon: Tags },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="fs-logo-text" style={{ fontSize: '1.4rem' }}>Travel<span>Mate</span> Admin</div>
      </div>
      
      <div className="admin-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-sidebar-footer">
        <button className="admin-nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <button className="admin-nav-item back-btn" onClick={() => navigate('/')}>
          <span>Back to Site</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
