import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, Select, message, Tabs, Statistic } from 'antd';
import {
  CreditCardOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import './Payment.css';

const { Option } = Select;

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet';
  name: string;
  number: string;
  expiryDate: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  description: string;
}

const Payment: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit_card',
      name: '招商银行信用卡',
      number: '**** **** **** 1234',
      expiryDate: '12/25',
      isDefault: true,
      status: 'active'
    },
    {
      id: '2',
      type: 'debit_card',
      name: '工商银行储蓄卡',
      number: '**** **** **** 5678',
      expiryDate: '08/26',
      isDefault: false,
      status: 'active'
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      orderId: 'ORD-2024-001',
      amount: 1299.00,
      method: '招商银行信用卡',
      status: 'success',
      date: '2024-01-15 14:30:00',
      description: 'iPhone 15 Pro 购买'
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      amount: 299.00,
      method: '工商银行储蓄卡',
      status: 'success',
      date: '2024-01-14 10:15:00',
      description: 'AirPods Pro 购买'
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      amount: 899.00,
      method: '招商银行信用卡',
      status: 'pending',
      date: '2024-01-13 16:45:00',
      description: 'MacBook Air 保护套'
    }
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddPaymentMethod = async (values: any) => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: values.type,
      name: values.name,
      number: `**** **** **** ${values.number.slice(-4)}`,
      expiryDate: values.expiryDate,
      isDefault: values.isDefault || false,
      status: 'active'
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddModalVisible(false);
    form.resetFields();
    message.success('支付方式添加成功！');
  };

  const handleDeletePaymentMethod = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个支付方式吗？',
      onOk: () => {
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
        message.success('支付方式删除成功！');
      }
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    message.success('默认支付方式设置成功！');
  };

  const paymentMethodColumns = [
    {
      title: '支付方式',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PaymentMethod) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.number}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          credit_card: { text: '信用卡', color: 'blue' },
          debit_card: { text: '储蓄卡', color: 'green' },
          bank_transfer: { text: '银行转账', color: 'orange' },
          digital_wallet: { text: '数字钱包', color: 'purple' }
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '有效期',
      dataIndex: 'expiryDate',
      key: 'expiryDate'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '激活' : '未激活'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_text: string, record: PaymentMethod) => (
        <div>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => message.info('查看详情')}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('编辑功能开发中')}
          >
            编辑
          </Button>
          {!record.isDefault && (
            <Button
              type="link"
              onClick={() => handleSetDefault(record.id)}
            >
              设为默认
            </Button>
          )}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePaymentMethod(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  const transactionColumns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    {
      title: '支付方式',
      dataIndex: 'method',
      key: 'method'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          success: { text: '成功', color: 'green' },
          pending: { text: '处理中', color: 'orange' },
          failed: { text: '失败', color: 'red' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const successCount = transactions.filter(t => t.status === 'success').length;

  return (
    <div className="payment-page">
      <div className="container">
        <div className="page-header">
          <h1>支付管理</h1>
          <p>管理您的支付方式和查看交易记录</p>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="总交易金额"
                value={totalAmount}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="成功交易"
                value={successCount}
                prefix={<TransactionOutlined />}
                suffix={`/ ${transactions.length}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="支付方式"
                value={paymentMethods.length}
                prefix={<CreditCardOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="methods"
          items={[
            {
              key: 'methods',
              label: '支付方式',
              children: (
                <Card
                  title="我的支付方式"
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsAddModalVisible(true)}
                    >
                      添加支付方式
                    </Button>
                  }
                >
                  <Table
                    dataSource={paymentMethods}
                    columns={paymentMethodColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Card>
              )
            },
            {
              key: 'transactions',
              label: '交易记录',
              children: (
                <Card title="交易历史">
                  <Table
                    dataSource={transactions}
                    columns={transactionColumns}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 条记录`
                    }}
                  />
                </Card>
              )
            }
          ]}
        />

        {/* 添加支付方式模态框 */}
        <Modal
          title="添加支付方式"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddPaymentMethod}
          >
            <Form.Item
              name="type"
              label="支付方式类型"
              rules={[{ required: true, message: '请选择支付方式类型' }]}
            >
              <Select placeholder="请选择支付方式类型">
                <Option value="credit_card">信用卡</Option>
                <Option value="debit_card">储蓄卡</Option>
                <Option value="bank_transfer">银行转账</Option>
                <Option value="digital_wallet">数字钱包</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="银行/机构名称"
              rules={[{ required: true, message: '请输入银行或机构名称' }]}
            >
              <Input placeholder="例如：招商银行" />
            </Form.Item>

            <Form.Item
              name="number"
              label="卡号"
              rules={[
                { required: true, message: '请输入卡号' },
                { pattern: /^\d{16,19}$/, message: '请输入正确的卡号' }
              ]}
            >
              <Input placeholder="请输入16-19位卡号" maxLength={19} />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="有效期"
              rules={[
                { required: true, message: '请输入有效期' },
                { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: '格式：MM/YY' }
              ]}
            >
              <Input placeholder="MM/YY" maxLength={5} />
            </Form.Item>

            <Form.Item
              name="isDefault"
              valuePropName="checked"
            >
              <Button type="link" style={{ padding: 0 }}>
                设为默认支付方式
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                添加支付方式
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Payment; 