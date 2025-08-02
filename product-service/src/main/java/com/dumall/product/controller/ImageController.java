package com.dumall.product.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * 图片控制器 - 生成占位图片
 */
@RestController
@RequestMapping("/api/placeholder")
public class ImageController {

    /**
     * 生成占位图片
     * 
     * @param width     宽度
     * @param height    高度
     * @param bgColor   背景色
     * @param textColor 文字颜色
     * @param text      文字内容
     * @return 图片数据
     */
    @GetMapping("/{width}/{height}/{bgColor}/{textColor}")
    public ResponseEntity<byte[]> generatePlaceholder(
            @PathVariable int width,
            @PathVariable int height,
            @PathVariable String bgColor,
            @PathVariable String textColor,
            @RequestParam(defaultValue = "Placeholder") String text) {

        try {
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = image.createGraphics();

            // 设置背景色
            g2d.setColor(Color.decode("#" + bgColor));
            g2d.fillRect(0, 0, width, height);

            // 绘制简单的几何图形作为占位符
            g2d.setColor(Color.decode("#" + textColor));
            g2d.setStroke(new BasicStroke(3));

            // 绘制边框
            g2d.drawRect(10, 10, width - 20, height - 20);

            // 绘制对角线
            g2d.drawLine(10, 10, width - 10, height - 10);
            g2d.drawLine(width - 10, 10, 10, height - 10);

            // 绘制中心圆
            int centerX = width / 2;
            int centerY = height / 2;
            int radius = Math.min(width, height) / 4;
            g2d.drawOval(centerX - radius, centerY - radius, radius * 2, radius * 2);

            g2d.dispose();

            // 转换为字节数组
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(baos.toByteArray());

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}