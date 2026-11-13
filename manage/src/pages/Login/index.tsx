import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { BrandLogo } from '../../theme/icons/SpiritIcons';
import './index.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const sessionExpired = new URLSearchParams(window.location.search).has('expired');

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const res = await login(values);

      if (res.data) {
        setAuth(res.data.token, res.data.admin);
        message.success('登录成功');
        navigate('/dashboard');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card
        className="login-card"
        title={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#E0B079' }}>
              <BrandLogo size={22} />
            </span>
            <span className="bar-brand-name">调酒管理系统</span>
          </span>
        }
      >
        {sessionExpired && (
          <Alert
            message="登录已过期，请重新登录"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <footer className="login-icp">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          粤ICP备2026181317号
        </a>
      </footer>
    </div>
  );
};

export default Login;
