#!/bin/bash

# Dumall 微服务 Sealos Cloud 部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
NAMESPACE="dumall"
REGISTRY="hackwoman"
VERSION=${1:-latest}

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查kubectl
check_kubectl() {
    log_info "检查kubectl..."
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl未安装，请先安装kubectl"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "无法连接到Kubernetes集群，请检查kubectl配置"
        exit 1
    fi
    
    log_success "kubectl检查通过"
}

# 构建和推送镜像
build_and_push_images() {
    log_info "构建和推送Docker镜像..."
    
    # 构建公共模块
    log_info "构建公共模块..."
    cd dumall-common
    mvn clean install -DskipTests
    cd ..
    
    # 构建微服务
    services=("user-service" "product-service" "payment-service" "inventory-service")
    for service in "${services[@]}"; do
        log_info "构建 $service..."
        cd $service
        mvn clean package -DskipTests
        docker build -t $REGISTRY/dumall-$service:$VERSION .
        docker push $REGISTRY/dumall-$service:$VERSION
        cd ..
    done
    
    # 构建前端
    log_info "构建前端应用..."
    cd frontend
    npm ci
    npm run build
    docker build -t $REGISTRY/dumall-frontend:$VERSION .
    docker push $REGISTRY/dumall-frontend:$VERSION
    cd ..
    
    log_success "所有镜像构建和推送完成"
}

# 更新镜像标签
update_image_tags() {
    log_info "更新部署配置中的镜像标签..."
    
    # 更新服务配置中的镜像标签
    sed -i "s|hackwoman/dumall-.*:latest|$REGISTRY/dumall-\\1:$VERSION|g" sealos/services.yaml
    sed -i "s|hackwoman/dumall-frontend:latest|$REGISTRY/dumall-frontend:$VERSION|g" sealos/frontend-gateway.yaml
    
    log_success "镜像标签更新完成"
}

# 部署到Sealos
deploy_to_sealos() {
    log_info "开始部署到Sealos Cloud..."
    
    # 创建命名空间和基础配置
    log_info "创建命名空间和基础配置..."
    kubectl apply -f sealos/app.yaml
    
    # 等待数据库就绪
    log_info "等待数据库服务就绪..."
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s
    
    # 部署微服务
    log_info "部署微服务..."
    kubectl apply -f sealos/services.yaml
    
    # 等待微服务就绪
    log_info "等待微服务就绪..."
    services=("user-service" "product-service" "payment-service" "inventory-service")
    for service in "${services[@]}"; do
        kubectl wait --for=condition=ready pod -l app=$service -n $NAMESPACE --timeout=300s
    done
    
    # 部署前端和网关
    log_info "部署前端和网关..."
    kubectl apply -f sealos/frontend-gateway.yaml
    
    # 等待前端和网关就绪
    log_info "等待前端和网关就绪..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=nginx-gateway -n $NAMESPACE --timeout=300s
    
    log_success "部署完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查所有Pod状态
    log_info "检查Pod状态..."
    kubectl get pods -n $NAMESPACE
    
    # 检查服务状态
    log_info "检查服务状态..."
    kubectl get services -n $NAMESPACE
    
    # 获取外部访问地址
    log_info "获取外部访问地址..."
    EXTERNAL_IP=$(kubectl get service dumall-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [ -z "$EXTERNAL_IP" ]; then
        EXTERNAL_IP=$(kubectl get service dumall-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    fi
    
    if [ -n "$EXTERNAL_IP" ]; then
        log_success "外部访问地址: http://$EXTERNAL_IP"
    else
        log_warning "外部IP地址暂未分配，请稍后检查"
    fi
    
    log_success "健康检查完成"
}

# 显示部署信息
show_deployment_info() {
    log_success "Sealos Cloud 部署完成！"
    echo ""
    echo "📋 部署信息:"
    echo "   命名空间: $NAMESPACE"
    echo "   镜像仓库: $REGISTRY"
    echo "   版本: $VERSION"
    echo ""
    echo "🌐 访问地址:"
    echo "   外部访问: http://$EXTERNAL_IP (如果已分配)"
    echo "   前端应用: http://$EXTERNAL_IP"
    echo "   API网关: http://$EXTERNAL_IP/api"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看Pod: kubectl get pods -n $NAMESPACE"
    echo "   查看服务: kubectl get services -n $NAMESPACE"
    echo "   查看日志: kubectl logs -f deployment/[service-name] -n $NAMESPACE"
    echo "   扩缩容: kubectl scale deployment [service-name] --replicas=3 -n $NAMESPACE"
    echo "   删除部署: kubectl delete namespace $NAMESPACE"
    echo ""
    echo "📊 监控和日志:"
    echo "   在Sealos控制台中查看应用状态"
    echo "   使用kubectl logs查看服务日志"
    echo ""
}

# 清理资源
cleanup() {
    log_info "清理构建资源..."
    docker system prune -f
    log_success "资源清理完成"
}

# 主函数
main() {
    log_info "开始部署 Dumall 微服务到 Sealos Cloud..."
    log_info "命名空间: $NAMESPACE"
    log_info "镜像仓库: $REGISTRY"
    log_info "版本: $VERSION"
    echo ""
    
    check_kubectl
    build_and_push_images
    update_image_tags
    deploy_to_sealos
    health_check
    cleanup
    show_deployment_info
}

# 错误处理
trap 'log_error "部署过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@" 