import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, InputNumber, Tabs, Tag, Divider, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import './ProductDetail.css';

const { Title, Text, Paragraph } = Typography;

// 商品图片映射
const productImages = {
    'iPhone 15 Pro': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
    'MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    'AirPods Pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop',
    'iPad Air': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    'Apple Watch Series 9': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=500&h=500&fit=crop',
    '机械键盘': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
    '无线鼠标': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    '显示器': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
    'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
    'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    'Adidas Ultraboost': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    '游戏手柄': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop'
};

// 获取商品图片
const getProductImage = (productName: string) => {
    return productImages[productName as keyof typeof productImages] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop';
};

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);

    // 获取商品详情
    const { data: productResponse, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductById(Number(id)),
        enabled: !!id,
    });

    const product = productResponse?.data;

    console.log('ProductDetail - 商品数据:', product);
    console.log('ProductDetail - 加载状态:', isLoading);
    console.log('ProductDetail - 错误状态:', error);

    const handleAddToCart = () => {
        if (product) {
            // 添加指定数量的商品到购物车
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            message.success(`已将 ${quantity} 件 ${product.name} 添加到购物车`);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            // 添加指定数量的商品到购物车
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            message.success(`已将 ${quantity} 件 ${product.name} 添加到购物车`);
            navigate('/cart');
        }
    };

    if (isLoading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div>加载中...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="error-container">
                        <div>商品不存在或加载失败</div>
                        <Button type="primary" onClick={() => navigate('/products')}>
                            返回商品列表
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="container">
                <Row gutter={[32, 32]}>
                    {/* 商品图片 */}
                    <Col xs={24} md={12}>
                        <Card className="product-image-card">
                            <div className="product-image">
                                <img
                                    src={product.imageUrl || getProductImage(product.name)}
                                    alt={product.name}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop';
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* 商品信息 */}
                    <Col xs={24} md={12}>
                        <Card className="product-info-card">
                            <Title level={2} className="product-name">
                                {product.name}
                            </Title>

                            <div className="product-meta">
                                <Tag color="blue">{product.category}</Tag>
                                {product.stock < 10 && (
                                    <Tag color="red">库存紧张</Tag>
                                )}
                            </div>

                            <div className="product-price">
                                <Text className="price-label">价格：</Text>
                                <Text className="price-value">¥{product.price.toFixed(2)}</Text>
                            </div>

                            <div className="product-stock">
                                <Text className="stock-label">库存：</Text>
                                <Text className="stock-value">{product.stock} 件</Text>
                            </div>

                            <Divider />

                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <Text className="quantity-label">数量：</Text>
                                    <InputNumber
                                        min={1}
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(value) => setQuantity(value || 1)}
                                        size="large"
                                    />
                                </div>

                                <div className="action-buttons">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        style={{ marginRight: 12 }}
                                    >
                                        加入购物车
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleBuyNow}
                                        disabled={product.stock === 0}
                                    >
                                        立即购买
                                    </Button>
                                </div>

                                <div className="secondary-actions">
                                    <Button icon={<HeartOutlined />} size="large">
                                        收藏
                                    </Button>
                                    <Button icon={<ShareAltOutlined />} size="large">
                                        分享
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* 商品详情标签页 */}
                <Row style={{ marginTop: 32 }}>
                    <Col span={24}>
                        <Card className="product-detail-card">
                            <Tabs
                                defaultActiveKey="description"
                                items={[
                                    {
                                        key: 'description',
                                        label: '商品详情',
                                        children: (
                                            <div className="product-description">
                                                <Paragraph>
                                                    {product.description}
                                                </Paragraph>
                                                <div className="product-specs">
                                                    <Title level={4}>商品规格</Title>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <Text strong>商品名称：</Text>
                                                            <Text>{product.name}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>商品分类：</Text>
                                                            <Text>{product.category}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>商品价格：</Text>
                                                            <Text>¥{product.price.toFixed(2)}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>库存数量：</Text>
                                                            <Text>{product.stock} 件</Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'reviews',
                                        label: '用户评价',
                                        children: (
                                            <div className="product-reviews">
                                                <div className="empty-reviews">
                                                    <Text type="secondary">暂无评价</Text>
                                                    <Button type="primary" style={{ marginTop: 16 }}>
                                                        写评价
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'recommendations',
                                        label: '相关推荐',
                                        children: (
                                            <div className="product-recommendations">
                                                <div className="empty-recommendations">
                                                    <Text type="secondary">暂无相关推荐</Text>
                                                </div>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProductDetail; 