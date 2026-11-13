import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout as AntLayout, Menu, Button, Dropdown, Avatar } from 'antd';
import { useAuthStore } from '../store/useAuthStore';
import type { MenuProps } from 'antd';
import {
  ShakerIcon,
  CocktailGlassIcon,
  JiggerIcon,
  CoasterIcon,
  BrandLogo,
} from '../theme/icons/SpiritIcons';

const { Header, Sider, Content, Footer } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, clearAuth } = useAuthStore();

  // 菜单项（使用线性烈酒图标，按业务分组）
  const menuItems: MenuProps['items'] = [
    {
      type: 'group',
      label: '数据分析',
      children: [
        { key: '/dashboard', icon: <ShakerIcon />, label: '数据看板' },
      ],
    },
    {
      type: 'group',
      label: '内容管理',
      children: [
        { key: '/cocktails', icon: <CocktailGlassIcon />, label: '酒谱管理' },
        { key: '/ingredients', icon: <JiggerIcon />, label: '材料管理' },
        { key: '/categories', icon: <CoasterIcon />, label: '分类管理' },
      ],
    },
    {
      type: 'group',
      label: '用户与互动',
      children: [
        { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
      ],
    },
  ];

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        clearAuth();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <AntLayout className="app-root" style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220} style={{ background: '#130d07', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#E6C79C',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          <span style={{ color: '#E0B079' }}>
            <BrandLogo size={26} />
          </span>
          {!collapsed && <span className="bar-brand-name">调酒管理</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout className="app-body">
        <Header
          className="bar-topbar"
          style={{
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            lineHeight: 'normal',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 48, height: 48, color: '#E6C79C' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#E0B079' }}>
                <BrandLogo size={22} />
              </span>
              <span className="bar-brand-name" style={{ fontSize: 17 }}>
                调酒管理系统
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(91,192,138,0.35)',
                background: 'rgba(91,192,138,0.10)',
                color: '#9fe0b6',
                fontSize: 13,
              }}
            >
              <span className="bar-status-dot" />
              营业中
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#C08E57' }}>
                  {admin?.nickname?.charAt(0) || 'A'}
                </Avatar>
                <span style={{ marginLeft: 8, color: '#E7DCCB' }}>
                  {admin?.nickname || admin?.username}
                </span>
              </div>
            </Dropdown>
          </div>
          <span className="bar-edge" />
        </Header>
        <Content
          style={{
            position: 'relative',
            zIndex: 1,
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'transparent',
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '12px 16px',
            background: 'transparent',
            color: 'rgba(231, 220, 203, 0.55)',
            fontSize: 12,
          }}
        >
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(224, 176, 121, 0.8)', textDecoration: 'none' }}
          >
            粤ICP备2026181317号
          </a>
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
