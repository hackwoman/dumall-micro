package com.dumall.inventory.dto;

import com.dumall.inventory.entity.InventoryStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 库存请求DTO
 */
@Data
public class InventoryRequest {

    @NotNull(message = "商品ID不能为空")
    private Long productId;

    @NotBlank(message = "商品名称不能为空")
    private String productName;

    @NotBlank(message = "商品分类不能为空")
    private String category;

    @NotNull(message = "当前库存不能为空")
    @Min(value = 0, message = "库存不能为负数")
    private Integer currentStock;

    @NotNull(message = "最小库存不能为空")
    @Min(value = 0, message = "最小库存不能为负数")
    private Integer minStock;

    @NotNull(message = "最大库存不能为空")
    @Min(value = 1, message = "最大库存必须大于0")
    private Integer maxStock;

    @NotNull(message = "单价不能为空")
    @Min(value = 0, message = "单价不能为负数")
    private Double unitPrice;

    private String warehouseLocation;
    private InventoryStatus status;
} 