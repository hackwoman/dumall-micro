// 测试搜索和筛选功能
console.log('🧪 开始测试搜索和筛选功能...');

// 测试搜索功能
async function testSearch() {
    console.log('\n🔍 测试搜索功能...');

    try {
        // 测试搜索iPhone
        const searchResponse = await fetch('/api/products/search?keyword=iPhone');
        const searchData = await searchResponse.json();
        console.log('✅ 搜索"iPhone"结果:', searchData.data.length, '个商品');
        searchData.data.forEach(product => {
            console.log(`  - ${product.name} (¥${product.price})`);
        });

        // 测试搜索MacBook
        const searchResponse2 = await fetch('/api/products/search?keyword=MacBook');
        const searchData2 = await searchResponse2.json();
        console.log('✅ 搜索"MacBook"结果:', searchData2.data.length, '个商品');
        searchData2.data.forEach(product => {
            console.log(`  - ${product.name} (¥${product.price})`);
        });

    } catch (error) {
        console.error('❌ 搜索测试失败:', error);
    }
}

// 测试分类功能
async function testCategory() {
    console.log('\n📂 测试分类功能...');

    try {
        // 测试数码产品分类
        const categoryResponse = await fetch('/api/products/category/数码产品');
        const categoryData = await categoryResponse.json();
        console.log('✅ "数码产品"分类结果:', categoryData.data.length, '个商品');

        // 测试服装配饰分类
        const categoryResponse2 = await fetch('/api/products/category/服装配饰');
        const categoryData2 = await categoryResponse2.json();
        console.log('✅ "服装配饰"分类结果:', categoryData2.data.length, '个商品');

        // 测试运动户外分类
        const categoryResponse3 = await fetch('/api/products/category/运动户外');
        const categoryData3 = await categoryResponse3.json();
        console.log('✅ "运动户外"分类结果:', categoryData3.data.length, '个商品');

    } catch (error) {
        console.error('❌ 分类测试失败:', error);
    }
}

// 测试所有商品
async function testAllProducts() {
    console.log('\n📦 测试获取所有商品...');

    try {
        const allProductsResponse = await fetch('/api/products');
        const allProductsData = await allProductsResponse.json();
        console.log('✅ 所有商品总数:', allProductsData.data.length, '个商品');

        // 按分类统计
        const categoryStats = {};
        allProductsData.data.forEach(product => {
            const category = product.category;
            categoryStats[category] = (categoryStats[category] || 0) + 1;
        });

        console.log('📊 分类统计:');
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count}个商品`);
        });

    } catch (error) {
        console.error('❌ 获取所有商品测试失败:', error);
    }
}

// 运行所有测试
async function runAllTests() {
    console.log('🚀 开始搜索和筛选功能测试...');

    await testAllProducts();
    await testSearch();
    await testCategory();

    console.log('\n🎉 测试完成！');
    console.log('📝 检查结果：');
    console.log('  - 搜索功能应该能根据关键词找到相关商品');
    console.log('  - 分类功能应该能按分类筛选商品');
    console.log('  - 前端界面应该能正常显示搜索结果');
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
    runAllTests();
} else {
    console.log('请在浏览器控制台中运行此脚本');
} 