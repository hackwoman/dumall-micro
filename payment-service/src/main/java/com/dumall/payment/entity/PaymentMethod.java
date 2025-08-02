package com.dumall.payment.entity;

/**
 * 支付方式枚举
 */
public enum PaymentMethod {
    ALIPAY("支付宝"),
    WECHAT("微信支付"),
    BANK_CARD("银行卡"),
    CREDIT_CARD("信用卡");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 