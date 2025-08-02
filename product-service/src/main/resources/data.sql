-- 清空现有数据
DELETE FROM products;

-- 数码产品分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('iPhone 15 Pro', '最新款iPhone，A17 Pro芯片，钛金属机身，专业摄影系统', 8999.00, 50, '数码产品', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'),
('MacBook Air M2', '轻薄便携，M2芯片，13.6英寸Liquid视网膜显示屏', 9999.00, 30, '数码产品', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'),
('AirPods Pro', '主动降噪，空间音频，防水防汗，完美音质', 1999.00, 100, '数码产品', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop'),
('iPad Air', 'M1芯片，10.9英寸全面屏，支持Apple Pencil', 4799.00, 40, '数码产品', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'),
('Apple Watch Series 9', '健康监测，运动追踪，智能通知，时尚设计', 3299.00, 60, '数码产品', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=300&fit=crop'),
('Samsung Galaxy S24', '骁龙8 Gen 3，6.2英寸动态AMOLED，专业摄影', 6999.00, 45, '数码产品', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'),
('Sony WH-1000XM5', '业界领先降噪，30小时续航，高清音质', 2899.00, 35, '数码产品', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'),
('机械键盘', 'Cherry轴体，RGB背光，人体工学设计', 599.00, 80, '数码产品', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop'),
('无线鼠标', '2.4G无线连接，12000DPI，静音按键', 199.00, 120, '数码产品', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'),
('显示器', '27寸4K显示器，色彩准确，护眼设计', 2499.00, 25, '数码产品', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'),
('游戏手柄', 'Xbox风格设计，震动反馈，兼容多平台', 399.00, 60, '数码产品', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'),
('蓝牙音箱', '360度环绕音效，防水设计，20小时续航', 599.00, 40, '数码产品', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop');

-- 服装配饰分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Nike Air Max', '经典气垫设计，舒适缓震，时尚外观', 899.00, 80, '服装配饰', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'),
('Adidas Ultraboost', 'BOOST中底，Primeknit鞋面，能量回馈', 1299.00, 60, '服装配饰', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop'),
('Levis 501牛仔裤', '经典直筒版型，100%纯棉，舒适耐穿', 599.00, 100, '服装配饰', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop'),
('Uniqlo羽绒服', '轻薄保暖，90%白鸭绒，多色可选', 799.00, 70, '服装配饰', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'),
('Zara连衣裙', '时尚设计，优质面料，修身剪裁', 399.00, 50, '服装配饰', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop'),
('HM T恤', '纯棉面料，简约设计，多色可选', 99.00, 200, '服装配饰', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'),
('Coach钱包', '真皮材质，经典设计，实用收纳', 899.00, 30, '服装配饰', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'),
('Ray-Ban墨镜', '经典飞行员款，UV400防护，时尚百搭', 1299.00, 40, '服装配饰', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'),
('Casio手表', 'G-Shock系列，防水防震，多功能显示', 899.00, 55, '服装配饰', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop'),
('Hermes丝巾', '真丝材质，经典图案，优雅设计', 2999.00, 20, '服装配饰', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop');

-- 家居用品分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('IKEA沙发', '北欧简约设计，舒适坐感，三人座', 2999.00, 15, '家居用品', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'),
('MUJI床品四件套', '纯棉材质，简约设计，舒适睡眠', 599.00, 80, '家居用品', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop'),
('Philips台灯', 'LED护眼灯，可调光调色，节能环保', 299.00, 120, '家居用品', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'),
('Dyson吸尘器', '无线设计，强劲吸力，60分钟续航', 3999.00, 25, '家居用品', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'),
('小米空气净化器', 'HEPA过滤，智能控制，静音运行', 999.00, 60, '家居用品', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'),
('宜家书桌', '简约设计，环保材质，实用收纳', 799.00, 40, '家居用品', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('无印良品收纳盒', 'PP材质，简约设计，多尺寸可选', 99.00, 150, '家居用品', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('美的电饭煲', '智能控制，多功能烹饪，4L容量', 399.00, 80, '家居用品', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('苏泊尔炒锅', '不粘涂层，导热均匀，健康烹饪', 299.00, 100, '家居用品', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('海尔冰箱', '风冷无霜，节能静音，大容量存储', 2999.00, 20, '家居用品', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop');

-- 美妆护肤分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('SK-II神仙水', 'PITERA精华，改善肤质，提亮肤色', 1599.00, 50, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('兰蔻小黑瓶', '精华肌底液，修护肌肤，改善肤质', 999.00, 60, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('雅诗兰黛小棕瓶', '夜间修护精华，抗衰老，紧致肌肤', 899.00, 70, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('MAC口红', '经典子弹头，持久显色，多色可选', 199.00, 200, '美妆护肤', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop'),
('YSL粉底液', '轻薄服帖，持久遮瑕，自然妆感', 599.00, 80, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('资生堂防晒霜', 'SPF50+，PA++++，清爽不油腻', 299.00, 120, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('倩碧黄油', '经典保湿乳液，温和不刺激', 399.00, 90, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('欧莱雅眼霜', '淡化细纹，紧致眼周，改善黑眼圈', 299.00, 100, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('植村秀卸妆油', '温和卸妆，深层清洁，不刺激', 399.00, 80, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
('悦诗风吟面膜', '天然成分，补水保湿，改善肤质', 99.00, 300, '美妆护肤', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop');

-- 运动户外分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Nike运动鞋', '专业跑步鞋，缓震科技，舒适透气', 899.00, 100, '运动户外', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'),
('Adidas运动服', '速干面料，透气设计，专业运动', 399.00, 150, '运动户外', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'),
('Under Armour健身裤', '高弹面料，修身设计，运动自如', 299.00, 120, '运动户外', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'),
('Lululemon瑜伽垫', '环保材质，防滑设计，专业瑜伽', 199.00, 200, '运动户外', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'),
('The North Face冲锋衣', '防水透气，轻便保暖，户外必备', 1299.00, 60, '运动户外', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'),
('Columbia登山鞋', '防水耐磨，抓地力强，舒适徒步', 899.00, 80, '运动户外', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'),
('Patagonia背包', '大容量设计，防水材质，户外旅行', 699.00, 70, '运动户外', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'),
('Garmin运动手表', 'GPS定位，心率监测，运动数据分析', 1999.00, 40, '运动户外', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop'),
('Wilson网球拍', '专业级网球拍，碳纤维材质，平衡设计', 899.00, 50, '运动户外', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'),
('Nike篮球', '标准7号球，优质皮革，专业比赛', 299.00, 100, '运动户外', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop');

-- 图书文具分类
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('《三体》科幻小说', '刘慈欣代表作，科幻文学经典，精装版', 89.00, 200, '图书文具', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'),
('《百年孤独》', '加西亚·马尔克斯经典作品，魔幻现实主义', 69.00, 150, '图书文具', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'),
('《人类简史》', '尤瓦尔·赫拉利作品，人类发展史', 79.00, 180, '图书文具', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'),
('《活着》', '余华代表作，人生哲理，精装版', 49.00, 250, '图书文具', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'),
('《解忧杂货店》', '东野圭吾温暖治愈小说', 59.00, 200, '图书文具', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'),
('Pilot钢笔', '日本进口，0.5mm笔尖，书写流畅', 199.00, 100, '图书文具', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('Moleskine笔记本', '意大利进口，优质纸张，经典设计', 299.00, 80, '图书文具', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('Staedtler铅笔', '德国进口，HB硬度，书写顺滑', 29.00, 500, '图书文具', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('得力计算器', '科学计算器，多功能，学生必备', 99.00, 150, '图书文具', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
('晨光中性笔', '0.5mm笔尖，多色可选，书写流畅', 19.00, 1000, '图书文具', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'); 