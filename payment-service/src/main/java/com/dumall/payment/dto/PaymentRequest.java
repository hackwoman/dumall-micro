package com.dumall.payment.dto;

import com.dumall.payment.entity.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 支付请求DTO
 */
@Data
public class PaymentRequest {

    @NotBlank(message = "订单ID不能为空")
    private String orderId;

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @NotNull(message = "支付金额不能为空")
    @DecimalMin(value = "0.01", message = "支付金额必须大于0")
    private BigDecimal amount;

    @NotNull(message = "支付方式不能为空")
    private PaymentMethod paymentMethod;

    private String description;
} 