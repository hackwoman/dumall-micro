package com.dumall.gateway.filter;

import com.dumall.gateway.service.JwtService;
import com.dumall.gateway.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 权限验证过滤器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthFilter extends AbstractGatewayFilterFactory<AuthFilter.Config> {

    private final JwtService jwtService;
    private final PermissionService permissionService;

    public AuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();
            
            log.debug("AuthFilter processing request: {}", path);

            // 检查是否在排除路径中
            if (isExcludedPath(path, config.getExcludePaths())) {
                log.debug("Path {} is excluded from authentication", path);
                return chain.filter(exchange);
            }

            // 获取Authorization头
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
                log.warn("Missing or invalid Authorization header for path: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);
            
            try {
                // 验证JWT Token
                String userId = jwtService.validateToken(token);
                if (userId == null) {
                    log.warn("Invalid JWT token for path: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                // 检查管理员权限（如果需要）
                if (config.isRequireAdmin()) {
                    boolean isAdmin = permissionService.isAdmin(userId);
                    if (!isAdmin) {
                        log.warn("Admin permission required for path: {}, user: {}", path, userId);
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                }

                // 检查具体权限
                String permission = getPermissionFromPath(path);
                if (permission != null) {
                    boolean hasPermission = permissionService.hasPermission(userId, permission);
                    if (!hasPermission) {
                        log.warn("Permission denied for path: {}, user: {}, permission: {}", 
                                path, userId, permission);
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                }

                // 添加用户信息到请求头
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-ID", userId)
                        .build();

                log.debug("Authentication successful for user: {} on path: {}", userId, path);
                return chain.filter(exchange.mutate().request(modifiedRequest).build());

            } catch (Exception e) {
                log.error("Error during authentication for path: {}", path, e);
                exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                return exchange.getResponse().setComplete();
            }
        };
    }

    private boolean isExcludedPath(String path, List<String> excludePaths) {
        if (excludePaths == null || excludePaths.isEmpty()) {
            return false;
        }
        return excludePaths.stream().anyMatch(path::startsWith);
    }

    private String getPermissionFromPath(String path) {
        if (path.startsWith("/api/inventory")) {
            return "warehouse:access";
        } else if (path.startsWith("/api/user") && path.contains("/admin")) {
            return "user:manage";
        } else if (path.startsWith("/api/payment") && path.contains("/admin")) {
            return "payment:manage";
        }
        return null;
    }

    public static class Config {
        private List<String> excludePaths;
        private boolean requireAdmin = false;

        public List<String> getExcludePaths() {
            return excludePaths;
        }

        public void setExcludePaths(List<String> excludePaths) {
            this.excludePaths = excludePaths;
        }

        public boolean isRequireAdmin() {
            return requireAdmin;
        }

        public void setRequireAdmin(boolean requireAdmin) {
            this.requireAdmin = requireAdmin;
        }
    }
} 