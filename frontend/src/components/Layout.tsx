import React from 'react';
import { Layout as AntLayout, Menu, Badge, Avatar, Dropdown } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  CreditCardOutlined,
  BankOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import './Layout.css';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCartStore();
  const { user, isLoggedIn, logout, canAccessWarehouse } = useAuthStore();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: '商品',
    },
    {
      key: '/cart',
      icon: (
        <Badge count={getTotalItems()} size="small">
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: '购物车',
    },
    // 只有管理员可以看到仓库入口
    ...(canAccessWarehouse() ? [{
      key: '/warehouse',
      icon: <BankOutlined />,
      label: '仓库',
    }] : []),
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '我的',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
    },
    {
      key: 'orders',
      label: '我的订单',
    },
    {
      key: 'payment',
      label: '支付管理',
      icon: <CreditCardOutlined />,
    },
    // 只有管理员可以看到仓库管理选项
    ...(canAccessWarehouse() ? [{
      key: 'warehouse',
      label: '仓库管理',
      icon: <BankOutlined />,
    }] : []),
    ...(canAccessWarehouse() ? [{
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
    }] : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/');
    } else if (key === 'profile') {
      navigate('/user');
    } else if (key === 'orders') {
      navigate('/user?tab=orders');
    } else if (key === 'payment') {
      navigate('/payment');
    } else if (key === 'warehouse') {
      navigate('/warehouse');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <AntLayout className="app-layout">
      {/* 顶部导航 */}
      <Header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            Dumall
          </div>

          <div className="search-bar">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="search-input"
            />
          </div>

          <div className="header-right">
            {isLoggedIn ? (
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
              >
                <Avatar className="user-avatar">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </Dropdown>
            ) : (
              <span
                className="login-link"
                onClick={() => navigate('/user')}
              >
                登录
              </span>
            )}
          </div>
        </div>
      </Header>

      {/* 主内容区域 */}
      <Content className="app-content">
        {children}
      </Content>

      {/* 底部导航 */}
      <Footer className="app-footer">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="bottom-nav"
        />
      </Footer>
    </AntLayout>
  );
};

export default Layout; 