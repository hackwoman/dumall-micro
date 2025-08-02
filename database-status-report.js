// 数据库状态报告
console.log('📊 生成数据库状态报告...');

// 生成完整报告
async function generateStatusReport() {
    console.log('\n' + '='.repeat(50));
    console.log('🗄️ 数据库状态报告');
    console.log('='.repeat(50));

    // 1. 用户数据
    console.log('\n👥 用户数据统计:');
    try {
        const userResponse = await fetch('http://localhost:8081/api/users');
        const userData = await userResponse.json();

        if (userData.code === 200) {
            console.log(`✅ 总用户数: ${userData.data.length}`);

            const adminCount = userData.data.filter(u => u.isAdmin).length;
            const normalUserCount = userData.data.length - adminCount;

            console.log(`  - 管理员用户: ${adminCount} 个`);
            console.log(`  - 普通用户: ${normalUserCount} 个`);

            console.log('\n📋 用户列表:');
            userData.data.forEach((user, index) => {
                const adminBadge = user.isAdmin ? '👑' : '👤';
                console.log(`  ${index + 1}. ${adminBadge} ${user.username} (${user.email}) - ID: ${user.id}`);
            });
        }
    } catch (error) {
        console.log('❌ 无法获取用户数据');
    }

    // 2. 商品数据
    console.log('\n📦 商品数据统计:');
    try {
        const productResponse = await fetch('http://localhost:8082/api/products');
        const productData = await productResponse.json();

        if (productData.code === 200) {
            console.log(`✅ 总商品数: ${productData.data.length}`);

            // 分类统计
            const categoryStats = {};
            let totalStock = 0;
            let totalValue = 0;

            productData.data.forEach(product => {
                const category = product.category;
                categoryStats[category] = (categoryStats[category] || 0) + 1;
                totalStock += product.stock;
                totalValue += product.price * product.stock;
            });

            console.log(`  - 总库存: ${totalStock} 件`);
            console.log(`  - 库存总价值: ¥${totalValue.toFixed(2)}`);

            console.log('\n📊 分类统计:');
            Object.entries(categoryStats).forEach(([category, count]) => {
                console.log(`  - ${category}: ${count} 个商品`);
            });
        }
    } catch (error) {
        console.log('❌ 无法获取商品数据');
    }

    // 3. 订单数据
    console.log('\n📋 订单数据统计:');
    try {
        const orderResponse = await fetch('http://localhost:8083/api/orders');
        const orderData = await orderResponse.json();

        if (orderData.code === 200) {
            console.log(`✅ 总订单数: ${orderData.data.length}`);

            if (orderData.data.length > 0) {
                const totalAmount = orderData.data.reduce((sum, order) => sum + order.totalAmount, 0);
                const avgAmount = totalAmount / orderData.data.length;

                console.log(`  - 订单总金额: ¥${totalAmount.toFixed(2)}`);
                console.log(`  - 平均订单金额: ¥${avgAmount.toFixed(2)}`);

                console.log('\n📋 最近订单:');
                orderData.data.slice(-5).forEach((order, index) => {
                    console.log(`  ${index + 1}. 订单ID: ${order.id}, 用户ID: ${order.userId}, 金额: ¥${order.totalAmount}`);
                });
            }
        }
    } catch (error) {
        console.log('❌ 无法获取订单数据');
    }

    // 4. 库存数据
    console.log('\n📦 库存数据统计:');
    try {
        const inventoryResponse = await fetch('http://localhost:8084/api/inventory');
        const inventoryData = await inventoryResponse.json();

        if (inventoryData.code === 200) {
            console.log(`✅ 库存记录数: ${inventoryData.data.length}`);

            if (inventoryData.data.length > 0) {
                const totalQuantity = inventoryData.data.reduce((sum, item) => sum + item.quantity, 0);
                console.log(`  - 总库存数量: ${totalQuantity}`);

                console.log('\n📋 库存记录:');
                inventoryData.data.forEach((item, index) => {
                    console.log(`  ${index + 1}. 商品ID: ${item.productId}, 数量: ${item.quantity}`);
                });
            }
        }
    } catch (error) {
        console.log('❌ 无法获取库存数据');
    }

    // 5. 系统状态
    console.log('\n🔧 系统状态:');
    try {
        const services = [
            { name: '用户服务', port: 8081 },
            { name: '商品服务', port: 8082 },
            { name: '支付服务', port: 8083 },
            { name: '库存服务', port: 8084 }
        ];

        for (const service of services) {
            try {
                const healthResponse = await fetch(`http://localhost:${service.port}/actuator/health`);
                const healthData = await healthResponse.json();
                const status = healthData.status === 'UP' ? '✅' : '❌';
                console.log(`  ${status} ${service.name} (端口 ${service.port}): ${healthData.status}`);
            } catch (error) {
                console.log(`  ❌ ${service.name} (端口 ${service.port}): 无法连接`);
            }
        }
    } catch (error) {
        console.log('❌ 无法检查系统状态');
    }

    console.log('\n' + '='.repeat(50));
    console.log('📅 报告生成时间:', new Date().toLocaleString());
    console.log('='.repeat(50));
}

// 快速检查用户登录
async function quickUserCheck() {
    console.log('\n🔍 快速用户检查...');

    const testUsers = [
        { username: 'admin', password: '123456' },
        { username: 'user', password: '123456' },
        { username: 'testuser', password: '123456' }
    ];

    for (const testUser of testUsers) {
        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser)
            });

            const data = await response.json();
            const status = data.code === 200 ? '✅' : '❌';
            console.log(`  ${status} ${testUser.username}: ${data.code === 200 ? '登录成功' : data.message}`);
        } catch (error) {
            console.log(`  ❌ ${testUser.username}: 连接失败`);
        }
    }
}

// 导出函数
window.databaseReport = {
    generateStatusReport,
    quickUserCheck
};

console.log('\n📖 使用说明:');
console.log('  - databaseReport.generateStatusReport() - 生成完整状态报告');
console.log('  - databaseReport.quickUserCheck() - 快速检查用户登录'); 