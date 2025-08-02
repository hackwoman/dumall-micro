package com.dumall.payment.controller;

import com.dumall.common.response.ApiResponse;
import com.dumall.payment.dto.PaymentRequest;
import com.dumall.payment.dto.PaymentResponse;
import com.dumall.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 支付控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 创建支付订单
     */
    @PostMapping
    public ApiResponse<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        log.info("创建支付订单: {}", request.getOrderId());
        PaymentResponse response = paymentService.createPayment(request);
        return ApiResponse.success(response);
    }

    /**
     * 处理支付回调
     */
    @PostMapping("/callback")
    public ApiResponse<PaymentResponse> processCallback(
            @RequestParam String orderId,
            @RequestParam String transactionId,
            @RequestParam(defaultValue = "true") boolean success) {
        log.info("处理支付回调: orderId={}, success={}", orderId, success);
        PaymentResponse response = paymentService.processPaymentCallback(orderId, transactionId, success);
        return ApiResponse.success(response);
    }

    /**
     * 查询支付状态
     */
    @GetMapping("/status/{orderId}")
    public ApiResponse<PaymentResponse> getPaymentStatus(@PathVariable String orderId) {
        log.info("查询支付状态: {}", orderId);
        PaymentResponse response = paymentService.getPaymentStatus(orderId);
        return ApiResponse.success(response);
    }

    /**
     * 取消支付
     */
    @PostMapping("/cancel/{orderId}")
    public ApiResponse<PaymentResponse> cancelPayment(@PathVariable String orderId) {
        log.info("取消支付: {}", orderId);
        PaymentResponse response = paymentService.cancelPayment(orderId);
        return ApiResponse.success(response);
    }

    /**
     * 退款
     */
    @PostMapping("/refund/{orderId}")
    public ApiResponse<PaymentResponse> refundPayment(
            @PathVariable String orderId,
            @RequestParam String reason) {
        log.info("退款: orderId={}, reason={}", orderId, reason);
        PaymentResponse response = paymentService.refundPayment(orderId, reason);
        return ApiResponse.success(response);
    }

    /**
     * 获取用户支付记录
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<List<PaymentResponse>> getUserPayments(@PathVariable Long userId) {
        log.info("获取用户支付记录: {}", userId);
        List<PaymentResponse> payments = paymentService.getUserPayments(userId);
        return ApiResponse.success(payments);
    }

    /**
     * 获取所有支付记录
     */
    @GetMapping
    public ApiResponse<List<PaymentResponse>> getAllPayments() {
        log.info("获取所有支付记录");
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ApiResponse.success(payments);
    }

    /**
     * 模拟支付成功（用于测试）
     */
    @PostMapping("/simulate-success/{orderId}")
    public ApiResponse<PaymentResponse> simulatePaymentSuccess(@PathVariable String orderId) {
        log.info("模拟支付成功: {}", orderId);
        String transactionId = "TXN_" + System.currentTimeMillis();
        PaymentResponse response = paymentService.processPaymentCallback(orderId, transactionId, true);
        return ApiResponse.success(response);
    }

    /**
     * 模拟支付失败（用于测试）
     */
    @PostMapping("/simulate-failure/{orderId}")
    public ApiResponse<PaymentResponse> simulatePaymentFailure(@PathVariable String orderId) {
        log.info("模拟支付失败: {}", orderId);
        PaymentResponse response = paymentService.processPaymentCallback(orderId, null, false);
        return ApiResponse.success(response);
    }
} 