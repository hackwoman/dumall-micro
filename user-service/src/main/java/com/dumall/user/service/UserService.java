package com.dumall.user.service;

import com.dumall.common.exception.BusinessException;
import com.dumall.user.entity.User;
import com.dumall.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    /**
     * 获取所有用户
     * @return 用户列表
     */
    public List<User> getAllUsers() {
        log.info("获取所有用户");
        return userRepository.findAll();
    }
    
    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户对象
     */
    public User getUserById(Long id) {
        log.info("根据ID获取用户: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }
    
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户对象
     */
    public User getUserByUsername(String username) {
        log.info("根据用户名获取用户: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }
    
    /**
     * 创建用户
     * @param user 用户信息
     * @return 创建的用户
     */
    @Transactional
    public User createUser(User user) {
        log.info("创建用户: {}", user.getUsername());
        
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("邮箱已存在");
        }
        
        return userRepository.save(user);
    }
    
    /**
     * 更新用户信息
     * @param id 用户ID
     * @param user 用户信息
     * @return 更新后的用户
     */
    @Transactional
    public User updateUser(Long id, User user) {
        log.info("更新用户: {}", id);
        
        User existingUser = getUserById(id);
        
        // 检查用户名是否被其他用户使用
        Optional<User> userWithSameUsername = userRepository.findByUsername(user.getUsername());
        if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getId().equals(id)) {
            throw new BusinessException("用户名已存在");
        }
        
        // 检查邮箱是否被其他用户使用
        Optional<User> userWithSameEmail = userRepository.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId().equals(id)) {
            throw new BusinessException("邮箱已存在");
        }
        
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(user.getPassword());
        }
        
        return userRepository.save(existingUser);
    }
    
    /**
     * 删除用户
     * @param id 用户ID
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("删除用户: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new BusinessException("用户不存在");
        }
        
        userRepository.deleteById(id);
    }
    
    /**
     * 用户登录验证
     * @param username 用户名
     * @param password 密码
     * @return 用户对象
     */
    public User login(String username, String password) {
        log.info("用户登录: {}", username);
        
        User user = getUserByUsername(username);
        
        if (!user.getPassword().equals(password)) {
            throw new BusinessException("密码错误");
        }
        
        return user;
    }
    
    /**
     * 用户认证
     * @param username 用户名
     * @param password 密码
     * @return 用户对象，如果认证失败返回null
     */
    public User authenticateUser(String username, String password) {
        log.info("用户认证: {}", username);
        
        try {
            User user = getUserByUsername(username);
            if (user.getPassword().equals(password)) {
                return user;
            }
        } catch (BusinessException e) {
            log.warn("用户认证失败: {}", username);
        }
        
        return null;
    }
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册的用户
     */
    @Transactional
    public User registerUser(User user) {
        log.info("用户注册: {}", user.getUsername());
        
        // 设置默认值
        if (user.getIsAdmin() == null) {
            user.setIsAdmin(false);
        }
        
        return createUser(user);
    }
    
    /**
     * 搜索用户
     * @param keyword 关键词
     * @return 用户列表
     */
    public List<User> searchUsers(String keyword) {
        log.info("搜索用户: {}", keyword);
        return userRepository.findByUsernameOrEmailContaining(keyword);
    }
}