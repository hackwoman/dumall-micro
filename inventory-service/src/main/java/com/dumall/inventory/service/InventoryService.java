package com.dumall.inventory.service;

import com.dumall.inventory.dto.InventoryRequest;
import com.dumall.inventory.dto.StockAdjustmentRequest;
import com.dumall.inventory.entity.Inventory;
import com.dumall.inventory.entity.InventoryTransaction;

import java.util.List;

/**
 * 库存服务接口
 */
public interface InventoryService {

    /**
     * 创建库存记录
     */
    Inventory createInventory(InventoryRequest request);

    /**
     * 更新库存记录
     */
    Inventory updateInventory(Long id, InventoryRequest request);

    /**
     * 获取库存记录
     */
    Inventory getInventory(Long id);

    /**
     * 根据商品ID获取库存
     */
    Inventory getInventoryByProductId(Long productId);

    /**
     * 获取所有库存记录
     */
    List<Inventory> getAllInventories();

    /**
     * 根据分类获取库存
     */
    List<Inventory> getInventoriesByCategory(String category);

    /**
     * 根据状态获取库存
     */
    List<Inventory> getInventoriesByStatus(String status);

    /**
     * 获取库存不足的商品
     */
    List<Inventory> getLowStockItems();

    /**
     * 获取缺货的商品
     */
    List<Inventory> getOutOfStockItems();

    /**
     * 搜索库存
     */
    List<Inventory> searchInventories(String keyword);

    /**
     * 库存调整
     */
    InventoryTransaction adjustStock(StockAdjustmentRequest request);

    /**
     * 预留库存
     */
    InventoryTransaction reserveStock(Long productId, Integer quantity, String referenceId);

    /**
     * 释放预留库存
     */
    InventoryTransaction releaseStock(Long productId, Integer quantity, String referenceId);

    /**
     * 入库
     */
    InventoryTransaction inboundStock(Long productId, Integer quantity, String referenceId);

    /**
     * 出库
     */
    InventoryTransaction outboundStock(Long productId, Integer quantity, String referenceId);

    /**
     * 获取商品交易记录
     */
    List<InventoryTransaction> getProductTransactions(Long productId);

    /**
     * 获取所有交易记录
     */
    List<InventoryTransaction> getAllTransactions();

    /**
     * 删除库存记录
     */
    void deleteInventory(Long id);

    /**
     * 更新库存状态
     */
    void updateInventoryStatus(Long productId);

    /**
     * 获取库存统计信息
     */
    InventoryStatistics getInventoryStatistics();
} 