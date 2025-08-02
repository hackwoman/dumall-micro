#!/bin/bash

echo "🚀 启动 Dumall 微服务..."

# 检查Java和Maven是否安装
if ! command -v java &> /dev/null; then
    echo "❌ Java未安装，请先安装Java"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven未安装，请先安装Maven"
    exit 1
fi

# 编译公共模块
echo "📦 编译公共模块..."
cd dumall-common
mvn clean install -q
if [ $? -ne 0 ]; then
    echo "❌ 公共模块编译失败"
    exit 1
fi
cd ..

# 函数：等待服务启动
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ 等待 ${service_name} 启动 (端口: ${port})..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:${port}/actuator/health > /dev/null 2>&1; then
            echo "✅ ${service_name} 启动成功"
            return 0
        fi
        
        echo "   尝试 ${attempt}/${max_attempts} - 等待中..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ ${service_name} 启动失败 - 超时"
    return 1
}

# 启动用户服务
echo "👤 启动用户服务 (端口: 8081)..."
cd user-service
mvn spring-boot:run > user-service.log 2>&1 &
USER_PID=$!
cd ..

# 等待用户服务启动
if ! wait_for_service "用户服务" "8081"; then
    echo "❌ 用户服务启动失败，查看日志:"
    tail -20 user-service/user-service.log
    kill $USER_PID 2>/dev/null
    exit 1
fi

# 启动商品服务
echo "📦 启动商品服务 (端口: 8082)..."
cd product-service
mvn spring-boot:run > product-service.log 2>&1 &
PRODUCT_PID=$!
cd ..

# 等待商品服务启动
if ! wait_for_service "商品服务" "8082"; then
    echo "❌ 商品服务启动失败，查看日志:"
    tail -20 product-service/product-service.log
    kill $USER_PID $PRODUCT_PID 2>/dev/null
    exit 1
fi

# 启动支付服务
echo "💳 启动支付服务 (端口: 8083)..."
cd payment-service
mvn spring-boot:run > payment-service.log 2>&1 &
PAYMENT_PID=$!
cd ..

# 等待支付服务启动
if ! wait_for_service "支付服务" "8083"; then
    echo "❌ 支付服务启动失败，查看日志:"
    tail -20 payment-service/payment-service.log
    kill $USER_PID $PRODUCT_PID $PAYMENT_PID 2>/dev/null
    exit 1
fi

# 启动仓库管理服务
echo "🏪 启动仓库管理服务 (端口: 8084)..."
cd inventory-service
mvn spring-boot:run > inventory-service.log 2>&1 &
INVENTORY_PID=$!
cd ..

# 等待仓库管理服务启动
if ! wait_for_service "仓库管理服务" "8084"; then
    echo "❌ 仓库管理服务启动失败，查看日志:"
    tail -20 inventory-service/inventory-service.log
    kill $USER_PID $PRODUCT_PID $PAYMENT_PID $INVENTORY_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 所有服务启动成功!"
echo ""
echo "📋 服务信息:"
echo "   👤 用户服务: http://localhost:8081"
echo "   📦 商品服务: http://localhost:8082"
echo "   💳 支付服务: http://localhost:8083"
echo "   🏪 仓库管理服务: http://localhost:8084"
echo "   🌐 前端应用: http://localhost:5173"
echo ""
echo "🔍 健康检查:"
echo "   http://localhost:8081/actuator/health"
echo "   http://localhost:8082/actuator/health"
echo "   http://localhost:8083/actuator/health"
echo "   http://localhost:8084/actuator/health"
echo ""
echo "📊 数据库控制台:"
echo "   http://localhost:8081/h2-console (用户数据库)"
echo "   http://localhost:8082/h2-console (商品数据库)"
echo "   http://localhost:8083/h2-console (支付数据库)"
echo "   http://localhost:8084/h2-console (仓库数据库)"
echo ""
echo "📝 服务日志:"
echo "   user-service/user-service.log"
echo "   product-service/product-service.log"
echo "   payment-service/payment-service.log"
echo "   inventory-service/inventory-service.log"
echo ""
echo "🛑 按 Ctrl+C 停止所有服务"

# 等待中断信号
wait 