package com.dumall.payment.dto;

import com.dumall.payment.entity.PaymentMethod;
import com.dumall.payment.entity.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 支付响应DTO
 */
@Data
public class PaymentResponse {

    private Long id;
    private String orderId;
    private Long userId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private String paymentUrl; // 支付链接（模拟第三方支付）
    private String qrCode; // 二维码（模拟）
} 