# Dumall 微服务电商系统

一个基于微服务架构的完整电商系统，包含前端React应用、后端Spring Boot微服务和Nginx API网关。

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 前端    │    │   Nginx 网关    │    │   Spring Boot   │
│   (5174端口)    │◄──►│   (80端口)      │◄──►│   微服务集群     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 技术栈

### 前端
- **React 18** - 用户界面框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design** - UI组件库
- **Zustand** - 状态管理
- **React Router** - 路由管理

### 后端
- **Spring Boot 3** - 微服务框架
- **Spring Data JPA** - 数据访问
- **H2 Database** - 内存数据库
- **Maven** - 依赖管理

### 基础设施
- **Nginx** - API网关和反向代理
- **Docker** - 容器化部署

## 📦 微服务模块

| 服务名称 | 端口 | 功能描述 |
|---------|------|----------|
| 用户服务 | 8081 | 用户注册、登录、权限管理 |
| 商品服务 | 8082 | 商品管理、分类、搜索 |
| 支付服务 | 8083 | 支付处理、订单管理 |
| 仓库服务 | 8084 | 库存管理、入库出库 |

## 🛠️ 快速开始

### 环境要求
- Node.js 18+
- Java 17+
- Maven 3.8+
- Nginx

### 1. 克隆项目
```bash
git clone https://github.com/hackwoman/dumall-micro.git
cd dumall-micro
```

### 2. 启动后端服务
```bash
# 编译公共模块
cd dumall-common && mvn clean install -DskipTests

# 启动所有微服务
./start-services-improved.sh
```

### 3. 启动前端应用
```bash
cd frontend
npm install
npm run dev
```

### 4. 配置Nginx网关
```bash
# 复制Nginx配置
sudo cp nginx-gateway.conf /etc/nginx/nginx.conf

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 🌐 访问地址

- **前端应用**: http://localhost:5174
- **API网关**: http://localhost
- **用户服务**: http://localhost:8081
- **商品服务**: http://localhost:8082
- **支付服务**: http://localhost:8083
- **仓库服务**: http://localhost:8084

## 👤 默认账户

- **管理员账户**:
  - 用户名: `admin`
  - 密码: `123456`
- **普通用户账户**:
  - 用户名: `user`
  - 密码: `123456`

## 🔧 主要功能

### 用户管理
- 用户注册和登录
- 角色权限控制（管理员/普通用户）
- 用户信息管理

### 商品管理
- 商品列表展示
- 商品分类筛选
- 商品搜索功能
- 商品详情查看

### 购物车
- 添加商品到购物车
- 购物车商品管理
- 库存检查

### 订单管理
- 订单创建和确认
- 支付流程
- 订单历史查看

### 仓库管理（仅管理员）
- 库存查看和管理
- 自动入库功能
- 手动入库/出库
- 库存预警系统
- 交易记录查看

### 支付系统
- 多种支付方式
- 支付状态跟踪
- 支付历史记录

## 🔐 权限控制

系统实现了基于角色的权限控制：

- **管理员权限**:
  - 访问仓库管理功能
  - 查看所有用户订单
  - 系统管理功能

- **普通用户权限**:
  - 浏览商品
  - 购物车操作
  - 查看个人订单

## 📊 系统监控

每个微服务都集成了Spring Boot Actuator，提供健康检查端点：

- 用户服务: http://localhost:8081/actuator/health
- 商品服务: http://localhost:8082/actuator/health
- 支付服务: http://localhost:8083/actuator/health
- 仓库服务: http://localhost:8084/actuator/health

## 🧪 测试

运行系统测试：
```bash
node test-warehouse.js
```

## 📝 开发说明

### 项目结构
```
dumall-micro/
├── frontend/                 # React前端应用
├── dumall-common/           # 公共模块
├── user-service/            # 用户服务
├── product-service/         # 商品服务
├── payment-service/         # 支付服务
├── inventory-service/       # 仓库服务
├── gateway-service/         # 网关服务
├── nginx-gateway.conf      # Nginx配置
├── start-services.sh       # 服务启动脚本
└── README.md               # 项目说明
```

### 开发流程
1. 修改代码
2. 重启相关服务
3. 测试功能
4. 提交代码

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: hackwoman
- 项目地址: https://github.com/hackwoman/dumall-micro

---

**最后更新**: 2025-08-02
**版本**: 1.0.0 