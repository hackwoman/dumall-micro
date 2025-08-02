import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Button, Tabs, Form, Input, message, List, Tag, Statistic, Switch } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ShoppingOutlined, CrownOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import { userApi } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import './User.css';

const { Title, Text } = Typography;

const User: React.FC = () => {
    const { user, isLoggedIn, login: authLogin, logout, isAdmin } = useAuthStore();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [userTotalSpent, setUserTotalSpent] = useState(0);

    useEffect(() => {
        if (isLoggedIn && user) {
            try {
                // 加载用户订单
                const savedOrdersStr = localStorage.getItem('orders');
                let savedOrders = [];

                if (savedOrdersStr) {
                    try {
                        const parsed = JSON.parse(savedOrdersStr);
                        savedOrders = Array.isArray(parsed) ? parsed : [];
                    } catch (parseError) {
                        console.error('解析订单数据失败:', parseError);
                        savedOrders = [];
                    }
                }

                const userOrders = savedOrders.filter((order: any) => order.userId === user.id);
                setOrders(userOrders);

                // 加载用户总消费金额
                const totalSpent = parseFloat(localStorage.getItem(`user_${user.id}_totalSpent`) || '0');
                setUserTotalSpent(totalSpent);
            } catch (error) {
                console.error('加载订单数据失败:', error);
                setOrders([]);
                setUserTotalSpent(0);
            }
        }
    }, [isLoggedIn, user]);

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            console.log('登录信息:', values);
            // 调用登录API
            const response = await userApi.login({
                username: values.username,
                password: values.password
            });

            if (response.code === 200 && response.data) {
                const user = response.data;
                // 确保所有必需字段存在
                const authUser = {
                    ...user,
                    isAdmin: user.isAdmin ?? false,
                    createdAt: user.createdAt ?? new Date().toISOString()
                } as any; // 临时类型断言
                authLogin(authUser);
                message.success('登录成功！');
            } else {
                message.error(response.message || '登录失败');
            }
        } catch (error) {
            console.error('登录错误:', error);
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            console.log('注册信息:', values);
            // 调用注册API
            const response = await userApi.register({
                username: values.username,
                email: values.email,
                password: values.password,
                isAdmin: values.isAdmin || false,
            });

            if (response.code === 200) {
                message.success('注册成功！');
                setActiveTab('login');
            } else {
                message.error(response.message || '注册失败');
            }
        } catch (error) {
            console.error('注册错误:', error);
            message.error('注册失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        message.success('已退出登录');
    };

    if (!isLoggedIn) {
        const tabItems = [
            {
                key: 'login',
                label: '登录',
                children: (
                    <Form
                        name="login"
                        onFinish={handleLogin}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名！' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                ),
            },
            {
                key: 'register',
                label: '注册',
                children: (
                    <Form
                        name="register"
                        onFinish={handleRegister}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名！' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: '请输入邮箱！' },
                                { type: 'email', message: '请输入有效的邮箱地址！' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="邮箱"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: '请确认密码！' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="确认密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="isAdmin"
                            valuePropName="checked"
                            label={
                                <span>
                                    <CrownOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                    注册为管理员
                                </span>
                            }
                        >
                            <Switch
                                checkedChildren="是"
                                unCheckedChildren="否"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                ),
            },
        ];

        return (
            <div className="user-page">
                <div className="container">
                    <Card className="auth-card">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            centered
                            items={tabItems}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    // 已登录用户的个人资料页面
    const userTabItems = [
        {
            key: 'profile',
            label: '个人资料',
            children: (
                <Row gutter={[24, 24]}>
                    {/* 用户信息卡片 */}
                    <Col xs={24} md={8}>
                        <Card className="user-info-card">
                            <div className="user-avatar-section">
                                <Avatar size={80} icon={<UserOutlined />} />
                                <Title level={3} className="username">
                                    {user?.username || '用户'}
                                    {isAdmin && (
                                        <CrownOutlined style={{ marginLeft: 8, color: '#faad14' }} />
                                    )}
                                </Title>
                                <Text type="secondary">
                                    {user?.email || 'user@example.com'}
                                </Text>
                                {isAdmin && (
                                    <Tag color="gold" icon={<CrownOutlined />}>
                                        管理员
                                    </Tag>
                                )}
                            </div>

                            <div className="user-stats">
                                <div className="stat-item">
                                    <Text strong>订单数</Text>
                                    <Text>{orders.length}</Text>
                                </div>
                                <div className="stat-item">
                                    <Text strong>总消费</Text>
                                    <Text>¥{userTotalSpent.toFixed(2)}</Text>
                                </div>
                                <div className="stat-item">
                                    <Text strong>优惠券</Text>
                                    <Text>0</Text>
                                </div>
                            </div>

                            <Button
                                type="primary"
                                danger
                                block
                                onClick={handleLogout}
                                style={{ marginTop: 16 }}
                            >
                                退出登录
                            </Button>
                        </Card>
                    </Col>

                    {/* 个人资料编辑 */}
                    <Col xs={24} md={16}>
                        <Card title="个人资料">
                            <Form layout="vertical">
                                <Form.Item label="用户名">
                                    <Input
                                        value={user?.username || ''}
                                        prefix={<UserOutlined />}
                                    />
                                </Form.Item>
                                <Form.Item label="邮箱">
                                    <Input
                                        value={user?.email || ''}
                                        prefix={<MailOutlined />}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary">
                                        修改资料
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: 'orders',
            label: '我的订单',
            children: (
                <Card title="订单历史">
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <ShoppingOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                            <div style={{ marginTop: 16 }}>
                                <Text type="secondary">暂无订单记录</Text>
                            </div>
                        </div>
                    ) : (
                        <List
                            dataSource={orders}
                            renderItem={(order) => (
                                <List.Item>
                                    <Card style={{ width: '100%', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                    <Text strong>订单号: {order.id}</Text>
                                                    <Tag color="green">已支付</Tag>
                                                    {order.paymentCompletedAt && (
                                                        <Tag color="blue">
                                                            支付时间: {new Date(order.paymentCompletedAt).toLocaleString()}
                                                        </Tag>
                                                    )}
                                                </div>
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary">
                                                        支付方式: {order.paymentMethod}
                                                    </Text>
                                                </div>
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary">
                                                        下单时间: {new Date(order.createdAt).toLocaleString()}
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text strong>商品列表:</Text>
                                                    <List
                                                        size="small"
                                                        dataSource={order.items}
                                                        renderItem={(item: any) => (
                                                            <List.Item style={{ padding: '4px 0' }}>
                                                                <Text>{item.name} × {item.quantity}</Text>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Statistic
                                                    title="订单金额"
                                                    value={order.totalAmount}
                                                    precision={2}
                                                    prefix="¥"
                                                    valueStyle={{ color: '#fa8c16', fontSize: '18px' }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            )
        }
    ];

    return (
        <div className="user-page">
            <div className="container">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={userTabItems}
                />
            </div>
        </div>
    );
};

export default User; 