import React from 'react';
import { Result, Button } from 'antd';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface PermissionGuardProps {
    children: React.ReactNode;
    permission: string;
    fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    permission,
    fallback
}) => {
    const { hasPermission } = useAuthStore();
    const navigate = useNavigate();

    if (!hasPermission(permission)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <Result
                status="403"
                title="403"
                subTitle="抱歉，您没有权限访问此页面。"
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        返回首页
                    </Button>
                }
            />
        );
    }

    return <>{children}</>;
};

export default PermissionGuard;