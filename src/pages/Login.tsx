import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, Mail, MessageCircle, MessageSquare } from 'lucide-react';
import { Button, Form, Input, Card, Alert } from 'antd';
import { login, register, socialLogin } from '../features/auth/slice';
import type { RootState } from '../store';
import type { AppDispatch } from '../store';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isRegister) {
        dispatch(register({
          username: values.username,
          email: values.email,
          password: values.password,
        }));
      } else {
        dispatch(login({
          email: values.email,
          password: values.password,
        }));
      }
    });
  };

  const handleSocialLogin = (type: 'wechat' | 'qq') => {
    dispatch(socialLogin(type));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <h1>{isRegister ? '注册' : '登录'}</h1>
            <p>{isRegister ? '创建您的账户' : '欢迎回来'}</p>
          </div>

          {error && (
            <Alert message={error} type="error" showIcon className="error-alert" />
          )}

          <Form form={form} layout="vertical" className="login-form">
            {isRegister && (
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<User size={18} />} placeholder="请输入用户名" />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]}
            >
              <Input prefix={<Mail size={18} />} placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少为6位' },
              ]}
            >
              <Input.Password
                prefix={<Lock size={18} />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              onClick={handleSubmit}
              block
            >
              {isRegister ? '注册' : '登录'}
            </Button>
          </Form>

          <div className="social-login">
            <div className="social-divider">
              <span>或</span>
            </div>
            <div className="social-buttons">
              <button 
                className="social-btn wechat-btn"
                onClick={() => handleSocialLogin('wechat')}
                disabled={loading}
              >
                <MessageCircle size={20} />
                <span>微信登录</span>
              </button>
              <button 
                className="social-btn qq-btn"
                onClick={() => handleSocialLogin('qq')}
                disabled={loading}
              >
                <MessageSquare size={20} />
                <span>QQ登录</span>
              </button>
            </div>
          </div>

          <div className="login-footer">
            <span>
              {isRegister ? '已有账户？' : '还没有账户？'}
              <button onClick={() => { setIsRegister(!isRegister); form.resetFields(); }}>
                {isRegister ? '立即登录' : '立即注册'}
              </button>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
