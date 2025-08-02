 # API网关部署指南

## 概述

为Dumall电商系统添加API网关，实现统一的权限验证和路由管理。

## 部署方案

### 方案1：Nginx网关（推荐）

#### 1. 安装Nginx
```bash
sudo apt update && sudo apt install nginx
```

#### 2. 配置网关
```bash
# 使用我们的配置文件
sudo cp nginx-gateway.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl restart nginx
```

#### 3. 验证部署
```bash
curl http://localhost/gateway/health
```

### 方案2：Docker部署

#### 1. 启动完整系统
```bash
docker-compose -f docker-compose-gateway.yml up -d
```

#### 2. 检查服务状态
```bash
docker-compose -f docker-compose-gateway.yml ps
```

## 权限验证

### 公开接口
- `/api/auth/login` - 登录
- `/api/auth/register` - 注册
- `/api/product/list` - 商品列表

### 需要验证的接口
- `/api/user/**` - 用户接口
- `/api/payment/**` - 支付接口

### 需要管理员权限
- `/api/inventory/**` - 库存管理

## 使用示例

```bash
# 1. 登录获取Token
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# 2. 使用Token访问
curl -X GET http://localhost/api/inventory/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 监控

```bash
# 查看日志
sudo tail -f /var/log/nginx/access.log

# 检查状态
docker-compose -f docker-compose-gateway.yml logs
```

## 优势

1. **统一入口**：所有API通过网关
2. **权限控制**：统一验证和授权
3. **安全防护**：安全头、限流
4. **负载均衡**：支持多实例
5. **监控运维**：统一日志