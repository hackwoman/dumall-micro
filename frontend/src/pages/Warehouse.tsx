import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, Select, message, Tabs, Statistic, Progress, Space } from 'antd';
import {
  BankOutlined,
  PlusOutlined,
  InboxOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../stores/authStore';
import './Warehouse.css';

const { Option } = Select;

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  price: number;
}

interface Transaction {
  id: string;
  type: 'in' | 'out';
  productName: string;
  sku: string;
  quantity: number;
  operator: string;
  date: string;
  notes: string;
}

const Warehouse: React.FC = () => {
  console.log('Warehouse component rendering...'); // 调试日志

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [transactionForm] = Form.useForm();

  // 模拟商品数据
  const mockProducts = [
    { name: 'iPhone 15 Pro', category: '数码产品', price: 8999, sku: 'IP15P-256-BLK' },
    { name: 'MacBook Air M2', category: '数码产品', price: 12999, sku: 'MBA-M2-512-SLV' },
    { name: 'AirPods Pro', category: '数码产品', price: 1999, sku: 'APP-2ND-GEN' },
    { name: 'Nike Air Max', category: '服装配饰', price: 899, sku: 'NAM-270-WHT' },
    { name: '机械键盘', category: '数码产品', price: 299, sku: 'MK-87-RGB' },
    { name: 'iPad Air', category: '数码产品', price: 4799, sku: 'IPA-256-SLV' },
    { name: '小米手环', category: '数码产品', price: 199, sku: 'XMH-8-BLK' },
    { name: '蓝牙耳机', category: '数码产品', price: 399, sku: 'BT-HEADSET' },
    { name: '运动鞋', category: '服装配饰', price: 599, sku: 'SNEAKERS-001' },
    { name: '背包', category: '服装配饰', price: 299, sku: 'BACKPACK-001' }
  ];

  // 初始化库存数据
  useEffect(() => {
    const savedInventory = localStorage.getItem('warehouse_inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      // 初始化默认库存 - 所有商品数量都是100
      const defaultInventory = mockProducts.map((product, index) => ({
        id: (index + 1).toString(),
        productName: product.name,
        sku: product.sku,
        category: product.category,
        quantity: 100, // 统一设置为100
        minQuantity: 10,
        location: `${String.fromCharCode(65 + Math.floor(index / 5))}区-${String(Math.floor(index % 5) + 1).padStart(2, '0')}-${String(index % 10 + 1).padStart(2, '0')}`,
        status: 'in_stock' as const,
        lastUpdated: new Date().toLocaleString(),
        price: product.price
      }));
      setInventory(defaultInventory);
      localStorage.setItem('warehouse_inventory', JSON.stringify(defaultInventory));
    }

    const savedTransactions = localStorage.getItem('warehouse_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // 保存库存数据到本地存储
  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem('warehouse_inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

  // 保存交易记录到本地存储
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('warehouse_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // 自动入库功能
  const handleAutoStockIn = () => {
    const updatedInventory = [...inventory];
    const newTransactions: Transaction[] = [];

    mockProducts.forEach((product, index) => {
      // 查找是否已存在相同商品
      const existingItem = updatedInventory.find(item =>
        item.productName === product.name && item.sku === product.sku
      );

      if (existingItem) {
        // 如果商品已存在，增加数量
        const addedQuantity = Math.floor(Math.random() * 100) + 50;
        existingItem.quantity += addedQuantity;
        existingItem.lastUpdated = new Date().toLocaleString();

        // 更新状态
        existingItem.status = existingItem.quantity > existingItem.minQuantity ? 'in_stock' as const :
          existingItem.quantity === 0 ? 'out_of_stock' as const : 'low_stock' as const;

        newTransactions.push({
          id: Date.now().toString() + Math.random(),
          type: 'in' as const,
          productName: existingItem.productName,
          sku: existingItem.sku,
          quantity: addedQuantity,
          operator: '系统自动入库',
          date: new Date().toLocaleString(),
          notes: '自动入库 - 数量增加'
        });
      } else {
        // 如果商品不存在，添加新商品
        const newItem = {
          id: Date.now().toString() + index,
          productName: product.name,
          sku: product.sku,
          category: product.category,
          quantity: Math.floor(Math.random() * 100) + 50,
          minQuantity: 20,
          location: `${String.fromCharCode(65 + Math.floor(index / 5))}区-${String(Math.floor(index % 5) + 1).padStart(2, '0')}-${String(index % 10 + 1).padStart(2, '0')}`,
          status: 'in_stock' as const,
          lastUpdated: new Date().toLocaleString(),
          price: product.price
        };

        updatedInventory.push(newItem);

        newTransactions.push({
          id: Date.now().toString() + Math.random(),
          type: 'in' as const,
          productName: newItem.productName,
          sku: newItem.sku,
          quantity: newItem.quantity,
          operator: '系统自动入库',
          date: new Date().toLocaleString(),
          notes: '自动入库 - 新商品'
        });
      }
    });

    setInventory(updatedInventory);
    setTransactions(prev => [...newTransactions, ...prev]);

    const addedCount = newTransactions.filter(t => t.notes.includes('新商品')).length;
    const increasedCount = newTransactions.filter(t => t.notes.includes('数量增加')).length;

    if (addedCount > 0 && increasedCount > 0) {
      message.success(`成功入库：新增 ${addedCount} 种商品，增加 ${increasedCount} 种商品数量`);
    } else if (addedCount > 0) {
      message.success(`成功入库：新增 ${addedCount} 种商品`);
    } else {
      message.success(`成功入库：增加 ${increasedCount} 种商品数量`);
    }
  };

  // 处理购买后的库存减少
  const handlePurchaseStockOut = (purchasedItems: any[]) => {
    console.log('开始处理库存减少，购买的商品:', purchasedItems);
    console.log('当前库存:', inventory);

    const updatedInventory = [...inventory];
    const newTransactions: Transaction[] = [];
    const processedItems: string[] = [];

    purchasedItems.forEach(purchasedItem => {
      console.log(`处理商品: ${purchasedItem.name}, 购买数量: ${purchasedItem.quantity}`);

      const inventoryItem = updatedInventory.find(item => item.productName === purchasedItem.name);
      if (inventoryItem) {
        const oldQuantity = inventoryItem.quantity;
        const newQuantity = Math.max(0, inventoryItem.quantity - purchasedItem.quantity);

        console.log(`${purchasedItem.name}: 库存从 ${oldQuantity} 减少到 ${newQuantity}`);

        inventoryItem.quantity = newQuantity;
        inventoryItem.status = newQuantity > inventoryItem.minQuantity ? 'in_stock' as const :
          newQuantity === 0 ? 'out_of_stock' as const : 'low_stock' as const;
        inventoryItem.lastUpdated = new Date().toLocaleString();

        newTransactions.push({
          id: Date.now().toString() + Math.random(),
          type: 'out',
          productName: inventoryItem.productName,
          sku: inventoryItem.sku,
          quantity: purchasedItem.quantity,
          operator: '系统自动出库',
          date: new Date().toLocaleString(),
          notes: `用户购买 - 库存从${oldQuantity}减少到${newQuantity}`
        });

        processedItems.push(purchasedItem.name);
      } else {
        console.warn(`未找到商品: ${purchasedItem.name} 在库存中`);
      }
    });

    console.log('处理完成的商品:', processedItems);
    console.log('更新后的库存:', updatedInventory);

    setInventory(updatedInventory);
    setTransactions(prev => [...newTransactions, ...prev]);

    if (processedItems.length > 0) {
      message.success(`库存已更新：${processedItems.join(', ')} 已出库`);
    }
  };

  // 监听购买事件 - 改进版本
  useEffect(() => {
    const handlePurchaseEvent = (event: CustomEvent) => {
      console.log('仓库收到购买完成事件:', event.detail);
      if (event.detail && event.detail.items) {
        console.log('开始处理购买的商品:', event.detail.items);
        handlePurchaseStockOut(event.detail.items);
        message.success(`库存已更新，订单 ${event.detail.orderId} 的商品已出库`);
      } else {
        console.warn('购买事件数据不完整:', event.detail);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orders' && e.newValue) {
        try {
          const orders = JSON.parse(e.newValue);
          const latestOrder = orders[orders.length - 1];
          if (latestOrder && latestOrder.items) {
            console.log('通过storage事件检测到新订单:', latestOrder);
            handlePurchaseStockOut(latestOrder.items);
          }
        } catch (error) {
          console.error('解析订单数据失败:', error);
        }
      }
    };

    // 监听自定义购买事件
    window.addEventListener('purchaseCompleted', handlePurchaseEvent as EventListener);

    // 监听本地存储变化（备用方案）
    window.addEventListener('storage', handleStorageChange);

    console.log('仓库页面已设置购买事件监听器');

    return () => {
      window.removeEventListener('purchaseCompleted', handlePurchaseEvent as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [inventory]);

  const handleAddInventory = async (values: any) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      productName: values.productName,
      sku: values.sku,
      category: values.category,
      quantity: values.quantity,
      minQuantity: values.minQuantity,
      location: values.location,
      status: values.quantity > values.minQuantity ? 'in_stock' as const :
        values.quantity === 0 ? 'out_of_stock' as const : 'low_stock' as const,
      lastUpdated: new Date().toLocaleString(),
      price: values.price || 0
    };

    setInventory([...inventory, newItem]);
    setIsAddModalVisible(false);
    form.resetFields();
    message.success('库存项目添加成功！');
  };

  const handleAddTransaction = async (values: any) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: values.type,
      productName: values.productName,
      sku: values.sku,
      quantity: values.quantity,
      operator: values.operator,
      date: new Date().toLocaleString(),
      notes: values.notes
    };

    // 更新库存
    const updatedInventory = inventory.map(item => {
      if (item.sku === values.sku) {
        const newQuantity = values.type === 'in' ?
          item.quantity + values.quantity :
          item.quantity - values.quantity;

        return {
          ...item,
          quantity: Math.max(0, newQuantity),
          status: newQuantity > item.minQuantity ? 'in_stock' as const :
            newQuantity === 0 ? 'out_of_stock' as const : 'low_stock' as const,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setTransactions([newTransaction, ...transactions]);
    setIsTransactionModalVisible(false);
    transactionForm.resetFields();
    message.success('交易记录添加成功！');
  };

  const inventoryColumns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string, record: InventoryItem) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>SKU: {record.sku}</div>
          <div style={{ color: '#1890ff', fontSize: '12px' }}>¥{record.price}</div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: InventoryItem) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{quantity}</div>
          <Progress
            percent={Math.min(100, (quantity / record.minQuantity) * 100)}
            size="small"
            status={quantity === 0 ? 'exception' : quantity <= record.minQuantity ? 'active' : 'success'}
          />
        </div>
      )
    },
    {
      title: '最低库存',
      dataIndex: 'minQuantity',
      key: 'minQuantity'
    },
    {
      title: '库位',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Tag icon={<EnvironmentOutlined />} color="green">{location}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          in_stock: { text: '库存充足', color: 'green' },
          low_stock: { text: '库存不足', color: 'orange' },
          out_of_stock: { text: '缺货', color: 'red' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color} icon={<AlertOutlined />}>{config.text}</Tag>;
      }
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: string, record: InventoryItem) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: `${record.productName} 详情`,
                width: 600,
                content: (
                  <div>
                    <p><strong>商品名称:</strong> {record.productName}</p>
                    <p><strong>SKU编码:</strong> {record.sku}</p>
                    <p><strong>商品分类:</strong> {record.category}</p>
                    <p><strong>当前库存:</strong> {record.quantity} 件</p>
                    <p><strong>最低库存:</strong> {record.minQuantity} 件</p>
                    <p><strong>库位:</strong> {record.location}</p>
                    <p><strong>商品价格:</strong> ¥{record.price}</p>
                    <p><strong>库存状态:</strong>
                      {record.status === 'in_stock' ? '库存充足' :
                        record.status === 'low_stock' ? '库存不足' : '缺货'}
                    </p>
                    <p><strong>最后更新:</strong> {record.lastUpdated}</p>
                  </div>
                )
              });
            }}
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
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这个库存项目吗？',
                onOk: () => {
                  setInventory(inventory.filter(item => item.id !== record.id));
                  message.success('库存项目删除成功！');
                }
              });
            }}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const transactionColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag
          color={type === 'in' ? 'green' : 'red'}
          icon={type === 'in' ? <InboxOutlined /> : <ExportOutlined />}
        >
          {type === 'in' ? '入库' : '出库'}
        </Tag>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string, record: Transaction) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>SKU: {record.sku}</div>
        </div>
      )
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: Transaction) => (
        <span style={{
          color: record.type === 'in' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {record.type === 'in' ? '+' : '-'}{quantity}
        </span>
      )
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes'
    }
  ];

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  // const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <PermissionGuard permission={PERMISSIONS.WAREHOUSE_ACCESS}>
      <div className="warehouse-page">
        <div className="container">
          <div className="page-header">
            <h1>仓库管理</h1>
            <p>管理库存、查看交易记录和库位信息</p>
          </div>

          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总商品数"
                  value={totalItems}
                  prefix={<BankOutlined />}
                  suffix="种"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总库存量"
                  value={totalQuantity}
                  prefix={<InboxOutlined />}
                  suffix="件"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="库存总价值"
                  value={totalValue}
                  precision={0}
                  prefix="¥"
                  suffix="元"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="库存不足"
                  value={lowStockItems}
                  prefix={<AlertOutlined />}
                  suffix="种"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 库存预警提示 */}
          {lowStockItems > 0 && (
            <Card
              style={{
                marginBottom: 16,
                border: '1px solid #fa8c16',
                backgroundColor: '#fff7e6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
                  库存预警：当前有 {lowStockItems} 种商品库存不足，请及时补货！
                </span>
              </div>
            </Card>
          )}

          <Tabs
            defaultActiveKey="inventory"
            items={[
              {
                key: 'inventory',
                label: '库存管理',
                children: (
                  <Card
                    title="库存列表"
                    extra={
                      <Space>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setIsAddModalVisible(true)}
                        >
                          添加商品
                        </Button>
                        <Button
                          icon={<InboxOutlined />}
                          onClick={() => setIsTransactionModalVisible(true)}
                        >
                          入库/出库
                        </Button>
                        <Button
                          icon={<ReloadOutlined />}
                          onClick={handleAutoStockIn}
                        >
                          自动入库
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            // 测试库存减少功能
                            const testItems = [
                              { name: 'iPhone 15 Pro', quantity: 2 },
                              { name: 'iPad Air', quantity: 1 }
                            ];
                            console.log('手动测试库存减少:', testItems);
                            handlePurchaseStockOut(testItems);
                            message.info('已模拟购买商品，库存已相应减少');
                          }}
                        >
                          测试库存减少
                        </Button>
                        <Button
                          danger
                          onClick={() => {
                            Modal.confirm({
                              title: '确认清空库存',
                              content: '这将清空所有库存数据并重新初始化，确定继续吗？',
                              onOk: () => {
                                setInventory([]);
                                setTransactions([]);
                                localStorage.removeItem('warehouse_inventory');
                                localStorage.removeItem('warehouse_transactions');
                                message.success('库存已清空，正在重新初始化...');

                                // 延迟重新初始化，让用户看到清空效果
                                setTimeout(() => {
                                  const defaultInventory = mockProducts.map((product, index) => ({
                                    id: (index + 1).toString(),
                                    productName: product.name,
                                    sku: product.sku,
                                    category: product.category,
                                    quantity: 100,
                                    minQuantity: 10,
                                    location: `${String.fromCharCode(65 + Math.floor(index / 5))}区-${String(Math.floor(index % 5) + 1).padStart(2, '0')}-${String(index % 10 + 1).padStart(2, '0')}`,
                                    status: 'in_stock' as const,
                                    lastUpdated: new Date().toLocaleString(),
                                    price: product.price
                                  }));
                                  setInventory(defaultInventory);
                                  localStorage.setItem('warehouse_inventory', JSON.stringify(defaultInventory));
                                  message.success('库存重新初始化完成！');
                                }, 1000);
                              }
                            });
                          }}
                        >
                          清空库存
                        </Button>
                      </Space>
                    }
                  >
                    <Table
                      dataSource={inventory}
                      columns={inventoryColumns}
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
              },
              {
                key: 'transactions',
                label: '交易记录',
                children: (
                  <Card title="入库/出库记录">
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

          {/* 添加库存项目模态框 */}
          <Modal
            title="添加库存项目"
            open={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddInventory}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="productName"
                    label="商品名称"
                    rules={[{ required: true, message: '请输入商品名称' }]}
                  >
                    <Input placeholder="请输入商品名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sku"
                    label="SKU编码"
                    rules={[{ required: true, message: '请输入SKU编码' }]}
                  >
                    <Input placeholder="请输入SKU编码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="商品分类"
                    rules={[{ required: true, message: '请选择商品分类' }]}
                  >
                    <Select placeholder="请选择商品分类">
                      <Option value="数码产品">数码产品</Option>
                      <Option value="服装配饰">服装配饰</Option>
                      <Option value="家居用品">家居用品</Option>
                      <Option value="美妆护肤">美妆护肤</Option>
                      <Option value="运动户外">运动户外</Option>
                      <Option value="图书文具">图书文具</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="商品价格"
                    rules={[{ required: true, message: '请输入商品价格' }]}
                  >
                    <Input type="number" placeholder="请输入价格" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="库位"
                    rules={[{ required: true, message: '请输入库位' }]}
                  >
                    <Input placeholder="例如：A区-01-01" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="初始库存"
                    rules={[{ required: true, message: '请输入初始库存' }]}
                  >
                    <Input type="number" placeholder="请输入数量" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="minQuantity"
                label="最低库存"
                rules={[{ required: true, message: '请输入最低库存' }]}
              >
                <Input type="number" placeholder="请输入数量" min={0} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  添加库存项目
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* 入库/出库模态框 */}
          <Modal
            title="入库/出库操作"
            open={isTransactionModalVisible}
            onCancel={() => setIsTransactionModalVisible(false)}
            footer={null}
            width={500}
          >
            <Form
              form={transactionForm}
              layout="vertical"
              onFinish={handleAddTransaction}
            >
              <Form.Item
                name="type"
                label="操作类型"
                rules={[{ required: true, message: '请选择操作类型' }]}
              >
                <Select placeholder="请选择操作类型">
                  <Option value="in">入库</Option>
                  <Option value="out">出库</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="sku"
                label="商品SKU"
                rules={[{ required: true, message: '请选择商品' }]}
              >
                <Select placeholder="请选择商品">
                  {inventory.map(item => (
                    <Option key={item.sku} value={item.sku}>
                      {item.productName} ({item.sku})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="quantity"
                label="数量"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <Input type="number" placeholder="请输入数量" min={1} />
              </Form.Item>

              <Form.Item
                name="operator"
                label="操作员"
                rules={[{ required: true, message: '请输入操作员姓名' }]}
              >
                <Input placeholder="请输入操作员姓名" />
              </Form.Item>

              <Form.Item
                name="notes"
                label="备注"
              >
                <Input.TextArea placeholder="请输入备注信息" rows={3} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  确认操作
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default Warehouse; 