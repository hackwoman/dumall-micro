package com.dumall.inventory.entity;

/**
 * 交易类型枚举
 */
public enum TransactionType {
    INBOUND("入库"),
    OUTBOUND("出库"),
    RESERVE("预留"),
    RELEASE("释放预留"),
    ADJUSTMENT("调整"),
    RETURN("退货"),
    DAMAGE("报损");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 