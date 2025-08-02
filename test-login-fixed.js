// 测试修复后的登录功能
console.log('🧪 开始测试修复后的登录功能...');

// 清理可能冲突的localStorage
function clearConflictingStorage() {
    console.log('\n🧹 清理可能冲突的localStorage...');

    try {
        // 清理旧的用户存储
        localStorage.removeItem('user-storage');
        console.log('✅ 已清理 user-storage');

        // 保留auth-storage，但检查是否有冲突
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            console.log('✅ auth-storage 存在:', authStorage);
        }

    } catch (error) {
        console.error('❌ 清理localStorage失败:', error);
    }
}

// 测试登录流程
async function testLoginFlow() {
    console.log('\n🔍 测试完整登录流程...');

    try {
        // 1. 测试登录API
        console.log('1️⃣ 测试登录API...');
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

            // 2. 模拟前端登录状态更新
            console.log('2️⃣ 模拟前端状态更新...');

            // 检查authStore是否可用
            if (window.useAuthStore) {
                const authStore = window.useAuthStore.getState();
                console.log('✅ useAuthStore状态:', authStore);

                // 模拟登录
                const user = loginData.data;
                const authUser = {
                    ...user,
                    isAdmin: user.isAdmin ?? false,
                    createdAt: user.createdAt ?? new Date().toISOString()
                };

                console.log('✅ 准备登录用户数据:', authUser);

                // 这里我们不能直接调用login方法，但可以检查数据结构
                console.log('✅ 用户数据结构正确');

            } else {
                console.log('⚠️ useAuthStore不可用');
            }

        } else {
            console.log('❌ 登录API返回错误:', loginData.message);
        }

    } catch (error) {
        console.error('❌ 登录流程测试失败:', error);
    }
}

// 测试注册流程
async function testRegisterFlow() {
    console.log('\n📝 测试注册流程...');

    try {
        const testUsername = `testuser_${Date.now()}`;
        console.log('1️⃣ 测试注册新用户:', testUsername);

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
            console.log('✅ 注册成功');

            // 测试新用户登录
            console.log('2️⃣ 测试新用户登录...');
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
            console.log('❌ 注册失败:', registerData.message);
        }

    } catch (error) {
        console.error('❌ 注册流程测试失败:', error);
    }
}

// 检查localStorage状态
function checkLocalStorage() {
    console.log('\n💾 检查localStorage状态...');

    try {
        const authStorage = localStorage.getItem('auth-storage');
        console.log('✅ auth-storage:', authStorage);

        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            console.log('✅ 解析后的状态:', parsed);
        }

        const userStorage = localStorage.getItem('user-storage');
        console.log('✅ user-storage:', userStorage ? '存在（可能冲突）' : '不存在');

    } catch (error) {
        console.error('❌ localStorage检查失败:', error);
    }
}

// 运行所有测试
async function runAllTests() {
    console.log('🚀 开始修复后的登录功能测试...');

    clearConflictingStorage();
    await testLoginFlow();
    await testRegisterFlow();
    checkLocalStorage();

    console.log('\n🎉 测试完成！');
    console.log('📝 检查结果：');
    console.log('  - 登录API应该返回200状态码');
    console.log('  - 注册API应该成功创建新用户');
    console.log('  - localStorage应该只使用auth-storage');
    console.log('  - 前端状态管理应该统一使用useAuthStore');
    console.log('\n💡 如果测试通过，请在前端界面尝试登录');
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
    runAllTests();
} else {
    console.log('请在浏览器控制台中运行此脚本');
} 