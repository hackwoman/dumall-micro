-- 清空现有数据
DELETE FROM payments;

-- 插入示例支付数据
INSERT INTO payments (order_id, user_id, amount, payment_method, status, transaction_id, description, created_at, updated_at, paid_at) VALUES
('ORDER_20250723_001', 1, 8999.00, 'ALIPAY', 'SUCCESS', 'TXN_20250723_001', 'iPhone 15 Pro 购买', '2025-07-23 10:00:00', '2025-07-23 10:05:00', '2025-07-23 10:05:00'),
('ORDER_20250723_002', 1, 1999.00, 'WECHAT', 'SUCCESS', 'TXN_20250723_002', 'AirPods Pro 购买', '2025-07-23 11:00:00', '2025-07-23 11:03:00', '2025-07-23 11:03:00'),
('ORDER_20250723_003', 2, 2999.00, 'BANK_CARD', 'PENDING', NULL, 'Apple Watch Series 9 购买', '2025-07-23 12:00:00', '2025-07-23 12:00:00', NULL),
('ORDER_20250723_004', 2, 599.00, 'CREDIT_CARD', 'FAILED', NULL, '机械键盘 购买', '2025-07-23 13:00:00', '2025-07-23 13:02:00', NULL),
('ORDER_20250723_005', 3, 1299.00, 'ALIPAY', 'CANCELLED', NULL, 'Adidas Ultraboost 购买', '2025-07-23 14:00:00', '2025-07-23 14:30:00', NULL); 