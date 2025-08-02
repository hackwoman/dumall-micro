package com.dumall.product.service;

import com.dumall.common.exception.BusinessException;
import com.dumall.product.entity.Product;
import com.dumall.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 商品服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    /**
     * 获取所有商品
     * @return 商品列表
     */
    public List<Product> getAllProducts() {
        log.info("获取所有商品");
        return productRepository.findAll();
    }
    
    /**
     * 根据ID获取商品
     * @param id 商品ID
     * @return 商品对象
     */
    public Product getProductById(Long id) {
        log.info("根据ID获取商品: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("商品不存在"));
    }
    
    /**
     * 创建商品
     * @param product 商品信息
     * @return 创建的商品
     */
    @Transactional
    public Product createProduct(Product product) {
        log.info("创建商品: {}", product.getName());
        return productRepository.save(product);
    }
    
    /**
     * 更新商品信息
     * @param id 商品ID
     * @param product 商品信息
     * @return 更新后的商品
     */
    @Transactional
    public Product updateProduct(Long id, Product product) {
        log.info("更新商品: {}", id);
        
        Product existingProduct = getProductById(id);
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setImageUrl(product.getImageUrl());
        
        return productRepository.save(existingProduct);
    }
    
    /**
     * 删除商品
     * @param id 商品ID
     */
    @Transactional
    public void deleteProduct(Long id) {
        log.info("删除商品: {}", id);
        
        if (!productRepository.existsById(id)) {
            throw new BusinessException("商品不存在");
        }
        
        productRepository.deleteById(id);
    }
    
    /**
     * 根据分类获取商品
     * @param category 商品分类
     * @return 商品列表
     */
    public List<Product> getProductsByCategory(String category) {
        log.info("根据分类获取商品: {}", category);
        return productRepository.findByCategory(category);
    }
    
    /**
     * 根据价格范围获取商品
     * @param minPrice 最低价格
     * @param maxPrice 最高价格
     * @return 商品列表
     */
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        log.info("根据价格范围获取商品: {} - {}", minPrice, maxPrice);
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    /**
     * 搜索商品
     * @param keyword 关键词
     * @return 商品列表
     */
    public List<Product> searchProducts(String keyword) {
        log.info("搜索商品: {}", keyword);
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    /**
     * 获取有库存的商品
     * @return 商品列表
     */
    public List<Product> getAvailableProducts() {
        log.info("获取有库存的商品");
        return productRepository.findByStockGreaterThan(0);
    }
    
    /**
     * 更新商品库存
     * @param id 商品ID
     * @param quantity 数量（正数为增加，负数为减少）
     * @return 更新后的商品
     */
    @Transactional
    public Product updateStock(Long id, Integer quantity) {
        log.info("更新商品库存: {} - {}", id, quantity);
        
        Product product = getProductById(id);
        int newStock = product.getStock() + quantity;
        
        if (newStock < 0) {
            throw new BusinessException("库存不足");
        }
        
        product.setStock(newStock);
        return productRepository.save(product);
    }
}