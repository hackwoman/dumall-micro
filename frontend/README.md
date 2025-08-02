# Dumall 电商前端

这是一个基于 React + TypeScript + Ant Design 的现代化电商前端应用。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router DOM
- **网络请求**: Axios + React Query
- **样式**: CSS3 + 响应式设计

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── Layout.tsx      # 主布局组件
│   └── Layout.css      # 布局样式
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── ProductList.tsx # 商品列表页
│   ├── ProductDetail.tsx # 商品详情页
│   ├── Cart.tsx        # 购物车页面
│   ├── User.tsx        # 用户中心页面
│   └── *.css           # 页面样式文件
├── services/           # API服务
│   └── api.ts          # API配置和请求函数
├── stores/             # 状态管理
│   └── useStore.ts     # Zustand状态管理
├── types/              # TypeScript类型定义
│   └── index.ts        # 全局类型定义
├── utils/              # 工具函数
├── styles/             # 全局样式
├── App.tsx             # 应用入口
└── main.tsx            # 主入口文件
```

## 功能特性

### 🏠 首页
- 轮播图展示
- 商品分类导航
- 热门商品推荐
- 响应式设计

### 📦 商品管理
- 商品列表展示
- 商品搜索和筛选
- 商品详情页面
- 分类筛选功能

### 🛒 购物车
- 添加商品到购物车
- 修改商品数量
- 删除购物车商品
- 实时价格计算

### 👤 用户中心
- 用户登录/注册
- 个人资料管理
- 订单管理
- 收藏夹功能

### 🎨 设计特色
- 现代化UI设计
- 移动端优先的响应式布局
- 流畅的交互动画
- 统一的视觉风格

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 环境配置

### 后端API地址
默认后端服务地址为 `http://localhost:8081`，可在 `src/services/api.ts` 中修改。

### 端口配置
- 开发服务器: `http://localhost:5173`
- 后端API: `http://localhost:8081`

## 部署说明

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 部署 `dist` 目录到Web服务器

3. 配置反向代理，将API请求转发到后端服务

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 开发团队

- 前端开发: Dumall Team
- 设计: Dumall Design Team

## 许可证

MIT License
