package com.dumall.inventory.service.impl;

import com.dumall.inventory.dto.InventoryRequest;
import com.dumall.inventory.dto.StockAdjustmentRequest;
import com.dumall.inventory.entity.Inventory;
import com.dumall.inventory.entity.InventoryStatus;
import com.dumall.inventory.entity.InventoryTransaction;
import com.dumall.inventory.entity.TransactionType;
import com.dumall.inventory.repository.InventoryRepository;
import com.dumall.inventory.repository.InventoryTransactionRepository;
import com.dumall.inventory.service.InventoryService;
import com.dumall.inventory.service.InventoryStatistics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 库存服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    @Override
    @Transactional
    public Inventory createInventory(InventoryRequest request) {
        log.info("创建库存记录: productId={}", request.getProductId());

        // 检查是否已存在
        if (inventoryRepository.existsByProductId(request.getProductId())) {
            throw new RuntimeException("商品库存记录已存在");
        }

        Inventory inventory = Inventory.builder()
                .productId(request.getProductId())
                .productName(request.getProductName())
                .category(request.getCategory())
                .currentStock(request.getCurrentStock())
                .reservedStock(0)
                .availableStock(request.getCurrentStock())
                .minStock(request.getMinStock())
                .maxStock(request.getMaxStock())
                .unitPrice(request.getUnitPrice())
                .warehouseLocation(request.getWarehouseLocation())
                .status(request.getStatus() != null ? request.getStatus() : InventoryStatus.ACTIVE)
                .build();

        inventory = inventoryRepository.save(inventory);
        updateInventoryStatus(inventory.getProductId());

        return inventory;
    }

    @Override
    @Transactional
    public Inventory updateInventory(Long id, InventoryRequest request) {
        log.info("更新库存记录: id={}", id);

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("库存记录不存在"));

        inventory.setProductName(request.getProductName());
        inventory.setCategory(request.getCategory());
        inventory.setCurrentStock(request.getCurrentStock());
        inventory.setMinStock(request.getMinStock());
        inventory.setMaxStock(request.getMaxStock());
        inventory.setUnitPrice(request.getUnitPrice());
        inventory.setWarehouseLocation(request.getWarehouseLocation());
        inventory.setStatus(request.getStatus());

        inventory = inventoryRepository.save(inventory);
        updateInventoryStatus(inventory.getProductId());

        return inventory;
    }

    @Override
    public Inventory getInventory(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("库存记录不存在"));
    }

    @Override
    public Inventory getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("库存记录不存在"));
    }

    @Override
    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    @Override
    public List<Inventory> getInventoriesByCategory(String category) {
        return inventoryRepository.findByCategory(category);
    }

    @Override
    public List<Inventory> getInventoriesByStatus(String status) {
        return inventoryRepository.findByStatus(InventoryStatus.valueOf(status.toUpperCase()));
    }

    @Override
    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    @Override
    public List<Inventory> getOutOfStockItems() {
        return inventoryRepository.findOutOfStockItems();
    }

    @Override
    public List<Inventory> searchInventories(String keyword) {
        return inventoryRepository.findByProductNameContainingIgnoreCase(keyword);
    }

    @Override
    @Transactional
    public InventoryTransaction adjustStock(StockAdjustmentRequest request) {
        log.info("库存调整: productId={}, type={}, quantity={}", 
                request.getProductId(), request.getTransactionType(), request.getQuantity());

        Inventory inventory = getInventoryByProductId(request.getProductId());
        int beforeStock = inventory.getCurrentStock();
        int afterStock = beforeStock;

        switch (request.getTransactionType()) {
            case INBOUND:
                afterStock += request.getQuantity();
                break;
            case OUTBOUND:
                if (inventory.getAvailableStock() < request.getQuantity()) {
                    throw new RuntimeException("库存不足");
                }
                afterStock -= request.getQuantity();
                break;
            case RESERVE:
                if (inventory.getAvailableStock() < request.getQuantity()) {
                    throw new RuntimeException("可预留库存不足");
                }
                inventory.setReservedStock(inventory.getReservedStock() + request.getQuantity());
                break;
            case RELEASE:
                if (inventory.getReservedStock() < request.getQuantity()) {
                    throw new RuntimeException("预留库存不足");
                }
                inventory.setReservedStock(inventory.getReservedStock() - request.getQuantity());
                break;
            case ADJUSTMENT:
                afterStock = request.getQuantity();
                break;
            case RETURN:
                afterStock += request.getQuantity();
                break;
            case DAMAGE:
                if (inventory.getCurrentStock() < request.getQuantity()) {
                    throw new RuntimeException("库存不足");
                }
                afterStock -= request.getQuantity();
                break;
        }

        inventory.setCurrentStock(afterStock);
        inventory = inventoryRepository.save(inventory);
        updateInventoryStatus(inventory.getProductId());

        // 创建交易记录
        InventoryTransaction transaction = InventoryTransaction.builder()
                .productId(request.getProductId())
                .productName(inventory.getProductName())
                .transactionType(request.getTransactionType())
                .quantity(request.getQuantity())
                .beforeStock(beforeStock)
                .afterStock(afterStock)
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .operatorId(request.getOperatorId())
                .operatorName(request.getOperatorName())
                .notes(request.getNotes())
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public InventoryTransaction reserveStock(Long productId, Integer quantity, String referenceId) {
        StockAdjustmentRequest request = new StockAdjustmentRequest();
        request.setProductId(productId);
        request.setTransactionType(TransactionType.RESERVE);
        request.setQuantity(quantity);
        request.setReferenceId(referenceId);
        request.setReferenceType("ORDER");
        return adjustStock(request);
    }

    @Override
    @Transactional
    public InventoryTransaction releaseStock(Long productId, Integer quantity, String referenceId) {
        StockAdjustmentRequest request = new StockAdjustmentRequest();
        request.setProductId(productId);
        request.setTransactionType(TransactionType.RELEASE);
        request.setQuantity(quantity);
        request.setReferenceId(referenceId);
        request.setReferenceType("ORDER");
        return adjustStock(request);
    }

    @Override
    @Transactional
    public InventoryTransaction inboundStock(Long productId, Integer quantity, String referenceId) {
        StockAdjustmentRequest request = new StockAdjustmentRequest();
        request.setProductId(productId);
        request.setTransactionType(TransactionType.INBOUND);
        request.setQuantity(quantity);
        request.setReferenceId(referenceId);
        request.setReferenceType("INBOUND");
        return adjustStock(request);
    }

    @Override
    @Transactional
    public InventoryTransaction outboundStock(Long productId, Integer quantity, String referenceId) {
        StockAdjustmentRequest request = new StockAdjustmentRequest();
        request.setProductId(productId);
        request.setTransactionType(TransactionType.OUTBOUND);
        request.setQuantity(quantity);
        request.setReferenceId(referenceId);
        request.setReferenceType("OUTBOUND");
        return adjustStock(request);
    }

    @Override
    public List<InventoryTransaction> getProductTransactions(Long productId) {
        return transactionRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Override
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteInventory(Long id) {
        log.info("删除库存记录: id={}", id);
        inventoryRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void updateInventoryStatus(Long productId) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(productId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            InventoryStatus newStatus = determineInventoryStatus(inventory);
            if (inventory.getStatus() != newStatus) {
                inventory.setStatus(newStatus);
                inventoryRepository.save(inventory);
                log.info("更新库存状态: productId={}, status={}", productId, newStatus);
            }
        }
    }

    @Override
    public InventoryStatistics getInventoryStatistics() {
        List<Inventory> allInventories = inventoryRepository.findAll();
        
        long totalProducts = allInventories.size();
        long totalStock = allInventories.stream().mapToLong(Inventory::getCurrentStock).sum();
        double totalValue = allInventories.stream()
                .mapToDouble(i -> i.getCurrentStock() * i.getUnitPrice()).sum();
        
        long lowStockCount = inventoryRepository.findLowStockItems().size();
        long outOfStockCount = inventoryRepository.findOutOfStockItems().size();
        long normalStockCount = allInventories.stream()
                .filter(i -> i.getStatus() == InventoryStatus.ACTIVE).count();
        long discontinuedCount = allInventories.stream()
                .filter(i -> i.getStatus() == InventoryStatus.DISCONTINUED).count();

        return InventoryStatistics.builder()
                .totalProducts(totalProducts)
                .totalStock(totalStock)
                .totalValue(totalValue)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .normalStockCount(normalStockCount)
                .discontinuedCount(discontinuedCount)
                .build();
    }

    private InventoryStatus determineInventoryStatus(Inventory inventory) {
        if (inventory.getCurrentStock() == 0) {
            return InventoryStatus.OUT_OF_STOCK;
        } else if (inventory.getCurrentStock() <= inventory.getMinStock()) {
            return InventoryStatus.LOW_STOCK;
        } else {
            return InventoryStatus.ACTIVE;
        }
    }
} 