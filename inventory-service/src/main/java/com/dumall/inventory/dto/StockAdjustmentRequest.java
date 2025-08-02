package com.dumall.inventory.dto;

import com.dumall.inventory.entity.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 库存调整请求DTO
 */
@Data
public class StockAdjustmentRequest {

    @NotNull(message = "商品ID不能为空")
    private Long productId;

    @NotNull(message = "交易类型不能为空")
    private TransactionType transactionType;

    @NotNull(message = "数量不能为空")
    @Min(value = 1, message = "数量必须大于0")
    private Integer quantity;

    private String referenceId;
    private String referenceType;
    private Long operatorId;
    private String operatorName;
    private String notes;
} 