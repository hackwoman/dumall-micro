# Dumall 微服务 Sealos Cloud 部署指南

## 📋 概述

本指南专门针对Sealos Cloud环境，提供完整的微服务部署方案。Sealos是一个基于Kubernetes的云操作系统，提供了简化的容器化应用部署和管理体验。

## 🏗️ Sealos部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 前端    │    │   Nginx 网关    │    │   Spring Boot   │
│   (5174端口)    │◄──►│   (80端口)      │◄──►│   微服务集群     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │   Sealos Cloud  │
                    │   Kubernetes    │
                    │   集群管理       │
                    └─────────────────┘
```

## 🚀 部署方案

### 方案一：使用Sealos应用商店（推荐）

#### 1. 准备工作
- 确保已登录Sealos Cloud控制台
- 确保有足够的资源配额
- 准备Docker镜像仓库

#### 2. 快速部署
```bash
# 克隆项目
git clone https://github.com/hackwoman/dumall-micro.git
cd dumall-micro

# 给部署脚本执行权限
chmod +x sealos/deploy-sealos.sh

# 执行部署
./sealos/deploy-sealos.sh v1.0.0
```

### 方案二：手动部署

#### 1. 构建镜像
```bash
# 构建公共模块
cd dumall-common && mvn clean install -DskipTests

# 构建微服务镜像
for service in user-service product-service payment-service inventory-service; do
  cd $service
  mvn clean package -DskipTests
  docker build -t hackwoman/dumall-$service:latest .
  docker push hackwoman/dumall-$service:latest
  cd ..
done

# 构建前端镜像
cd frontend
npm ci && npm run build
docker build -t hackwoman/dumall-frontend:latest .
docker push hackwoman/dumall-frontend:latest
cd ..
```

#### 2. 部署到Sealos
```bash
# 创建命名空间和基础配置
kubectl apply -f sealos/app.yaml

# 部署微服务
kubectl apply -f sealos/services.yaml

# 部署前端和网关
kubectl apply -f sealos/frontend-gateway.yaml
```

### 方案三：使用Sealos控制台

#### 1. 通过Sealos控制台部署
1. 登录Sealos Cloud控制台
2. 进入"应用管理"页面
3. 点击"创建应用"
4. 选择"从YAML创建"
5. 上传或粘贴部署配置文件
6. 点击"创建"

#### 2. 配置文件说明
- `sealos/app.yaml`: 基础配置（命名空间、数据库、Redis）
- `sealos/services.yaml`: 微服务部署配置
- `sealos/frontend-gateway.yaml`: 前端和网关配置

## 🔧 Sealos特有配置

### 1. 资源管理
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### 2. 持久化存储
```yaml
persistentVolumeClaim:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### 3. 健康检查
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health
    port: 8081
  initialDelaySeconds: 60
  periodSeconds: 30
readinessProbe:
  httpGet:
    path: /actuator/health
    port: 8081
  initialDelaySeconds: 30
  periodSeconds: 10
```

## 📊 监控和管理

### 1. Sealos控制台监控
- 在Sealos控制台中查看应用状态
- 监控资源使用情况
- 查看服务日志

### 2. kubectl命令行管理
```bash
# 查看Pod状态
kubectl get pods -n dumall

# 查看服务状态
kubectl get services -n dumall

# 查看部署状态
kubectl get deployments -n dumall

# 查看日志
kubectl logs -f deployment/user-service -n dumall

# 扩缩容
kubectl scale deployment user-service --replicas=3 -n dumall

# 重启服务
kubectl rollout restart deployment/user-service -n dumall
```

### 3. 外部访问
```bash
# 获取外部IP
kubectl get service dumall-ingress -n dumall

# 端口转发（开发调试）
kubectl port-forward service/dumall-ingress 8080:80 -n dumall
```

## 🔐 安全配置

### 1. 密钥管理
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dumall-secrets
  namespace: dumall
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
  JWT_SECRET: <base64-encoded-jwt-secret>
```

### 2. 网络策略
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: dumall-network-policy
  namespace: dumall
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: dumall
```

## 📈 性能优化

### 1. 资源优化
- 根据实际负载调整CPU和内存限制
- 使用HPA（Horizontal Pod Autoscaler）自动扩缩容
- 配置资源配额防止资源滥用

### 2. 网络优化
- 使用Service Mesh（如Istio）进行流量管理
- 配置负载均衡策略
- 优化网络策略

### 3. 存储优化
- 使用SSD存储提高数据库性能
- 配置存储类（StorageClass）
- 定期备份数据

## 🚨 故障处理

### 1. 常见问题
- Pod启动失败
- 服务无法访问
- 数据库连接问题
- 镜像拉取失败

### 2. 故障排查
```bash
# 检查Pod状态
kubectl describe pod <pod-name> -n dumall

# 查看事件
kubectl get events -n dumall --sort-by='.lastTimestamp'

# 检查服务配置
kubectl describe service <service-name> -n dumall

# 查看日志
kubectl logs <pod-name> -n dumall
```

### 3. 恢复策略
- 自动重启：配置restartPolicy
- 回滚部署：kubectl rollout undo
- 数据备份：定期备份数据库

## 🔄 持续部署

### 1. 使用Sealos CI/CD
- 配置GitHub Actions
- 自动构建和推送镜像
- 自动部署到Sealos

### 2. 蓝绿部署
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: user-service-rollout
spec:
  replicas: 2
  strategy:
    blueGreen:
      activeService: user-service-active
      previewService: user-service-preview
```

### 3. 金丝雀发布
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: user-service-rollout
spec:
  replicas: 2
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {}
      - setWeight: 100
```

## 📝 部署检查清单

### 部署前检查
- [ ] Sealos集群状态正常
- [ ] 镜像仓库可访问
- [ ] 资源配额充足
- [ ] 网络配置正确
- [ ] 密钥配置完成

### 部署后检查
- [ ] 所有Pod状态为Running
- [ ] 服务可正常访问
- [ ] 健康检查通过
- [ ] 外部IP已分配
- [ ] 功能测试通过

## 🎯 最佳实践

### 1. 资源管理
- 合理设置资源请求和限制
- 使用资源配额管理
- 监控资源使用情况

### 2. 安全实践
- 使用RBAC控制访问权限
- 定期更新密钥
- 配置网络策略

### 3. 监控实践
- 配置Prometheus监控
- 设置告警规则
- 定期查看日志

## 📞 技术支持

### 联系方式
- Sealos官方文档: https://sealos.io/docs
- 项目地址: https://github.com/hackwoman/dumall-micro
- 问题反馈: 通过GitHub Issues

### 有用链接
- Sealos控制台: 您的Sealos Cloud控制台地址
- 应用状态: 在控制台中查看
- 日志查看: kubectl logs 或控制台

---

**最后更新**: 2025-08-02
**版本**: 1.0.0
**适用环境**: Sealos Cloud 