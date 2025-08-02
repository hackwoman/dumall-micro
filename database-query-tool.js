// 数据库查询工具
console.log('🗄️ 数据库查询工具已加载...');

// 查询所有用户
async function queryAllUsers() {
    console.log('\n👥 查询所有用户...');

    try {
        const response = await fetch('http://localhost:8081/api/users');
        const data = await response.json();

        if (data.code === 200) {
            console.log('✅ 用户总数:', data.data.length);
            data.data.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}, 管理员: ${user.isAdmin ? '是' : '否'}`);
            });
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询用户失败:', error);
    }
}

// 查询所有商品
async function queryAllProducts() {
    console.log('\n📦 查询所有商品...');

    try {
        const response = await fetch('http://localhost:8082/api/products');
        const data = await response.json();

        if (data.code === 200) {
            console.log('✅ 商品总数:', data.data.length);

            // 按分类统计
            const categoryStats = {};
            data.data.forEach(product => {
                const category = product.category;
                categoryStats[category] = (categoryStats[category] || 0) + 1;
            });

            console.log('📊 分类统计:');
            Object.entries(categoryStats).forEach(([category, count]) => {
                console.log(`  - ${category}: ${count}个商品`);
            });

            // 显示前5个商品
            console.log('\n📋 前5个商品:');
            data.data.slice(0, 5).forEach((product, index) => {
                console.log(`${index + 1}. ${product.name} - ¥${product.price} (库存: ${product.stock})`);
            });
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询商品失败:', error);
    }
}

// 查询所有订单
async function queryAllOrders() {
    console.log('\n📋 查询所有订单...');

    try {
        const response = await fetch('http://localhost:8083/api/orders');
        const data = await response.json();

        if (data.code === 200) {
            console.log('✅ 订单总数:', data.data.length);
            data.data.forEach((order, index) => {
                console.log(`${index + 1}. 订单ID: ${order.id}, 用户ID: ${order.userId}, 总金额: ¥${order.totalAmount}, 状态: ${order.status}`);
            });
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询订单失败:', error);
    }
}

// 查询库存信息
async function queryInventory() {
    console.log('\n📦 查询库存信息...');

    try {
        const response = await fetch('http://localhost:8084/api/inventory');
        const data = await response.json();

        if (data.code === 200) {
            console.log('✅ 库存记录总数:', data.data.length);
            data.data.forEach((item, index) => {
                console.log(`${index + 1}. 商品ID: ${item.productId}, 数量: ${item.quantity}, 更新时间: ${item.updatedAt}`);
            });
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询库存失败:', error);
    }
}

// 查询特定用户
async function queryUserById(userId) {
    console.log(`\n👤 查询用户ID: ${userId}...`);

    try {
        const response = await fetch(`http://localhost:8081/api/users/${userId}`);
        const data = await response.json();

        if (data.code === 200) {
            const user = data.data;
            console.log('✅ 用户信息:');
            console.log(`  - ID: ${user.id}`);
            console.log(`  - 用户名: ${user.username}`);
            console.log(`  - 邮箱: ${user.email}`);
            console.log(`  - 管理员: ${user.isAdmin ? '是' : '否'}`);
            console.log(`  - 创建时间: ${user.createdAt}`);
            console.log(`  - 更新时间: ${user.updatedAt}`);
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询用户失败:', error);
    }
}

// 查询特定商品
async function queryProductById(productId) {
    console.log(`\n📦 查询商品ID: ${productId}...`);

    try {
        const response = await fetch(`http://localhost:8082/api/products/${productId}`);
        const data = await response.json();

        if (data.code === 200) {
            const product = data.data;
            console.log('✅ 商品信息:');
            console.log(`  - ID: ${product.id}`);
            console.log(`  - 名称: ${product.name}`);
            console.log(`  - 描述: ${product.description}`);
            console.log(`  - 价格: ¥${product.price}`);
            console.log(`  - 库存: ${product.stock}`);
            console.log(`  - 分类: ${product.category}`);
        } else {
            console.log('❌ 查询失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 查询商品失败:', error);
    }
}

// 测试用户登录
async function testUserLogin(username, password) {
    console.log(`\n🔐 测试用户登录: ${username}...`);

    try {
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.code === 200) {
            console.log('✅ 登录成功!');
            console.log('用户信息:', data.data);
        } else {
            console.log('❌ 登录失败:', data.message);
        }
    } catch (error) {
        console.error('❌ 登录测试失败:', error);
    }
}

// 运行完整查询
async function runFullQuery() {
    console.log('🚀 开始完整数据库查询...');

    await queryAllUsers();
    await queryAllProducts();
    await queryAllOrders();
    await queryInventory();

    console.log('\n🎉 查询完成！');
}

// 导出函数供控制台使用
window.databaseQuery = {
    queryAllUsers,
    queryAllProducts,
    queryAllOrders,
    queryInventory,
    queryUserById,
    queryProductById,
    testUserLogin,
    runFullQuery
};

console.log('\n📖 使用说明:');
console.log('  - databaseQuery.queryAllUsers() - 查询所有用户');
console.log('  - databaseQuery.queryAllProducts() - 查询所有商品');
console.log('  - databaseQuery.queryAllOrders() - 查询所有订单');
console.log('  - databaseQuery.queryInventory() - 查询库存信息');
console.log('  - databaseQuery.queryUserById(1) - 查询特定用户');
console.log('  - databaseQuery.queryProductById(1) - 查询特定商品');
console.log('  - databaseQuery.testUserLogin("admin", "123456") - 测试用户登录');
console.log('  - databaseQuery.runFullQuery() - 运行完整查询'); 