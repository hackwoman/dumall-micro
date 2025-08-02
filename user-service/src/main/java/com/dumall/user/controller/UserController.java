package com.dumall.user.controller;

import com.dumall.common.response.ApiResponse;
import com.dumall.user.entity.User;
import com.dumall.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 获取所有用户
     * @return 用户列表
     */
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        log.info("获取所有用户");
        List<User> users = userService.getAllUsers();
        return ApiResponse.success(users);
    }
    
    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户信息
     */
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        log.info("根据ID获取用户: {}", id);
        User user = userService.getUserById(id);
        return ApiResponse.success(user);
    }
    
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户信息
     */
    @GetMapping("/username/{username}")
    public ApiResponse<User> getUserByUsername(@PathVariable String username) {
        log.info("根据用户名获取用户: {}", username);
        User user = userService.getUserByUsername(username);
        return ApiResponse.success(user);
    }
    
    /**
     * 创建用户
     * @param user 用户信息
     * @return 创建的用户
     */
    @PostMapping
    public ApiResponse<User> createUser(@Valid @RequestBody User user) {
        log.info("创建用户: {}", user.getUsername());
        User createdUser = userService.createUser(user);
        return ApiResponse.success(createdUser);
    }
    
    /**
     * 更新用户
     * @param id 用户ID
     * @param user 用户信息
     * @return 更新后的用户
     */
    @PutMapping("/{id}")
    public ApiResponse<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        log.info("更新用户: {}", id);
        User updatedUser = userService.updateUser(id, user);
        return ApiResponse.success(updatedUser);
    }
    
    /**
     * 删除用户
     * @param id 用户ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        log.info("删除用户: {}", id);
        userService.deleteUser(id);
        return ApiResponse.success();
    }
    
    /**
     * 用户登录
     * @param loginRequest 登录请求
     * @return 用户信息
     */
    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody LoginRequest loginRequest) {
        log.info("用户登录: {}", loginRequest.getUsername());
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ApiResponse.success(user);
    }
    
    /**
     * 搜索用户
     * @param keyword 关键词
     * @return 用户列表
     */
    @GetMapping("/search")
    public ApiResponse<List<User>> searchUsers(@RequestParam String keyword) {
        log.info("搜索用户: {}", keyword);
        List<User> users = userService.searchUsers(keyword);
        return ApiResponse.success(users);
    }
    
    /**
     * 登录请求类
     */
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}