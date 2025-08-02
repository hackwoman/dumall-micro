package com.dumall.inventory.service;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 库存统计信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryStatistics {

    /**
     * 总商品种类数
     */
    private Long totalProducts;

    /**
     * 总库存数量
     */
    private Long totalStock;

    /**
     * 总库存价值
     */
    private Double totalValue;

    /**
     * 库存不足商品数
     */
    private Long lowStockCount;

    /**
     * 缺货商品数
     */
    private Long outOfStockCount;

    /**
     * 正常库存商品数
     */
    private Long normalStockCount;

    /**
     * 停售商品数
     */
    private Long discontinuedCount;
} 