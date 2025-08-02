package com.dumall.product.controller;

import com.dumall.common.response.ApiResponse;
import com.dumall.product.entity.Product;
import com.dumall.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

/**
 * 商品控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * 获取所有商品
     * 
     * @return 商品列表
     */
    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {
        log.info("获取所有商品");
        List<Product> products = productService.getAllProducts();
        return ApiResponse.success(products);
    }

    /**
     * 根据ID获取商品
     * 
     * @param id 商品ID
     * @return 商品信息
     */
    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        log.info("根据ID获取商品: {}", id);
        Product product = productService.getProductById(id);
        return ApiResponse.success(product);
    }

    /**
     * 创建商品
     * 
     * @param product 商品信息
     * @return 创建的商品
     */
    @PostMapping
    public ApiResponse<Product> createProduct(@Valid @RequestBody Product product) {
        log.info("创建商品: {}", product.getName());
        Product createdProduct = productService.createProduct(product);
        return ApiResponse.success(createdProduct);
    }

    /**
     * 更新商品
     * 
     * @param id      商品ID
     * @param product 商品信息
     * @return 更新后的商品
     */
    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        log.info("更新商品: {}", id);
        Product updatedProduct = productService.updateProduct(id, product);
        return ApiResponse.success(updatedProduct);
    }

    /**
     * 删除商品
     * 
     * @param id 商品ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("删除商品: {}", id);
        productService.deleteProduct(id);
        return ApiResponse.success();
    }

    /**
     * 根据分类获取商品
     * 
     * @param category 商品分类
     * @return 商品列表
     */
    @GetMapping("/category/{category}")
    public ApiResponse<List<Product>> getProductsByCategory(@PathVariable String category) {
        log.info("根据分类获取商品: {}", category);
        List<Product> products = productService.getProductsByCategory(category);
        return ApiResponse.success(products);
    }

    /**
     * 根据价格范围获取商品
     * 
     * @param minPrice 最低价格
     * @param maxPrice 最高价格
     * @return 商品列表
     */
    @GetMapping("/price-range")
    public ApiResponse<List<Product>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        log.info("根据价格范围获取商品: {} - {}", minPrice, maxPrice);
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ApiResponse.success(products);
    }

    /**
     * 搜索商品
     * 
     * @param keyword 关键词
     * @return 商品列表
     */
    @GetMapping("/search")
    public ApiResponse<List<Product>> searchProducts(@RequestParam String keyword) {
        log.info("搜索商品: {}", keyword);
        List<Product> products = productService.searchProducts(keyword);
        return ApiResponse.success(products);
    }

    /**
     * 获取有库存的商品
     * 
     * @return 商品列表
     */
    @GetMapping("/available")
    public ApiResponse<List<Product>> getAvailableProducts() {
        log.info("获取有库存的商品");
        List<Product> products = productService.getAvailableProducts();
        return ApiResponse.success(products);
    }

    /**
     * 更新商品库存
     * 
     * @param id       商品ID
     * @param quantity 数量
     * @return 更新后的商品
     */
    @PutMapping("/{id}/stock")
    public ApiResponse<Product> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        log.info("更新商品库存: {} - {}", id, quantity);
        Product product = productService.updateStock(id, quantity);
        return ApiResponse.success(product);
    }
}