import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Spin, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';
import './App.css';
import './theme/tokens.css';
import { ShakerLoader } from './theme/ShakerLoader';

// 全局替换默认 Loading 指示器为摇酒壶动画（所有 <Spin/> 生效）
Spin.setDefaultIndicator(<ShakerLoader size={24} />);

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#E0B079',
          colorInfo: '#6FB3D6',
          colorSuccess: '#5BC08A',
          colorWarning: '#E0B073',
          colorError: '#E07A6F',
          colorBgBase: '#140d07',
          colorBgContainer: '#1d1510',
          colorBgElevated: '#241b13',
          colorBorder: 'rgba(224,176,121,0.20)',
          colorSplit: 'rgba(224,176,121,0.12)',
          colorText: '#E7DCCB',
          colorTextSecondary: '#A99884',
          colorTextTertiary: '#7e7160',
          borderRadius: 10,
          fontSize: 14,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Menu: {
            darkItemBg: '#130d07',
            darkSubMenuItemBg: '#130d07',
            darkItemSelectedBg: 'rgba(192,142,87,0.22)',
            darkItemHoverBg: '#2a1f15',
            darkItemColor: '#cdbfa9',
            darkItemHoverColor: '#ffffff',
          },
          Card: { borderRadiusLG: 14, colorBgContainer: 'transparent' },
          Table: {
            headerBg: 'rgba(224,176,121,0.08)',
            headerColor: '#e6c79c',
            headerSplitColor: 'transparent',
            borderColor: 'rgba(224,176,121,0.10)',
            rowHoverBg: 'rgba(224,176,121,0.06)',
            colorBgContainer: 'transparent',
          },
          Modal: { contentBg: 'rgba(28,20,13,0.92)', headerBg: 'transparent' },
          Drawer: { colorBgElevated: 'rgba(28,20,13,0.95)' },
          Input: { colorBgContainer: 'rgba(255,244,230,0.04)', colorBorder: 'rgba(224,176,121,0.20)' },
          Select: { colorBgContainer: 'rgba(255,244,230,0.04)' },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
