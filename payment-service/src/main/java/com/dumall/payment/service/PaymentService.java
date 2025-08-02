package com.dumall.payment.service;

import com.dumall.payment.dto.PaymentRequest;
import com.dumall.payment.dto.PaymentResponse;
import com.dumall.payment.entity.Payment;
import com.dumall.payment.entity.PaymentStatus;

import java.util.List;

/**
 * 支付服务接口
 */
public interface PaymentService {

    /**
     * 创建支付订单
     */
    PaymentResponse createPayment(PaymentRequest request);

    /**
     * 处理支付回调
     */
    PaymentResponse processPaymentCallback(String orderId, String transactionId, boolean success);

    /**
     * 查询支付状态
     */
    PaymentResponse getPaymentStatus(String orderId);

    /**
     * 取消支付
     */
    PaymentResponse cancelPayment(String orderId);

    /**
     * 退款
     */
    PaymentResponse refundPayment(String orderId, String reason);

    /**
     * 获取用户支付记录
     */
    List<PaymentResponse> getUserPayments(Long userId);

    /**
     * 获取所有支付记录
     */
    List<PaymentResponse> getAllPayments();

    /**
     * 模拟第三方支付接口调用
     */
    PaymentResponse simulateThirdPartyPayment(Payment payment);
} 