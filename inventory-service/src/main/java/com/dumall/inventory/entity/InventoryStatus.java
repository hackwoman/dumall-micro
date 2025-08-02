package com.dumall.inventory.entity;

/**
 * 库存状态枚举
 */
public enum InventoryStatus {
    ACTIVE("正常"),
    LOW_STOCK("库存不足"),
    OUT_OF_STOCK("缺货"),
    DISCONTINUED("停售");

    private final String description;

    InventoryStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 