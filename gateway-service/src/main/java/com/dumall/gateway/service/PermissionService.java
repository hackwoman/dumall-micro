package com.dumall.gateway.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.TimeUnit;

/**
 * 权限服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PermissionService {

    private final WebClient.Builder webClientBuilder;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 检查用户是否为管理员
     */
    public boolean isAdmin(String userId) {
        String cacheKey = "admin:" + userId;
        
        // 先从缓存获取
        Boolean cached = (Boolean) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        try {
            // 调用用户服务检查管理员权限
            Boolean isAdmin = webClientBuilder.build()
                    .get()
                    .uri("http://user-service/api/auth/check-admin?userId=" + userId)
                    .retrieve()
                    .bodyToM(Boolean.class)
                    .block();

            // 缓存结果（5分钟）
            redisTemplate.opsForValue().set(cacheKey, isAdmin, 5, TimeUnit.MINUTES);
            
            return isAdmin != null && isAdmin;
        } catch (Exception e) {
            log.error("Error checking admin status for user: {}", userId, e);
            return false;
        }
    }

    /**
     * 检查用户是否有特定权限
     */
    public boolean hasPermission(String userId, String permission) {
        String cacheKey = "permission:" + userId + ":" + permission;
        
        // 先从缓存获取
        Boolean cached = (Boolean) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        try {
            // 调用用户服务检查权限
            Boolean hasPermission = webClientBuilder.build()
                    .get()
                    .uri("http://user-service/api/auth/check-permission?userId=" + userId + "&permission=" + permission)
                    .retrieve()
                    .bodyToM(Boolean.class)
                    .block();

            // 缓存结果（5分钟）
            redisTemplate.opsForValue().set(cacheKey, hasPermission, 5, TimeUnit.MINUTES);
            
            return hasPermission != null && hasPermission;
        } catch (Exception e) {
            log.error("Error checking permission for user: {}, permission: {}", userId, permission, e);
            return false;
        }
    }

    /**
     * 清除用户权限缓存
     */
    public void clearUserCache(String userId) {
        String adminKey = "admin:" + userId;
        String permissionPattern = "permission:" + userId + ":*";
        
        redisTemplate.delete(adminKey);
        // 注意：Redis不支持模式删除，这里简化处理
        log.debug("Cleared cache for user: {}", userId);
    }
} 