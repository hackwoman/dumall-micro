package com.dumall.inventory.repository;

import com.dumall.inventory.entity.Inventory;
import com.dumall.inventory.entity.InventoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 库存数据访问层
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    /**
     * 根据商品ID查找库存
     */
    Optional<Inventory> findByProductId(Long productId);

    /**
     * 根据商品分类查找库存
     */
    List<Inventory> findByCategory(String category);

    /**
     * 根据库存状态查找
     */
    List<Inventory> findByStatus(InventoryStatus status);

    /**
     * 查找库存不足的商品
     */
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.minStock")
    List<Inventory> findLowStockItems();

    /**
     * 查找缺货的商品
     */
    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0")
    List<Inventory> findOutOfStockItems();

    /**
     * 根据商品名称模糊查询
     */
    List<Inventory> findByProductNameContainingIgnoreCase(String productName);

    /**
     * 根据仓库位置查找
     */
    List<Inventory> findByWarehouseLocation(String warehouseLocation);

    /**
     * 检查商品是否存在库存记录
     */
    boolean existsByProductId(Long productId);

    /**
     * 统计总库存数量
     */
    @Query("SELECT SUM(i.currentStock) FROM Inventory i")
    Long getTotalStock();

    /**
     * 统计总库存价值
     */
    @Query("SELECT SUM(i.currentStock * i.unitPrice) FROM Inventory i")
    Double getTotalValue();
} 