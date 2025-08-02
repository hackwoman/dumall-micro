// 测试订单隔离功能
console.log('🧪 开始测试订单隔离功能...');

// 模拟用户登录和订单创建
function simulateUserOrder(userId, username) {
    console.log(`\n👤 模拟用户 ${username} (ID: ${userId}) 登录和下单...`);

    // 模拟登录
    const user = {
        id: userId,
        username: username,
        email: `${username}@example.com`,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };

    // 模拟订单
    const order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        items: [
            {
                id: 1,
                product: { id: 1, name: `${username}的商品`, price: 100 },
                quantity: 1
            }
        ],
        totalAmount: 100,
        paymentMethod: '支付宝',
        status: 'paid',
        createdAt: new Date().toISOString(),
        paymentCompletedAt: new Date().toISOString()
    };

    // 保存订单到localStorage
    let existingOrders = [];
    try {
        const ordersStr = localStorage.getItem('orders');
        if (ordersStr) {
            const parsed = JSON.parse(ordersStr);
            existingOrders = Array.isArray(parsed) ? parsed : [];
        }
    } catch (error) {
        console.error('解析现有订单失败:', error);
        existingOrders = [];
    }

    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    console.log(`✅ 用户 ${username} 的订单已保存:`, order.id);
    return order;
}

// 模拟查看用户订单
function simulateViewUserOrders(userId, username) {
    console.log(`\n📋 查看用户 ${username} (ID: ${userId}) 的订单...`);

    try {
        const savedOrdersStr = localStorage.getItem('orders');
        let savedOrders = [];

        if (savedOrdersStr) {
            try {
                const parsed = JSON.parse(savedOrdersStr);
                savedOrders = Array.isArray(parsed) ? parsed : [];
            } catch (parseError) {
                console.error('解析订单数据失败:', parseError);
                savedOrders = [];
            }
        }

        const userOrders = savedOrders.filter((order) => order.userId === userId);
        console.log(`📊 用户 ${username} 的订单数量: ${userOrders.length}`);
        userOrders.forEach((order, index) => {
            console.log(`  ${index + 1}. 订单ID: ${order.id}, 金额: ${order.totalAmount}`);
        });

        return userOrders;
    } catch (error) {
        console.error('加载订单数据失败:', error);
        return [];
    }
}

// 清空测试数据
function clearTestData() {
    console.log('\n🧹 清空测试数据...');
    localStorage.removeItem('orders');
    console.log('✅ 测试数据已清空');
}

// 运行测试
function runTest() {
    console.log('🚀 开始订单隔离测试...');

    // 清空之前的测试数据
    clearTestData();

    // 模拟用户1下单
    simulateUserOrder(1, 'admin');

    // 模拟用户2下单
    simulateUserOrder(2, 'user');

    // 模拟用户3下单
    simulateUserOrder(3, 'testuser');

    // 查看各用户的订单
    simulateViewUserOrders(1, 'admin');
    simulateViewUserOrders(2, 'user');
    simulateViewUserOrders(3, 'testuser');

    console.log('\n🎉 测试完成！');
    console.log('📝 检查结果：每个用户应该只能看到自己的订单');
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
    runTest();
} else {
    console.log('请在浏览器控制台中运行此脚本');
} 