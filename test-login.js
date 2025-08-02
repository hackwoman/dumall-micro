// 测试登录功能
console.log('🧪 开始测试登录功能...');

// 测试登录API
async function testLoginAPI() {
    console.log('\n🔍 测试登录API...');

    try {
        // 测试admin用户登录
        const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: '123456'
            })
        });

        const loginData = await loginResponse.json();
        console.log('✅ 登录API响应:', loginData);

        if (loginData.code === 200) {
            console.log('✅ 登录API工作正常');
            console.log('用户信息:', loginData.data);
        } else {
            console.log('❌ 登录API返回错误:', loginData.message);
        }

    } catch (error) {
        console.error('❌ 登录API测试失败:', error);
    }
}

// 测试注册API
async function testRegisterAPI() {
    console.log('\n📝 测试注册API...');

    try {
        const testUsername = `testuser_${Date.now()}`;
        const registerResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: testUsername,
                email: `${testUsername}@example.com`,
                password: '123456',
                isAdmin: false
            })
        });

        const registerData = await registerResponse.json();
        console.log('✅ 注册API响应:', registerData);

        if (registerData.code === 200) {
            console.log('✅ 注册API工作正常');
            console.log('新用户信息:', registerData.data);

            // 测试新用户登录
            console.log('\n🔍 测试新用户登录...');
            const newUserLoginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: testUsername,
                    password: '123456'
                })
            });

            const newUserLoginData = await newUserLoginResponse.json();
            console.log('✅ 新用户登录响应:', newUserLoginData);

        } else {
            console.log('❌ 注册API返回错误:', registerData.message);
        }

    } catch (error) {
        console.error('❌ 注册API测试失败:', error);
    }
}

// 测试localStorage状态
function testLocalStorage() {
    console.log('\n💾 测试localStorage状态...');

    try {
        const authStorage = localStorage.getItem('auth-storage');
        console.log('✅ auth-storage内容:', authStorage);

        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            console.log('✅ 解析后的状态:', parsed);
        }

        // 检查其他相关存储
        const orders = localStorage.getItem('orders');
        console.log('✅ orders存储:', orders ? '存在' : '不存在');

    } catch (error) {
        console.error('❌ localStorage测试失败:', error);
    }
}

// 测试用户状态管理
function testUserState() {
    console.log('\n👤 测试用户状态管理...');

    try {
        // 检查全局状态
        if (window.useAuthStore) {
            const authState = window.useAuthStore.getState();
            console.log('✅ 当前认证状态:', authState);
        } else {
            console.log('⚠️ useAuthStore不可用');
        }

    } catch (error) {
        console.error('❌ 用户状态测试失败:', error);
    }
}

// 运行所有测试
async function runAllTests() {
    console.log('🚀 开始登录功能测试...');

    await testLoginAPI();
    await testRegisterAPI();
    testLocalStorage();
    testUserState();

    console.log('\n🎉 测试完成！');
    console.log('📝 检查结果：');
    console.log('  - 登录API应该返回200状态码和用户信息');
    console.log('  - 注册API应该成功创建新用户');
    console.log('  - localStorage应该保存认证状态');
    console.log('  - 前端状态管理应该正常工作');
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
    runAllTests();
} else {
    console.log('请在浏览器控制台中运行此脚本');
} 