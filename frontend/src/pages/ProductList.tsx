import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, Pagination, Empty, Spin, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useCartStore } from '../stores/cartStore';
import './ProductList.css';

const { Search } = Input;
const { Option } = Select;

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
    'Levis 501牛仔裤': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
    'Uniqlo羽绒服': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    'Zara连衣裙': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    'HM T恤': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    'Coach钱包': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    'Ray-Ban墨镜': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    'Casio手表': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
    'Hermes丝巾': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',

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

// 获取商品图片
const getProductImage = (productName: string) => {
    return productImages[productName as keyof typeof productImages] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
};

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [category, setCategory] = useState('');
    const { addToCart } = useCartStore();

    // 从路由状态获取分类参数
    useEffect(() => {
        if (location.state?.category) {
            setCategory(location.state.category);
        }
    }, [location.state]);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        message.success(`已将 ${product.name} 添加到购物车`);
    };

    // 获取商品数据
    const { data: productsResponse, isLoading } = useQuery({
        queryKey: ['products', searchKeyword, category],
        queryFn: async () => {
            if (searchKeyword) {
                // 如果有搜索关键词，调用搜索API
                return await productApi.searchProducts(searchKeyword);
            } else if (category) {
                // 如果有分类筛选，调用分类API
                return await productApi.getProductsByCategory(category);
            } else {
                // 否则获取所有商品
                return await productApi.getAllProducts();
            }
        },
        staleTime: 2 * 60 * 1000, // 2分钟内不重新获取
    });

    // 安全地获取商品数据，确保是数组
    let products = Array.isArray(productsResponse?.data) ? productsResponse.data : [];

    // 前端排序
    if (products.length > 0) {
        products = [...products].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.price - b.price;
                case 'createdAt':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                default:
                    return 0;
            }
        });
    }

    // 分页处理
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const total = products.length;

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size) setPageSize(size);
    };

    const categories = [
        { value: '', label: '全部分类' },
        { value: '数码产品', label: '数码产品' },
        { value: '服装配饰', label: '服装配饰' },
        { value: '家居用品', label: '家居用品' },
        { value: '美妆护肤', label: '美妆护肤' },
        { value: '运动户外', label: '运动户外' },
        { value: '图书文具', label: '图书文具' },
    ];

    const sortOptions = [
        { value: 'name', label: '名称排序' },
        { value: 'price', label: '价格排序' },
        { value: 'createdAt', label: '最新上架' },
    ];

    return (
        <div className="product-list-page">
            <div className="container">
                {/* 搜索和筛选区域 */}
                <div className="filter-section">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="搜索商品..."
                                onSearch={handleSearch}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <Select
                                value={category}
                                onChange={handleCategoryChange}
                                style={{ width: '100%' }}
                                placeholder="选择分类"
                            >
                                {categories.map(cat => (
                                    <Option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                style={{ width: '100%' }}
                                placeholder="排序方式"
                            >
                                {sortOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* 商品列表 */}
                <div className="products-section">
                    {isLoading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <p>加载中...</p>
                        </div>
                    ) : paginatedProducts.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {paginatedProducts.map((product) => (
                                    <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                                        <Card
                                            className="product-card"
                                            hoverable
                                            cover={
                                                <div className="product-image">
                                                    <img
                                                        alt={product.name}
                                                        src={getProductImage(product.name)}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                                                        }}
                                                    />
                                                    <div className="product-actions">
                                                        <Button
                                                            type="primary"
                                                            shape="circle"
                                                            icon={<ShoppingCartOutlined />}
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToCart(product);
                                                            }}
                                                        />
                                                        <Button
                                                            shape="circle"
                                                            icon={<EyeOutlined />}
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/products/${product.id}`);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            onClick={() => navigate(`/products/${product.id}`)}
                                        >
                                            <Card.Meta
                                                title={
                                                    <div className="product-title">
                                                        {product.name}
                                                    </div>
                                                }
                                                description={
                                                    <div className="product-info">
                                                        <div className="product-price">
                                                            ¥{product.price.toFixed(2)}
                                                        </div>
                                                        <div className="product-category">
                                                            {product.category}
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* 分页 */}
                            <div className="pagination-container">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        <Empty
                            description="暂无商品"
                            style={{ margin: '40px 0' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList; 