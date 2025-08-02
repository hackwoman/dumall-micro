package com.dumall.user.controller;

import com.dumall.user.entity.User;
import com.dumall.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        try {
            User user = userService.authenticateUser(username, password);
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 200);
                response.put("message", "登录成功");
                response.put("data", user);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 401);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "注册成功");
            response.put("data", registeredUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "注册失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/check-permission")
    public ResponseEntity<?> checkPermission(
            @RequestParam String userId,
            @RequestParam String permission) {
        try {
            User user = userService.getUserById(Long.parseLong(userId));
            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("code", 404);
                response.put("message", "用户不存在");
                response.put("hasPermission", false);
                return ResponseEntity.ok(response);
            }

            boolean hasPermission = checkUserPermission(user, permission);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "权限检查完成");
            response.put("hasPermission", hasPermission);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "权限检查失败: " + e.getMessage());
            response.put("hasPermission", false);
            return ResponseEntity.ok(response);
        }
    }

    private boolean checkUserPermission(User user, String permission) {
        // 管理员拥有所有权限
        if (user.getIsAdmin() != null && user.getIsAdmin()) {
            return true;
        }

        // 普通用户权限检查
        switch (permission) {
            case "warehouse:access":
            case "warehouse:manage":
            case "admin:panel":
            case "user:manage":
                return false; // 只有管理员可以访问
            case "order:manage":
                return true; // 所有用户都可以管理自己的订单
            default:
                return false;
        }
    }
} 