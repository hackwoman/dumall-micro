package com.dumall.gateway.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 简化的API网关控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/gateway")
@CrossOrigin(origins = "*")
public class GatewayController {

    /**
     * 网关健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "gateway-service");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * 路由信息
     */
    @GetMapping("/routes")
    public ResponseEntity<Map<String, Object>> getRoutes() {
        Map<String, Object> routes = new HashMap<>();
        
        Map<String, Object> userService = new HashMap<>();
        userService.put("url", "http://localhost:8081");
        userService.put("paths", new String[]{"/api/user/**", "/api/auth/**"});
        routes.put("user-service", userService);
        
        Map<String, Object> productService = new HashMap<>();
        productService.put("url", "http://localhost:8082");
        productService.put("paths", new String[]{"/api/product/**"});
        routes.put("product-service", productService);
        
        Map<String, Object> paymentService = new HashMap<>();
        paymentService.put("url", "http://localhost:8083");
        paymentService.put("paths", new String[]{"/api/payment/**"});
        routes.put("payment-service", paymentService);
        
        Map<String, Object> inventoryService = new HashMap<>();
        inventoryService.put("url", "http://localhost:8084");
        inventoryService.put("paths", new String[]{"/api/inventory/**"});
        routes.put("inventory-service", inventoryService);
        
        return ResponseEntity.ok(routes);
    }

    /**
     * 权限验证端点
     */
    @PostMapping("/auth/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String path = request.get("path");
        
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || token.isEmpty()) {
            response.put("valid", false);
            response.put("message", "Token is required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // 这里应该实现真正的JWT验证逻辑
        // 简化实现：检查token格式
        if (token.startsWith("Bearer ")) {
            response.put("valid", true);
            response.put("userId", "user123"); // 从token中解析
            response.put("isAdmin", path != null && path.contains("/inventory"));
        } else {
            response.put("valid", false);
            response.put("message", "Invalid token format");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 错误处理
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        log.error("Gateway error: ", e);
        
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", e.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
} 