package com.dumall.payment.service.impl;

import com.dumall.payment.dto.PaymentRequest;
import com.dumall.payment.dto.PaymentResponse;
import com.dumall.payment.entity.Payment;
import com.dumall.payment.entity.PaymentStatus;
import com.dumall.payment.repository.PaymentRepository;
import com.dumall.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 支付服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        log.info("创建支付订单: {}", request.getOrderId());

        // 检查是否已存在支付记录
        if (paymentRepository.existsByOrderId(request.getOrderId())) {
            throw new RuntimeException("订单已存在支付记录");
        }

        // 创建支付记录
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .description(request.getDescription())
                .build();

        payment = paymentRepository.save(payment);

        // 模拟第三方支付接口调用
        return simulateThirdPartyPayment(payment);
    }

    @Override
    @Transactional
    public PaymentResponse processPaymentCallback(String orderId, String transactionId, boolean success) {
        log.info("处理支付回调: orderId={}, transactionId={}, success={}", orderId, transactionId, success);

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("支付记录不存在");
        }

        Payment payment = paymentOpt.get();
        if (success) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(transactionId);
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        payment = paymentRepository.save(payment);
        return convertToResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentStatus(String orderId) {
        log.info("查询支付状态: {}", orderId);

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("支付记录不存在");
        }

        return convertToResponse(paymentOpt.get());
    }

    @Override
    @Transactional
    public PaymentResponse cancelPayment(String orderId) {
        log.info("取消支付: {}", orderId);

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("支付记录不存在");
        }

        Payment payment = paymentOpt.get();
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("只能取消待支付的订单");
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        payment = paymentRepository.save(payment);

        return convertToResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(String orderId, String reason) {
        log.info("退款: orderId={}, reason={}", orderId, reason);

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("支付记录不存在");
        }

        Payment payment = paymentOpt.get();
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("只能对支付成功的订单进行退款");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setDescription(payment.getDescription() + " [退款原因: " + reason + "]");
        payment = paymentRepository.save(payment);

        return convertToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getUserPayments(Long userId) {
        log.info("获取用户支付记录: {}", userId);

        List<Payment> payments = paymentRepository.findByUserId(userId);
        return payments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        log.info("获取所有支付记录");

        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse simulateThirdPartyPayment(Payment payment) {
        log.info("模拟第三方支付接口调用: orderId={}", payment.getOrderId());

        // 模拟生成支付链接和二维码
        String paymentUrl = "https://pay.dumall.com/pay/" + payment.getOrderId();
        String qrCode = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

        PaymentResponse response = convertToResponse(payment);
        response.setPaymentUrl(paymentUrl);
        response.setQrCode(qrCode);

        return response;
    }

    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrderId());
        response.setUserId(payment.getUserId());
        response.setAmount(payment.getAmount());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setStatus(payment.getStatus());
        response.setTransactionId(payment.getTransactionId());
        response.setDescription(payment.getDescription());
        response.setCreatedAt(payment.getCreatedAt());
        response.setPaidAt(payment.getPaidAt());
        return response;
    }
} 