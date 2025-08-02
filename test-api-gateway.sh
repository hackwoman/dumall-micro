#!/bin/bash

echo "🚀 API网关集成测试"
echo "=================="

# 检查服务状态
echo "📋 检查服务状态..."
echo "Nginx API网关:"
if curl -s http://localhost/gateway/health > /dev/null; then
    echo "  ✅ API网关运行正常"
else
    echo "  ❌ API网关未运行"
fi

echo "后端服务:"
for port in 8081 8082 8083 8084; do
    if curl -s http://localhost:$port/actuator/health > /dev/null; then
        echo "  ✅ 端口 $port 服务正常"
    else
        echo "  ❌ 端口 $port 服务异常"
    fi
done

echo "前端服务:"
if curl -s http://localhost:5174 > /dev/null; then
    echo "  ✅ 前端服务运行正常"
else
    echo "  ❌ 前端服务未运行"
fi

echo ""
echo "🔍 测试API网关路由..."

# 测试商品服务
echo "📦 测试商品服务路由:"
if curl -s http://localhost/api/products | grep -q "timestamp"; then
    echo "  ✅ 商品服务路由正常"
else
    echo "  ❌ 商品服务路由异常"
fi

# 测试用户服务
echo "👤 测试用户服务路由:"
if curl -s http://localhost/api/user/users | grep -q "timestamp"; then
    echo "  ✅ 用户服务路由正常"
else
    echo "  ❌ 用户服务路由异常"
fi

# 测试前端代理
echo "🌐 测试前端代理到API网关:"
if curl -s http://localhost:5174/api/products | grep -q "timestamp"; then
    echo "  ✅ 前端代理到API网关正常"
else
    echo "  ❌ 前端代理到API网关异常"
fi

echo ""
echo "📊 测试结果汇总:"
echo "=================="
echo "1. API网关: $(curl -s http://localhost/gateway/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
echo "2. 商品服务: $(curl -s http://localhost/api/products | grep -o '"status":[0-9]*' | cut -d':' -f2 || echo 'ERROR')"
echo "3. 前端代理: $(curl -s http://localhost:5174/api/products | grep -o '"status":[0-9]*' | cut -d':' -f2 || echo 'ERROR')"

echo ""
echo "🎯 下一步操作建议:"
echo "1. 在浏览器中访问 http://localhost:5174"
echo "2. 测试商品列表页面"
echo "3. 测试用户登录功能"
echo "4. 测试购物车和支付流程" 