import React, { useState } from 'react';
import { Card, Row, Col, Button, Radio, message, Divider, Typography, List, Result, Steps, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { CreditCardOutlined, WalletOutlined, BankOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import './Checkout.css';

const { Title, Text } = Typography;
const { Step } = Steps;

interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card' | 'digital_wallet';
    name: string;
    number: string;
    icon: React.ReactNode;
}

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [orderId, setOrderId] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [forceSuccess, setForceSuccess] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        {
            id: '1',
            type: 'credit_card',
            name: '招商银行信用卡',
            number: '**** **** **** 1234',
            icon: <CreditCardOutlined />
        },
        {
            id: '2',
            type: 'debit_card',
            name: '工商银行储蓄卡',
            number: '**** **** **** 5678',
            icon: <BankOutlined />
        },
        {
            id: '3',
            type: 'digital_wallet',
            name: '支付宝',
            number: 'user@example.com',
            icon: <WalletOutlined />
        }
    ];

    // 防重复提交
    const handlePayment = async () => {
        console.log('开始支付处理...');
        console.log('当前状态:', { selectedPaymentMethod, user, isProcessing, forceSuccess, items });

        if (!selectedPaymentMethod) {
            message.error('请选择支付方式');
            return;
        }

        if (!user) {
            message.error('请先登录');
            navigate('/user');
            return;
        }

        if (isProcessing) {
            message.warning('支付处理中，请勿重复操作');
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('processing');

        try {
            console.log('支付处理开始，等待2秒...');
            // 模拟支付处理 - 添加随机成功率
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 模拟支付成功率 (80% 成功，20% 失败) 或强制成功
            const randomSuccess = Math.random() > 0.2;
            const paymentSuccess = forceSuccess || randomSuccess;

            console.log('支付调试信息:', {
                forceSuccess,
                randomSuccess,
                paymentSuccess,
                selectedPaymentMethod,
                user: user?.id,
                itemsCount: items.length
            });

            // 如果开启测试模式，直接成功
            if (forceSuccess) {
                console.log('测试模式已开启，强制支付成功');
            } else if (!paymentSuccess) {
                console.log('支付失败：随机失败');
                throw new Error('支付网关暂时不可用，请稍后重试');
            }

            console.log('支付成功，开始创建订单...');
            // 生成订单ID
            const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            setOrderId(newOrderId);

            // 创建订单
            const order = {
                id: newOrderId,
                userId: user.id,
                items: items,
                totalAmount: getTotalPrice(),
                paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name,
                status: 'paid',
                createdAt: new Date().toISOString(),
                paymentCompletedAt: new Date().toISOString()
            };

            console.log('订单创建完成:', order);

            // 保存订单到本地存储
            let existingOrders = [];
            try {
                const ordersStr = localStorage.getItem('orders');
                if (ordersStr) {
                    const parsed = JSON.parse(ordersStr);
                    existingOrders = Array.isArray(parsed) ? parsed : [];
                }
            } catch (error) {
                console.error('解析现有订单失败:', error);
                existingOrders = [];
            }

            existingOrders.push(order);
            localStorage.setItem('orders', JSON.stringify(existingOrders));

            // 更新用户总消费金额
            const userTotalSpent = parseFloat(localStorage.getItem(`user_${user.id}_totalSpent`) || '0');
            localStorage.setItem(`user_${user.id}_totalSpent`, (userTotalSpent + getTotalPrice()).toString());

            console.log('触发库存减少事件...');
            // 触发库存减少事件
            window.dispatchEvent(new CustomEvent('purchaseCompleted', {
                detail: {
                    orderId: newOrderId,
                    items: items,
                    userId: user.id
                }
            }));

            console.log('清空购物车...');
            // 清空购物车
            clearCart();

            console.log('设置支付成功状态...');
            // 设置支付成功状态
            setPaymentStatus('success');

            // 3秒后跳转到订单页面
            setTimeout(() => {
                navigate('/user?tab=orders');
            }, 3000);

        } catch (error) {
            console.error('支付处理出错:', error);
            setPaymentStatus('failed');
            const errorMessage = error instanceof Error ? error.message : '支付失败，请重试';
            message.error(errorMessage);
            console.error('支付错误:', error);
        } finally {
            console.log('支付处理完成，设置isProcessing为false');
            setIsProcessing(false);
        }
    };

    const handleBackToCart = () => {
        navigate('/cart');
    };

    const handleRetryPayment = () => {
        setPaymentStatus('pending');
        setOrderId('');
    };

    // 支付成功页面
    if (paymentStatus === 'success') {
        return (
            <div className="checkout-page">
                <div className="container">
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        title="支付成功！"
                        subTitle={`订单号: ${orderId}`}
                        extra={[
                            <Button type="primary" key="orders" onClick={() => navigate('/user?tab=orders')}>
                                查看订单
                            </Button>,
                            <Button key="home" onClick={() => navigate('/')}>
                                继续购物
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    // 支付失败页面
    if (paymentStatus === 'failed') {
        return (
            <div className="checkout-page">
                <div className="container">
                    <Result
                        status="error"
                        title="支付失败"
                        subTitle="支付过程中出现错误，请重试"
                        extra={[
                            <Button type="primary" key="retry" onClick={handleRetryPayment}>
                                重新支付
                            </Button>,
                            <Button key="cart" onClick={() => navigate('/cart')}>
                                返回购物车
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Title level={3}>购物车为空</Title>
                            <Text>请先添加商品到购物车</Text>
                            <br />
                            <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
                                去购物
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <Title level={2}>确认订单</Title>

                {/* 支付步骤指示器 */}
                <Card style={{ marginBottom: 24 }}>
                    <Steps current={paymentStatus === 'processing' ? 1 : 0}>
                        <Step title="确认订单" description="检查商品信息" />
                        <Step
                            title="支付处理"
                            description="处理支付请求"
                            icon={paymentStatus === 'processing' ? <LoadingOutlined /> : undefined}
                        />
                        <Step title="支付完成" description="订单创建成功" />
                    </Steps>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* 订单摘要 */}
                    <Col xs={24} lg={12}>
                        <Card title="订单摘要" className="order-summary-card">
                            <List
                                dataSource={items}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <div>
                                                <Text strong>{item.name}</Text>
                                                <br />
                                                <Text type="secondary">{item.category}</Text>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Text>¥{item.price} × {item.quantity}</Text>
                                                <br />
                                                <Text strong>¥{(item.price * item.quantity).toFixed(2)}</Text>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ fontSize: '18px' }}>
                                    总计: ¥{getTotalPrice().toFixed(2)}
                                </Text>
                            </div>
                        </Card>
                    </Col>

                    {/* 支付方式选择 */}
                    <Col xs={24} lg={12}>
                        <Card title="选择支付方式" className="payment-method-card">
                            <Radio.Group
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                disabled={isProcessing}
                            >
                                {paymentMethods.map((method) => (
                                    <div key={method.id} style={{ marginBottom: 16 }}>
                                        <Radio value={method.id}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {method.icon}
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{method.name}</div>
                                                    <div style={{ color: '#666', fontSize: '12px' }}>{method.number}</div>
                                                </div>
                                            </div>
                                        </Radio>
                                    </div>
                                ))}
                            </Radio.Group>

                            <Divider />

                            {/* 测试模式开关 */}
                            <Card style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <Switch
                                        checked={forceSuccess}
                                        onChange={setForceSuccess}
                                        checkedChildren="测试模式"
                                        unCheckedChildren="正常模式"
                                    />
                                    <Text>开启测试模式可强制支付成功</Text>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            localStorage.removeItem('orders');
                                            localStorage.removeItem('cart-storage');
                                            localStorage.removeItem('user-storage');
                                            message.success('localStorage已清理');
                                            window.location.reload();
                                        }}
                                    >
                                        清理数据
                                    </Button>
                                </div>
                            </Card>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <Button
                                    onClick={handleBackToCart}
                                    style={{ flex: 1 }}
                                    disabled={isProcessing}
                                >
                                    返回购物车
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handlePayment}
                                    loading={isProcessing}
                                    disabled={!selectedPaymentMethod || isProcessing}
                                    style={{ flex: 1 }}
                                >
                                    {isProcessing ? '支付处理中...' : '确认支付'}
                                </Button>
                            </div>

                            {isProcessing && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <Text type="secondary">
                                        正在处理支付，请勿关闭页面...
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Checkout; 