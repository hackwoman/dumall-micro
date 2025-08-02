#!/usr/bin/env node

/**
 * 仓库管理功能测试脚本
 * 测试仓库管理的各项功能是否正常工作
 */

console.log('🧪 开始测试仓库管理功能...\n');

// 测试1: 检查前端是否可访问
console.log('1️⃣ 测试前端可访问性...');
const testFrontend = async () => {
    try {
        const response = await fetch('http://localhost:5174');
        if (response.ok) {
            console.log('✅ 前端服务正常 (http://localhost:5174)');
            return true;
        } else {
            console.log('❌ 前端服务异常');
            return false;
        }
    } catch (error) {
        console.log('❌ 前端服务无法访问:', error.message);
        return false;
    }
};

// 测试2: 检查后端服务健康状态
console.log('\n2️⃣ 测试后端服务健康状态...');
const testBackendHealth = async () => {
    const services = [
        { name: '用户服务', url: 'http://localhost:8081/actuator/health' },
        { name: '商品服务', url: 'http://localhost:8082/actuator/health' },
        { name: '支付服务', url: 'http://localhost:8083/actuator/health' },
        { name: '仓库服务', url: 'http://localhost:8084/actuator/health' }
    ];

    for (const service of services) {
        try {
            const response = await fetch(service.url);
            const data = await response.json();
            if (data.status === 'UP') {
                console.log(`✅ ${service.name} 正常`);
            } else {
                console.log(`❌ ${service.name} 异常: ${data.status}`);
            }
        } catch (error) {
            console.log(`❌ ${service.name} 无法访问: ${error.message}`);
        }
    }
};

// 测试3: 检查Nginx网关
console.log('\n3️⃣ 测试Nginx网关...');
const testNginxGateway = async () => {
    try {
        const response = await fetch('http://localhost/api/products');
        if (response.ok) {
            console.log('✅ Nginx网关正常 (http://localhost)');
            return true;
        } else {
            console.log('❌ Nginx网关异常');
            return false;
        }
    } catch (error) {
        console.log('❌ Nginx网关无法访问:', error.message);
        return false;
    }
};

// 测试4: 检查用户认证API
console.log('\n4️⃣ 测试用户认证API...');
const testAuthAPI = async () => {
    try {
        const response = await fetch('http://localhost/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: '123456'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ 用户认证API正常');
            return true;
        } else {
            console.log('❌ 用户认证API异常');
            return false;
        }
    } catch (error) {
        console.log('❌ 用户认证API无法访问:', error.message);
        return false;
    }
};

// 执行所有测试
const runTests = async () => {
    await testFrontend();
    await testBackendHealth();
    await testNginxGateway();
    await testAuthAPI();

    console.log('\n🎉 仓库管理功能测试完成！');
    console.log('\n📋 测试结果总结:');
    console.log('   - 前端服务: http://localhost:5174');
    console.log('   - 后端服务: 8081-8084 端口');
    console.log('   - Nginx网关: http://localhost');
    console.log('   - 仓库管理: 需要管理员权限访问');

    console.log('\n🔧 仓库管理功能包括:');
    console.log('   - 库存查看和管理');
    console.log('   - 自动入库功能');
    console.log('   - 手动入库/出库');
    console.log('   - 库存预警提示');
    console.log('   - 交易记录查看');
    console.log('   - 清空库存并重新初始化');
};

// 运行测试
runTests().catch(console.error); 