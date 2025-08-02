import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, InputNumber, Empty, message, Divider, Typography, Tag, Alert } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import './Cart.css';

const { Title, Text } = Typography;

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

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);

  // 加载库存数据
  useEffect(() => {
    const savedInventory = localStorage.getItem('warehouse_inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // 检查库存状态
  useEffect(() => {
    const warnings: string[] = [];

    items.forEach(item => {
      const inventoryItem = inventory.find(inv => inv.productName === item.name);
      if (inventoryItem) {
        if (inventoryItem.quantity === 0) {
          warnings.push(`${item.name} 已缺货，无法购买`);
        } else if (item.quantity > inventoryItem.quantity) {
          warnings.push(`${item.name} 库存不足，当前库存: ${inventoryItem.quantity}，您选择: ${item.quantity}`);
        } else if (inventoryItem.quantity <= inventoryItem.minQuantity) {
          warnings.push(`${item.name} 库存紧张，仅剩 ${inventoryItem.quantity} 件`);
        }
      }
    });

    setStockWarnings(warnings);
  }, [items, inventory]);

  const handleQuantityChange = (productId: number, quantity: number) => {
    const item = items.find(i => i.id === productId);
    if (item) {
      const inventoryItem = inventory.find(inv => inv.productName === item.name);
      if (inventoryItem && quantity > inventoryItem.quantity) {
        message.warning(`${item.name} 库存不足，最大可购买数量: ${inventoryItem.quantity}`);
        return;
      }
    }
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    message.success('商品已从购物车移除');
  };

  const handleClearCart = () => {
    clearCart();
    message.success('购物车已清空');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('购物车为空，请先添加商品');
      return;
    }

    // 检查是否有库存不足的商品
    const hasStockIssues = stockWarnings.some(warning =>
      warning.includes('已缺货') || warning.includes('库存不足')
    );

    if (hasStockIssues) {
      message.error('部分商品库存不足，请调整数量后重新结算');
      return;
    }

    message.success('跳转到结算页面...');
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // 获取商品库存状态
  const getStockStatus = (itemName: string) => {
    const inventoryItem = inventory.find(inv => inv.productName === itemName);
    if (!inventoryItem) return { status: 'unknown', text: '库存未知', color: 'default' };

    if (inventoryItem.quantity === 0) {
      return { status: 'out_of_stock', text: '缺货', color: 'red' };
    } else if (inventoryItem.quantity <= inventoryItem.minQuantity) {
      return { status: 'low_stock', text: '库存紧张', color: 'orange' };
    } else {
      return { status: 'in_stock', text: '库存充足', color: 'green' };
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleContinueShopping}
              style={{ marginBottom: 16 }}
            >
              继续购物
            </Button>
            <Title level={2}>购物车</Title>
          </div>
          <div className="empty-cart">
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description="购物车是空的"
            >
              <Button type="primary" onClick={handleContinueShopping}>
                去购物
              </Button>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleContinueShopping}
            style={{ marginBottom: 16 }}
          >
            继续购物
          </Button>
          <Title level={2}>购物车 ({getTotalItems()} 件商品)</Title>
        </div>

        {/* 库存警告 */}
        {stockWarnings.length > 0 && (
          <Alert
            message="库存提醒"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {stockWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="cart-items-card">
              <div className="cart-items-header">
                <Title level={4}>商品列表</Title>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearCart}
                >
                  清空购物车
                </Button>
              </div>

              <div className="cart-items">
                {items.map((item) => {
                  const stockStatus = getStockStatus(item.name);
                  const inventoryItem = inventory.find(inv => inv.productName === item.name);
                  const maxQuantity = inventoryItem ? inventoryItem.quantity : 99;

                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-category">{item.category}</div>
                        <div className="cart-item-price">¥{item.price}</div>
                        <div style={{ marginTop: 4 }}>
                          <Tag color={stockStatus.color} icon={<ExclamationCircleOutlined />}>
                            {stockStatus.text}
                          </Tag>
                          {inventoryItem && (
                            <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>
                              库存: {inventoryItem.quantity} 件
                            </Text>
                          )}
                        </div>
                      </div>
                      <div className="cart-item-quantity">
                        <InputNumber
                          min={1}
                          max={maxQuantity}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.id, value || 1)}
                          style={{ width: 80 }}
                          disabled={stockStatus.status === 'out_of_stock'}
                        />
                        {stockStatus.status === 'out_of_stock' && (
                          <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: 4 }}>
                            已缺货
                          </div>
                        )}
                      </div>
                      <div className="cart-item-total">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="cart-item-actions">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveItem(item.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="cart-summary-card">
              <Title level={4}>订单摘要</Title>
              <Divider />

              <div className="summary-item">
                <Text>商品总数：</Text>
                <Text strong>{getTotalItems()} 件</Text>
              </div>

              <div className="summary-item">
                <Text>商品总价：</Text>
                <Text strong style={{ color: '#fa8c16', fontSize: '18px' }}>
                  ¥{getTotalPrice().toFixed(2)}
                </Text>
              </div>

              <Divider />

              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={handleCheckout}
                style={{ marginBottom: 12 }}
                disabled={stockWarnings.some(warning =>
                  warning.includes('已缺货') || warning.includes('库存不足')
                )}
              >
                去结算
              </Button>

              <Button
                block
                onClick={handleContinueShopping}
              >
                继续购物
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart; 