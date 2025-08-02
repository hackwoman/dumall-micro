// 清理可能损坏的localStorage数据
export const cleanStorage = () => {
    try {
        // 清理可能损坏的订单数据
        const ordersStr = localStorage.getItem('orders');
        if (ordersStr) {
            try {
                const parsed = JSON.parse(ordersStr);
                if (!Array.isArray(parsed)) {
                    console.log('检测到损坏的订单数据，正在清理...');
                    localStorage.removeItem('orders');
                }
            } catch (error) {
                console.log('订单数据解析失败，正在清理...');
                localStorage.removeItem('orders');
            }
        }

        // 清理可能损坏的购物车数据
        const cartStr = localStorage.getItem('cart-storage');
        if (cartStr) {
            try {
                const parsed = JSON.parse(cartStr);
                if (!parsed.state || !Array.isArray(parsed.state.items)) {
                    console.log('检测到损坏的购物车数据，正在清理...');
                    localStorage.removeItem('cart-storage');
                }
            } catch (error) {
                console.log('购物车数据解析失败，正在清理...');
                localStorage.removeItem('cart-storage');
            }
        }

        // 清理可能损坏的用户数据
        const userStr = localStorage.getItem('user-storage');
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr);
                if (!parsed.state) {
                    console.log('检测到损坏的用户数据，正在清理...');
                    localStorage.removeItem('user-storage');
                }
            } catch (error) {
                console.log('用户数据解析失败，正在清理...');
                localStorage.removeItem('user-storage');
            }
        }

        console.log('localStorage清理完成');
    } catch (error) {
        console.error('清理localStorage时出错:', error);
    }
};

// 在页面加载时自动清理
if (typeof window !== 'undefined') {
    cleanStorage();
} 