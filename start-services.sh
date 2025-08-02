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

# 启动用户服务
echo "👤 启动用户服务 (端口: 8081)..."
cd user-service
mvn spring-boot:run &
USER_PID=$!
cd ..

# 等待用户服务启动
echo "⏳ 等待用户服务启动..."
sleep 15

# 检查用户服务是否启动成功
if curl -s http://localhost:8081/actuator/health > /dev/null; then
    echo "✅ 用户服务启动成功"
else
    echo "❌ 用户服务启动失败"
    kill $USER_PID 2>/dev/null
    exit 1
fi

# 启动商品服务
echo "📦 启动商品服务 (端口: 8082)..."
cd product-service
mvn spring-boot:run &
PRODUCT_PID=$!
cd ..

# 等待商品服务启动
echo "⏳ 等待商品服务启动..."
sleep 15

# 检查商品服务是否启动成功
if curl -s http://localhost:8082/actuator/health > /dev/null; then
    echo "✅ 商品服务启动成功"
else
    echo "❌ 商品服务启动失败"
    kill $USER_PID $PRODUCT_PID 2>/dev/null
    exit 1
fi

# 启动支付服务
echo "💳 启动支付服务 (端口: 8083)..."
cd payment-service
mvn spring-boot:run &
PAYMENT_PID=$!
cd ..

# 等待支付服务启动
echo "⏳ 等待支付服务启动..."
sleep 15

# 检查支付服务是否启动成功
if curl -s http://localhost:8083/actuator/health > /dev/null; then
    echo "✅ 支付服务启动成功"
else
    echo "❌ 支付服务启动失败"
    kill $USER_PID $PRODUCT_PID $PAYMENT_PID 2>/dev/null
    exit 1
fi

# 启动仓库管理服务
echo "🏪 启动仓库管理服务 (端口: 8084)..."
cd inventory-service
mvn spring-boot:run &
INVENTORY_PID=$!
cd ..

# 等待仓库管理服务启动
echo "⏳ 等待仓库管理服务启动..."
sleep 15

# 检查仓库管理服务是否启动成功
if curl -s http://localhost:8084/actuator/health > /dev/null; then
    echo "✅ 仓库管理服务启动成功"
else
    echo "❌ 仓库管理服务启动失败"
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
echo "🛑 按 Ctrl+C 停止所有服务"

# 等待中断信号
wait 