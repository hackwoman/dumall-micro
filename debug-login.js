// 前端登录问题诊断
console.log('🔍 诊断前端登录问题...');

// 清理localStorage
function clearStorage() {
    localStorage.removeItem('user-storage');
    localStorage.removeItem('auth-storage');
    console.log('✅ localStorage已清理，请刷新页面重试');
}

// 检查localStorage
function checkStorage() {
    const auth = localStorage.getItem('auth-storage');
    const user = localStorage.getItem('user-storage');
    console.log('auth-storage:', auth);
    console.log('user-storage:', user);
}

// 测试登录
async function testLogin() {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '123456' })
        });
        const data = await response.json();
        console.log('登录结果:', data);
    } catch (error) {
        console.error('登录失败:', error);
    }
}

window.debug = { clearStorage, checkStorage, testLogin };
console.log('使用: debug.clearStorage(), debug.checkStorage(), debug.testLogin()'); 