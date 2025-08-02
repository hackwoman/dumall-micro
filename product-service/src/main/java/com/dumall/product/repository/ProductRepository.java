package com.dumall.product.repository;

import com.dumall.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 商品仓库接口
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * 根据分类查找商品
     * @param category 商品分类
     * @return 商品列表
     */
    List<Product> findByCategory(String category);
    
    /**
     * 根据价格范围查找商品
     * @param minPrice 最低价格
     * @param maxPrice 最高价格
     * @return 商品列表
     */
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    /**
     * 根据名称模糊查询
     * @param name 商品名称
     * @return 商品列表
     */
    List<Product> findByNameContainingIgnoreCase(String name);
    
    /**
     * 查找库存大于0的商品
     * @return 商品列表
     */
    List<Product> findByStockGreaterThan(Integer stock);
    
    /**
     * 根据分类和价格范围查找商品
     * @param category 分类
     * @param minPrice 最低价格
     * @param maxPrice 最高价格
     * @return 商品列表
     */
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByCategoryAndPriceBetween(@Param("category") String category, 
                                               @Param("minPrice") BigDecimal minPrice, 
                                               @Param("maxPrice") BigDecimal maxPrice);
}