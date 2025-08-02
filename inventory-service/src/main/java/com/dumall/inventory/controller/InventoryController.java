package com.dumall.inventory.controller;

import com.dumall.common.response.ApiResponse;
import com.dumall.inventory.dto.InventoryRequest;
import com.dumall.inventory.dto.StockAdjustmentRequest;
import com.dumall.inventory.entity.Inventory;
import com.dumall.inventory.entity.InventoryTransaction;
import com.dumall.inventory.service.InventoryService;
import com.dumall.inventory.service.InventoryStatistics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 库存控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * 创建库存记录
     */
    @PostMapping
    public ApiResponse<Inventory> createInventory(@Valid @RequestBody InventoryRequest request) {
        log.info("创建库存记录: productId={}", request.getProductId());
        Inventory inventory = inventoryService.createInventory(request);
        return ApiResponse.success(inventory);
    }

    /**
     * 更新库存记录
     */
    @PutMapping("/{id}")
    public ApiResponse<Inventory> updateInventory(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        log.info("更新库存记录: id={}", id);
        Inventory inventory = inventoryService.updateInventory(id, request);
        return ApiResponse.success(inventory);
    }

    /**
     * 获取库存记录
     */
    @GetMapping("/{id}")
    public ApiResponse<Inventory> getInventory(@PathVariable Long id) {
        log.info("获取库存记录: id={}", id);
        Inventory inventory = inventoryService.getInventory(id);
        return ApiResponse.success(inventory);
    }

    /**
     * 根据商品ID获取库存
     */
    @GetMapping("/product/{productId}")
    public ApiResponse<Inventory> getInventoryByProductId(@PathVariable Long productId) {
        log.info("根据商品ID获取库存: productId={}", productId);
        Inventory inventory = inventoryService.getInventoryByProductId(productId);
        return ApiResponse.success(inventory);
    }

    /**
     * 获取所有库存记录
     */
    @GetMapping
    public ApiResponse<List<Inventory>> getAllInventories() {
        log.info("获取所有库存记录");
        List<Inventory> inventories = inventoryService.getAllInventories();
        return ApiResponse.success(inventories);
    }

    /**
     * 根据分类获取库存
     */
    @GetMapping("/category/{category}")
    public ApiResponse<List<Inventory>> getInventoriesByCategory(@PathVariable String category) {
        log.info("根据分类获取库存: category={}", category);
        List<Inventory> inventories = inventoryService.getInventoriesByCategory(category);
        return ApiResponse.success(inventories);
    }

    /**
     * 根据状态获取库存
     */
    @GetMapping("/status/{status}")
    public ApiResponse<List<Inventory>> getInventoriesByStatus(@PathVariable String status) {
        log.info("根据状态获取库存: status={}", status);
        List<Inventory> inventories = inventoryService.getInventoriesByStatus(status);
        return ApiResponse.success(inventories);
    }

    /**
     * 获取库存不足的商品
     */
    @GetMapping("/low-stock")
    public ApiResponse<List<Inventory>> getLowStockItems() {
        log.info("获取库存不足的商品");
        List<Inventory> inventories = inventoryService.getLowStockItems();
        return ApiResponse.success(inventories);
    }

    /**
     * 获取缺货的商品
     */
    @GetMapping("/out-of-stock")
    public ApiResponse<List<Inventory>> getOutOfStockItems() {
        log.info("获取缺货的商品");
        List<Inventory> inventories = inventoryService.getOutOfStockItems();
        return ApiResponse.success(inventories);
    }

    /**
     * 搜索库存
     */
    @GetMapping("/search")
    public ApiResponse<List<Inventory>> searchInventories(@RequestParam String keyword) {
        log.info("搜索库存: keyword={}", keyword);
        List<Inventory> inventories = inventoryService.searchInventories(keyword);
        return ApiResponse.success(inventories);
    }

    /**
     * 库存调整
     */
    @PostMapping("/adjust")
    public ApiResponse<InventoryTransaction> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        log.info("库存调整: productId={}, type={}", request.getProductId(), request.getTransactionType());
        InventoryTransaction transaction = inventoryService.adjustStock(request);
        return ApiResponse.success(transaction);
    }

    /**
     * 预留库存
     */
    @PostMapping("/reserve")
    public ApiResponse<InventoryTransaction> reserveStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam String referenceId) {
        log.info("预留库存: productId={}, quantity={}, referenceId={}", productId, quantity, referenceId);
        InventoryTransaction transaction = inventoryService.reserveStock(productId, quantity, referenceId);
        return ApiResponse.success(transaction);
    }

    /**
     * 释放预留库存
     */
    @PostMapping("/release")
    public ApiResponse<InventoryTransaction> releaseStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam String referenceId) {
        log.info("释放预留库存: productId={}, quantity={}, referenceId={}", productId, quantity, referenceId);
        InventoryTransaction transaction = inventoryService.releaseStock(productId, quantity, referenceId);
        return ApiResponse.success(transaction);
    }

    /**
     * 入库
     */
    @PostMapping("/inbound")
    public ApiResponse<InventoryTransaction> inboundStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam String referenceId) {
        log.info("入库: productId={}, quantity={}, referenceId={}", productId, quantity, referenceId);
        InventoryTransaction transaction = inventoryService.inboundStock(productId, quantity, referenceId);
        return ApiResponse.success(transaction);
    }

    /**
     * 出库
     */
    @PostMapping("/outbound")
    public ApiResponse<InventoryTransaction> outboundStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam String referenceId) {
        log.info("出库: productId={}, quantity={}, referenceId={}", productId, quantity, referenceId);
        InventoryTransaction transaction = inventoryService.outboundStock(productId, quantity, referenceId);
        return ApiResponse.success(transaction);
    }

    /**
     * 获取商品交易记录
     */
    @GetMapping("/transactions/product/{productId}")
    public ApiResponse<List<InventoryTransaction>> getProductTransactions(@PathVariable Long productId) {
        log.info("获取商品交易记录: productId={}", productId);
        List<InventoryTransaction> transactions = inventoryService.getProductTransactions(productId);
        return ApiResponse.success(transactions);
    }

    /**
     * 获取所有交易记录
     */
    @GetMapping("/transactions")
    public ApiResponse<List<InventoryTransaction>> getAllTransactions() {
        log.info("获取所有交易记录");
        List<InventoryTransaction> transactions = inventoryService.getAllTransactions();
        return ApiResponse.success(transactions);
    }

    /**
     * 删除库存记录
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInventory(@PathVariable Long id) {
        log.info("删除库存记录: id={}", id);
        inventoryService.deleteInventory(id);
        return ApiResponse.success(null);
    }

    /**
     * 获取库存统计信息
     */
    @GetMapping("/statistics")
    public ApiResponse<InventoryStatistics> getInventoryStatistics() {
        log.info("获取库存统计信息");
        InventoryStatistics statistics = inventoryService.getInventoryStatistics();
        return ApiResponse.success(statistics);
    }

    /**
     * 更新库存状态
     */
    @PostMapping("/update-status/{productId}")
    public ApiResponse<Void> updateInventoryStatus(@PathVariable Long productId) {
        log.info("更新库存状态: productId={}", productId);
        inventoryService.updateInventoryStatus(productId);
        return ApiResponse.success(null);
    }
} 