package com.dumall.user;

import com.dumall.user.entity.User;
import com.dumall.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * 用户服务启动类
 */
@Slf4j
@SpringBootApplication
@EntityScan("com.dumall.user.entity")
@EnableJpaRepositories("com.dumall.user.repository")
@RequiredArgsConstructor
public class UserServiceApplication {
    
    private final UserRepository userRepository;
    
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    
    /**
     * 初始化测试数据
     */
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            log.info("开始初始化测试数据...");
            
            // 检查是否已有数据
            if (userRepository.count() == 0) {
                // 创建测试用户
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@dumall.com");
                adminUser.setPassword("123456");
                userRepository.save(adminUser);
                
                User normalUser = new User();
                normalUser.setUsername("user");
                normalUser.setEmail("user@dumall.com");
                normalUser.setPassword("123456");
                userRepository.save(normalUser);
                
                log.info("测试数据初始化完成！");
            } else {
                log.info("数据库中已有数据，跳过初始化");
            }
        };
    }
}
