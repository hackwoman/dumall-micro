package com.dumall.payment.repository;

import com.dumall.payment.entity.Payment;
import com.dumall.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 支付数据访问层
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * 根据订单ID查找支付记录
     */
    Optional<Payment> findByOrderId(String orderId);

    /**
     * 根据用户ID查找支付记录
     */
    List<Payment> findByUserId(Long userId);

    /**
     * 根据支付状态查找支付记录
     */
    List<Payment> findByStatus(PaymentStatus status);

    /**
     * 根据用户ID和状态查找支付记录
     */
    List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);

    /**
     * 根据交易ID查找支付记录
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * 统计用户支付成功金额
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.userId = :userId AND p.status = 'SUCCESS'")
    Double sumSuccessfulPaymentsByUserId(@Param("userId") Long userId);

    /**
     * 检查订单是否已存在支付记录
     */
    boolean existsByOrderId(String orderId);
} 