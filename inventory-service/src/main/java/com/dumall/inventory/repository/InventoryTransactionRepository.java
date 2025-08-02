package com.dumall.inventory.repository;

import com.dumall.inventory.entity.InventoryTransaction;
import com.dumall.inventory.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 库存交易记录数据访问层
 */
@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    /**
     * 根据商品ID查找交易记录
     */
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(Long productId);

    /**
     * 根据交易类型查找
     */
    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);

    /**
     * 根据参考ID查找
     */
    List<InventoryTransaction> findByReferenceId(String referenceId);

    /**
     * 根据参考类型查找
     */
    List<InventoryTransaction> findByReferenceType(String referenceType);

    /**
     * 根据操作员ID查找
     */
    List<InventoryTransaction> findByOperatorId(Long operatorId);

    /**
     * 根据时间范围查找
     */
    List<InventoryTransaction> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 根据商品ID和时间范围查找
     */
    List<InventoryTransaction> findByProductIdAndCreatedAtBetween(
            Long productId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计商品的总入库数量
     */
    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM InventoryTransaction t " +
           "WHERE t.productId = :productId AND t.transactionType = 'INBOUND'")
    Integer getTotalInboundQuantity(@Param("productId") Long productId);

    /**
     * 统计商品的总出库数量
     */
    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM InventoryTransaction t " +
           "WHERE t.productId = :productId AND t.transactionType = 'OUTBOUND'")
    Integer getTotalOutboundQuantity(@Param("productId") Long productId);

    /**
     * 统计商品的总预留数量
     */
    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM InventoryTransaction t " +
           "WHERE t.productId = :productId AND t.transactionType = 'RESERVE'")
    Integer getTotalReservedQuantity(@Param("productId") Long productId);

    /**
     * 统计商品的总释放数量
     */
    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM InventoryTransaction t " +
           "WHERE t.productId = :productId AND t.transactionType = 'RELEASE'")
    Integer getTotalReleasedQuantity(@Param("productId") Long productId);
} 