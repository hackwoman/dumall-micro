import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '../types';

// 扩展User接口以适配authStore需求
interface AuthUser extends User {
    isAdmin: boolean;
    createdAt: string;
}

interface AuthState {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    canAccessWarehouse: () => boolean;
    canAccessAdminPanel: () => boolean;
}

// 权限定义
export const PERMISSIONS = {
    WAREHOUSE_ACCESS: 'warehouse:access',
    WAREHOUSE_MANAGE: 'warehouse:manage',
    ADMIN_PANEL: 'admin:panel',
    USER_MANAGE: 'user:manage',
    ORDER_MANAGE: 'order:manage',
} as const;

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isAdmin: false,

            login: (user: AuthUser) => {
                set({
                    user,
                    isLoggedIn: true,
                    isAdmin: user.isAdmin
                });
            },

            logout: () => {
                set({
                    user: null,
                    isLoggedIn: false,
                    isAdmin: false
                });
            },

            hasPermission: (permission: string) => {
                const { user, isLoggedIn } = get();
                if (!user || !isLoggedIn) return false;

                // 管理员拥有所有权限
                if (user.isAdmin) return true;

                // 普通用户权限检查
                switch (permission) {
                    case PERMISSIONS.WAREHOUSE_ACCESS:
                        return user.isAdmin; // 只有管理员可以访问仓库
                    case PERMISSIONS.WAREHOUSE_MANAGE:
                        return user.isAdmin; // 只有管理员可以管理仓库
                    case PERMISSIONS.ADMIN_PANEL:
                        return user.isAdmin; // 只有管理员可以访问管理面板
                    case PERMISSIONS.USER_MANAGE:
                        return user.isAdmin; // 只有管理员可以管理用户
                    case PERMISSIONS.ORDER_MANAGE:
                        return true; // 所有登录用户都可以管理自己的订单
                    default:
                        return false;
                }
            },

            canAccessWarehouse: () => {
                return get().hasPermission(PERMISSIONS.WAREHOUSE_ACCESS);
            },

            canAccessAdminPanel: () => {
                return get().hasPermission(PERMISSIONS.ADMIN_PANEL);
            },
        }),
        {
            name: 'auth-storage',
        }
    )
); 