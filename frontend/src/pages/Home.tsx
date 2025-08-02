import React from 'react';
import { Card, Row, Col, Button, Spin, Empty, message } from 'antd';
import { HeartOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import { useCartStore } from '../stores/cartStore';
import './Home.css';

// 商品图片映射
const productImages = {
  // 数码产品
  'iPhone 15 Pro': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
  'MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'AirPods Pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
  'iPad Air': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'Apple Watch Series 9': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=300&fit=crop',
  'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  '机械键盘': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  '无线鼠标': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  '显示器': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  '游戏手柄': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
  '蓝牙音箱': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  
  // 服装配饰
  'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'Adidas Ultraboost': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
  'Levi\'s 501牛仔裤': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
  'Uniqlo羽绒服': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
  'Zara连衣裙': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
  'H&M T恤': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
  'Coach钱包': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  'Ray-Ban墨镜': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
  'Casio手表': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
  'Hermès丝巾': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
  
  // 家居用品
  'IKEA沙发': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  'MUJI床品四件套': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
  'Philips台灯': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
  'Dyson吸尘器': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  '小米空气净化器': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  '宜家书桌': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '无印良品收纳盒': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '美的电饭煲': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '苏泊尔炒锅': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '海尔冰箱': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  
  // 美妆护肤
  'SK-II神仙水': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '兰蔻小黑瓶': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '雅诗兰黛小棕瓶': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  'MAC口红': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
  'YSL粉底液': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '资生堂防晒霜': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '倩碧黄油': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '欧莱雅眼霜': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '植村秀卸妆油': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  '悦诗风吟面膜': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  
  // 运动户外
  'Nike运动鞋': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'Adidas运动服': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
  'Under Armour健身裤': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
  'Lululemon瑜伽垫': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
  'The North Face冲锋衣': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
  'Columbia登山鞋': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'Patagonia背包': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  'Garmin运动手表': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
  'Wilson网球拍': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
  'Nike篮球': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
  
  // 图书文具
  '《三体》科幻小说': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  '《百年孤独》': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  '《人类简史》': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  '《活着》': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  '《解忧杂货店》': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  'Pilot钢笔': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'Moleskine笔记本': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'Staedtler铅笔': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '得力计算器': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  '晨光中性笔': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
};

// 默认图片
const defaultImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { data: productsResponse, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.getAllProducts(),
        staleTime: 5 * 60 * 1000, // 5分钟
    });

    const products = productsResponse?.data || [];
    const { addToCart } = useCartStore();

    console.log('Home组件渲染 - 商品数据:', products);
    console.log('Home组件渲染 - 加载状态:', isLoading);
    console.log('Home组件渲染 - 错误状态:', error);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        message.success(`已将 ${product.name} 添加到购物车`);
    };

    const handleAddToWishlist = (product: any) => {
        message.success(`已将 ${product.name} 添加到收藏`);
    };

    const handleViewProduct = (product: any) => {
        message.info(`查看 ${product.name} 详情`);
    };

    // 获取商品图片
    const getProductImage = (productName: string) => {
        return productImages[productName as keyof typeof productImages] || defaultImage;
    };

    if (isLoading) {
        return (
            <div className="home-page">
                <div className="container">
                    <div className="loading-container">
                        <Spin size="large" />
                        <p style={{ marginTop: 16 }}>正在加载商品...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-page">
                <div className="container">
                    <div className="loading-container">
                        <Empty description="加载商品失败，请稍后重试" />
                    </div>
                </div>
            </div>
        );
    }

    const safeProducts = Array.isArray(products) ? products : [];

    return (
        <div className="home-page">
            <div className="container">
                {/* 商品分类 */}
                <div className="category-section">
                    <h2 className="section-title">商品分类</h2>
                    <Row gutter={[16, 16]}>
                        {[
                            { name: '数码产品', icon: '📱', color: '#722ed1', key: 'digital' },
                            { name: '服装配饰', icon: '👕', color: '#52c41a', key: 'clothing' },
                            { name: '家居用品', icon: '🏠', color: '#fa8c16', key: 'home' },
                            { name: '美妆护肤', icon: '💄', color: '#eb2f96', key: 'beauty' },
                            { name: '运动户外', icon: '⚽', color: '#722ed1', key: 'sports' },
                            { name: '图书文具', icon: '📚', color: '#13c2c2', key: 'books' }
                        ].map((category, index) => (
                            <Col xs={12} sm={8} md={4} key={index}>
                                <Card
                                    className="category-card"
                                    hoverable
                                    onClick={() => {
                                        message.info(`正在跳转到${category.name}分类...`);
                                        // 这里可以跳转到分类页面或筛选商品
                                        navigate('/products', {
                                            state: { category: category.name },
                                            replace: true
                                        });
                                    }}
                                >
                                    <div className="category-icon" style={{ color: category.color }}>
                                        {category.icon}
                                    </div>
                                    <div className="category-name">{category.name}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* 热门商品 */}
                <div className="products-section">
                    <h2 className="section-title">热门商品</h2>
                    {safeProducts.length === 0 ? (
                        <div className="empty-products">
                            <Empty description="暂无商品数据" />
                        </div>
                    ) : (
                        <Row gutter={[16, 16]}>
                            {safeProducts.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <Card className="product-card" hoverable>
                                        <div className="product-image">
                                            <img
                                                src={getProductImage(product.name)}
                                                alt={product.name}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = defaultImage;
                                                }}
                                            />
                                            <div className="product-actions">
                                                <Button
                                                    type="text"
                                                    icon={<HeartOutlined />}
                                                    onClick={() => handleAddToWishlist(product)}
                                                    style={{ color: 'white', background: 'rgba(0,0,0,0.5)' }}
                                                />
                                                <Button
                                                    type="text"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => handleViewProduct(product)}
                                                    style={{ color: 'white', background: 'rgba(0,0,0,0.5)' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px' }}>
                                            <div className="product-title">
                                                <span>{product.name}</span>
                                            </div>
                                            <div className="product-info">
                                                <span className="product-price">¥{product.price}</span>
                                                <span className="product-category">{product.category}</span>
                                            </div>
                                            <Button
                                                type="primary"
                                                icon={<ShoppingCartOutlined />}
                                                onClick={() => handleAddToCart(product)}
                                                style={{ width: '100%', marginTop: 8 }}
                                            >
                                                加入购物车
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home; 