import axios from 'axios';
import type { ApiResponse, Product, User, PaginationParams } from '../types';

// 创建axios实例 - 通过API网关访问
const api = axios.create({
    baseURL: '/api/user', // 通过API网关访问用户服务
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 商品服务API - 通过API网关访问
export const productApiClient = axios.create({
    baseURL: '/api/products', // 通过API网关访问商品服务
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 可以在这里添加token等认证信息
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// 商品服务响应拦截器
productApiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Product API Error:', error);
        return Promise.reject(error);
    }
);

// 商品相关API
export const productApi = {
    // 获取所有商品
    getAllProducts: (params?: PaginationParams): Promise<ApiResponse<Product[]>> => {
        return productApiClient.get('', { params }); // 直接访问根路径
    },

    // 根据ID获取商品
    getProductById: (id: number): Promise<ApiResponse<Product>> => {
        return productApiClient.get(`/${id}`);
    },

    // 创建商品
    createProduct: (product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
        return productApiClient.post('', product);
    },

    // 更新商品
    updateProduct: (id: number, product: Partial<Product>): Promise<ApiResponse<Product>> => {
        return productApiClient.put(`/${id}`, product);
    },

    // 删除商品
    deleteProduct: (id: number): Promise<ApiResponse<void>> => {
        return productApiClient.delete(`/${id}`);
    },

    // 根据分类获取商品
    getProductsByCategory: (category: string): Promise<ApiResponse<Product[]>> => {
        return productApiClient.get(`/category/${encodeURIComponent(category)}`);
    },

    // 搜索商品
    searchProducts: (keyword: string): Promise<ApiResponse<Product[]>> => {
        return productApiClient.get(`/search?keyword=${encodeURIComponent(keyword)}`);
    },
};

// 用户相关API
export const userApi = {
    // 用户登录
    login: (credentials: { username: string; password: string }): Promise<ApiResponse<User>> => {
        return api.post('/auth/login', credentials);
    },

    // 获取所有用户
    getAllUsers: (): Promise<ApiResponse<User[]>> => {
        return api.get('/users');
    },

    // 根据ID获取用户
    getUserById: (id: number): Promise<ApiResponse<User>> => {
        return api.get(`/users/${id}`);
    },

    // 用户注册
    register: (user: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
        return api.post('/auth/register', user);
    },

    // 创建用户
    createUser: (user: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
        return api.post('/users', user);
    },

    // 更新用户
    updateUser: (id: number, user: Partial<User>): Promise<ApiResponse<User>> => {
        return api.put(`/users/${id}`, user);
    },

    // 删除用户
    deleteUser: (id: number): Promise<ApiResponse<void>> => {
        return api.delete(`/users/${id}`);
    },
};

export default api; 