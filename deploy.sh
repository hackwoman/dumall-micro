#!/bin/bash

# Dumall 微服务部署脚本
# 支持开发、测试、生产环境部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 环境变量
ENVIRONMENT=${1:-development}
VERSION=${2:-latest}
REGISTRY=${3:-localhost:5000}

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

# 检查依赖
check_dependencies() {
    log_info "检查部署依赖..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    # 检查Maven
    if ! command -v mvn &> /dev/null; then
        log_error "Maven未安装，请先安装Maven"
        exit 1
    fi
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js未安装，请先安装Node.js"
        exit 1
    fi
    
    log_success "所有依赖检查通过"
}

# 构建公共模块
build_common_module() {
    log_info "构建公共模块..."
    cd dumall-common
    mvn clean install -DskipTests
    cd ..
    log_success "公共模块构建完成"
}

# 构建微服务
build_microservices() {
    log_info "构建微服务..."
    
    services=("user-service" "product-service" "payment-service" "inventory-service")
    
    for service in "${services[@]}"; do
        log_info "构建 $service..."
        cd $service
        mvn clean package -DskipTests
        cd ..
    done
    
    log_success "所有微服务构建完成"
}

# 构建Docker镜像
build_docker_images() {
    log_info "构建Docker镜像..."
    
    # 构建微服务镜像
    docker-compose build --no-cache
    
    # 标记镜像
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "标记生产镜像..."
        docker tag dumall-user-service:latest $REGISTRY/dumall-user-service:$VERSION
        docker tag dumall-product-service:latest $REGISTRY/dumall-product-service:$VERSION
        docker tag dumall-payment-service:latest $REGISTRY/dumall-payment-service:$VERSION
        docker tag dumall-inventory-service:latest $REGISTRY/dumall-inventory-service:$VERSION
        docker tag dumall-frontend:latest $REGISTRY/dumall-frontend:$VERSION
    fi
    
    log_success "Docker镜像构建完成"
}

# 推送镜像到仓库
push_images() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "推送镜像到仓库..."
        
        docker push $REGISTRY/dumall-user-service:$VERSION
        docker push $REGISTRY/dumall-product-service:$VERSION
        docker push $REGISTRY/dumall-payment-service:$VERSION
        docker push $REGISTRY/dumall-inventory-service:$VERSION
        docker push $REGISTRY/dumall-frontend:$VERSION
        
        log_success "镜像推送完成"
    fi
}

# 停止现有服务
stop_services() {
    log_info "停止现有服务..."
    docker-compose down --remove-orphans
    log_success "现有服务已停止"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # 生产环境使用外部数据库
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    else
        # 开发环境
        docker-compose up -d
    fi
    
    log_success "服务启动完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    services=(
        "http://localhost:8081/actuator/health"
        "http://localhost:8082/actuator/health"
        "http://localhost:8083/actuator/health"
        "http://localhost:8084/actuator/health"
        "http://localhost:5174"
    )
    
    for service in "${services[@]}"; do
        log_info "检查 $service..."
        for i in {1..30}; do
            if curl -f -s $service > /dev/null; then
                log_success "$service 健康检查通过"
                break
            fi
            if [ $i -eq 30 ]; then
                log_error "$service 健康检查失败"
                return 1
            fi
            sleep 2
        done
    done
    
    log_success "所有服务健康检查通过"
}

# 清理资源
cleanup() {
    log_info "清理构建资源..."
    docker system prune -f
    log_success "资源清理完成"
}

# 显示部署信息
show_deployment_info() {
    log_success "部署完成！"
    echo ""
    echo "🌐 访问地址:"
    echo "   前端应用: http://localhost:5174"
    echo "   API网关: http://localhost"
    echo "   用户服务: http://localhost:8081"
    echo "   商品服务: http://localhost:8082"
    echo "   支付服务: http://localhost:8083"
    echo "   仓库服务: http://localhost:8084"
    echo ""
    echo "📊 监控地址:"
    echo "   Prometheus: http://localhost:9090"
    echo "   Grafana: http://localhost:3000 (admin/admin123)"
    echo ""
    echo "🔧 管理命令:"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
}

# 主函数
main() {
    log_info "开始部署 Dumall 微服务系统..."
    log_info "环境: $ENVIRONMENT"
    log_info "版本: $VERSION"
    log_info "镜像仓库: $REGISTRY"
    echo ""
    
    check_dependencies
    build_common_module
    build_microservices
    build_docker_images
    push_images
    stop_services
    start_services
    health_check
    cleanup
    show_deployment_info
}

# 错误处理
trap 'log_error "部署过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@" 