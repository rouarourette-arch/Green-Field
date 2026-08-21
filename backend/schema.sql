USE bdstore;

-- =====================================================
-- 1. USERS
-- =====================================================

INSERT INTO users
(id, name, email, password, phone, address, role, isApproved, createdAt, updatedAt)
VALUES
(1, 'Roua Admin', 'admin@bytestore.tn',
'$2a$10$wE9mH8ZJvh1f/.Pq1WlSseXv8Q7Ua9C4L/oIbgNqYF4oK31pC8sOS',
'20111222', 'Sfax, Tunisia', 'admin', 1, NOW(), NOW()),

(2, 'Nadia Seller', 'nadia.seller@bytestore.tn',
'$2a$10$wE9mH8ZJvh1f/.Pq1WlSseXv8Q7Ua9C4L/oIbgNqYF4oK31pC8sOS',
'22333444', 'Tunis, Tunisia', 'seller', 1, NOW(), NOW()),

(3, 'Med Khalil Seller', 'khalil.seller@bytestore.tn',
'$2a$10$wE9mH8ZJvh1f/.Pq1WlSseXv8Q7Ua9C4L/oIbgNqYF4oK31pC8sOS',
'25555666', 'Sousse, Tunisia', 'seller', 0, NOW(), NOW()),

(4, 'Ahmed Client', 'ahmed.client@gmail.com',
'$2a$10$wE9mH8ZJvh1f/.Pq1WlSseXv8Q7Ua9C4L/oIbgNqYF4oK31pC8sOS',
'50123456', 'Sfax, Tunisia', 'client', 1, NOW(), NOW()),

(5, 'Sarra Client', 'sarra.client@gmail.com',
'$2a$10$wE9mH8ZJvh1f/.Pq1WlSseXv8Q7Ua9C4L/oIbgNqYF4oK31pC8sOS',
'98765432', 'Monastir, Tunisia', 'client', 1, NOW(), NOW());


-- =====================================================
-- 2. CATEGORIES
-- =====================================================

INSERT INTO categories
(id, name, description, created_at, updated_at)
VALUES
(1, 'Laptops & PC',
 'Gaming Laptops, Workstations and Desktop PCs',
 NOW(), NOW()),

(2, 'Smartphones',
 'Android, iOS Smartphones and Tablets',
 NOW(), NOW()),

(3, 'Peripherals',
 'Keyboards, Mice, Monitors, Headsets and Accessories',
 NOW(), NOW());


-- =====================================================
-- 3. PRODUCTS
-- 60 PRODUCTS
-- =====================================================

INSERT INTO products
(id, name, description, price, stock, images, sellerId, categoryId, createdAt, updatedAt)
VALUES

-- =====================================================
-- LAPTOPS & PC : 1 - 20
-- =====================================================

(1, 'PC Gamer ASUS ROG Strix',
 'Intel i7 13th Gen, RTX 4060, 16GB RAM, 1TB SSD',
 3850.00, 10,
 '["https://images.unsplash.com/photo-1603302576837-37561b2e2302"]',
 2, 1, NOW(), NOW()),

(2, 'MacBook Air M2',
 'Apple M2 chip, 8GB RAM, 256GB SSD, Space Gray',
 3200.00, 5,
 '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"]',
 2, 1, NOW(), NOW()),

(3, 'Dell XPS 15',
 'Intel Core i7, 16GB RAM, 512GB SSD, 15.6 inch Display',
 3499.00, 8,
 '["https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf"]',
 2, 1, NOW(), NOW()),

(4, 'Lenovo Legion 5',
 'Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD',
 3599.00, 8,
 '["https://images.unsplash.com/photo-1602080858428-57174f9431cf"]',
 2, 1, NOW(), NOW()),

(5, 'ASUS TUF Gaming A15',
 'Ryzen 7, RTX 4060, 16GB RAM, 512GB SSD',
 3299.00, 12,
 '["https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf"]',
 2, 1, NOW(), NOW()),

(6, 'HP Victus 15',
 'Intel Core i5, RTX 4050, 16GB RAM, 512GB SSD',
 2799.00, 14,
 '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]',
 2, 1, NOW(), NOW()),

(7, 'Acer Nitro V15',
 'Intel Core i7, RTX 4050, 16GB RAM, 512GB SSD',
 2899.00, 10,
 '["https://images.unsplash.com/photo-1484788984921-03950022c9ef"]',
 2, 1, NOW(), NOW()),

(8, 'MSI Katana 15',
 'Intel Core i7, RTX 4060, 16GB RAM, 1TB SSD',
 3499.00, 7,
 '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45"]',
 2, 1, NOW(), NOW()),

(9, 'Dell G15 Gaming',
 'Intel Core i7, RTX 3050, 16GB RAM, 512GB SSD',
 2699.00, 9,
 '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"]',
 2, 1, NOW(), NOW()),

(10, 'Lenovo IdeaPad 5',
 'Intel Core i5, 16GB RAM, 512GB SSD',
 2199.00, 15,
 '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]',
 2, 1, NOW(), NOW()),

(11, 'HP Pavilion 15',
 'Intel Core i5, 8GB RAM, 512GB SSD',
 1999.00, 18,
 '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef"]',
 2, 1, NOW(), NOW()),

(12, 'Acer Aspire 5',
 'Intel Core i5, 16GB RAM, 512GB SSD',
 1899.00, 20,
 '["https://images.unsplash.com/photo-1531297484001-80022131f5a1"]',
 2, 1, NOW(), NOW()),

(13, 'ASUS VivoBook 15',
 'Intel Core i5, 8GB RAM, 512GB SSD, OLED Display',
 2299.00, 11,
 '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]',
 2, 1, NOW(), NOW()),

(14, 'MacBook Pro 14 M3',
 'Apple M3 Pro, 18GB RAM, 512GB SSD, Retina Display',
 5899.00, 6,
 '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"]',
 2, 1, NOW(), NOW()),

(15, 'MacBook Air M3',
 'Apple M3, 8GB RAM, 256GB SSD',
 3999.00, 9,
 '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef"]',
 2, 1, NOW(), NOW()),

(16, 'Dell Inspiron 15',
 'Intel Core i5, 16GB RAM, 512GB SSD',
 2099.00, 16,
 '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"]',
 2, 1, NOW(), NOW()),

(17, 'Lenovo ThinkPad E14',
 'Intel Core i5, 16GB RAM, 512GB SSD',
 2399.00, 13,
 '["https://images.unsplash.com/photo-1484788984921-03950022c9ef"]',
 2, 1, NOW(), NOW()),

(18, 'ASUS ROG Zephyrus G14',
 'Ryzen 9, RTX 4070, 32GB RAM, 1TB SSD',
 5499.00, 5,
 '["https://images.unsplash.com/photo-1603302576837-37561b2e2302"]',
 2, 1, NOW(), NOW()),

(19, 'MSI Raider GE78',
 'Intel Core i9, RTX 4080, 32GB RAM, 2TB SSD',
 7499.00, 3,
 '["https://images.unsplash.com/photo-1593642634367-d91a135587b5"]',
 2, 1, NOW(), NOW()),

(20, 'Acer Predator Helios 16',
 'Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD',
 5799.00, 5,
 '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45"]',
 2, 1, NOW(), NOW()),


-- =====================================================
-- SMARTPHONES : 21 - 40
-- =====================================================

(21, 'iPhone 15 Pro Max',
 '256GB, Titanium Natural, A17 Pro Chip',
 4299.00, 10,
 '["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd"]',
 2, 2, NOW(), NOW()),

(22, 'iPhone 15',
 '128GB, Black, Super Retina XDR Display',
 3199.00, 15,
 '["https://images.unsplash.com/photo-1591337676887-a217a6970a8a"]',
 2, 2, NOW(), NOW()),

(23, 'iPhone 14',
 '128GB, Midnight, A15 Bionic',
 2699.00, 12,
 '["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb"]',
 2, 2, NOW(), NOW()),

(24, 'Samsung Galaxy S24',
 '256GB, Onyx Black, AMOLED 120Hz',
 2999.00, 14,
 '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"]',
 2, 2, NOW(), NOW()),

(25, 'Samsung Galaxy S24+',
 '256GB, 12GB RAM, Dynamic AMOLED 2X',
 3599.00, 9,
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]',
 2, 2, NOW(), NOW()),

(26, 'Samsung Galaxy A55',
 '256GB, 8GB RAM, Super AMOLED Display',
 1499.00, 20,
 '["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]',
 2, 2, NOW(), NOW()),

(27, 'Google Pixel 9 Pro',
 '256GB, 16GB RAM, Advanced AI Camera',
 3699.00, 7,
 '["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]',
 2, 2, NOW(), NOW()),

(28, 'Google Pixel 8',
 '128GB, OLED Display, Google Tensor G3',
 2499.00, 11,
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]',
 2, 2, NOW(), NOW()),

(29, 'Xiaomi 14',
 '512GB, 12GB RAM, Leica Camera',
 2699.00, 13,
 '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]',
 2, 2, NOW(), NOW()),

(30, 'Xiaomi Redmi Note 13 Pro',
 '256GB, 8GB RAM, 200MP Camera',
 1199.00, 25,
 '["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]',
 2, 2, NOW(), NOW()),

(31, 'OnePlus 12',
 '256GB, 12GB RAM, Snapdragon 8 Gen 3',
 2999.00, 8,
 '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]',
 2, 2, NOW(), NOW()),

(32, 'Nothing Phone 2',
 '256GB, 12GB RAM, Glyph Interface',
 2299.00, 10,
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]',
 2, 2, NOW(), NOW()),

(33, 'Huawei P60 Pro',
 '256GB, 8GB RAM, OLED Display',
 2599.00, 6,
 '["https://images.unsplash.com/photo-1592286927505-1def25115558"]',
 2, 2, NOW(), NOW()),

(34, 'OPPO Reno 11',
 '256GB, 12GB RAM, AMOLED Display',
 1799.00, 14,
 '["https://images.unsplash.com/photo-1607936854279-55e8e7e6b5b4"]',
 2, 2, NOW(), NOW()),

(35, 'Samsung Galaxy Z Flip 6',
 '256GB, Foldable AMOLED Display',
 3999.00, 5,
 '["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]',
 2, 2, NOW(), NOW()),

(36, 'iPad Air M2',
 '11 inch, 128GB, Apple M2 Chip',
 2799.00, 10,
 '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"]',
 2, 2, NOW(), NOW()),

(37, 'iPad Pro M4',
 '11 inch, 256GB, Apple M4 Chip',
 4499.00, 6,
 '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"]',
 2, 2, NOW(), NOW()),

(38, 'Samsung Galaxy A35',
 '128GB, 8GB RAM, AMOLED Display',
 1199.00, 18,
 '["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]',
 2, 2, NOW(), NOW()),

(39, 'Redmi Note 13',
 '128GB, 8GB RAM, AMOLED 120Hz',
 899.00, 22,
 '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]',
 2, 2, NOW(), NOW()),

(40, 'Realme GT 6',
 '256GB, 12GB RAM, Snapdragon Processor',
 1999.00, 10,
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]',
 2, 2, NOW(), NOW()),


-- =====================================================
-- PERIPHERALS : 41 - 60
-- =====================================================

(41, 'Logitech G502 HERO',
 'High Performance Gaming Mouse, 25K DPI',
 249.00, 30,
 '["https://images.unsplash.com/photo-1527814050087-3793815479db"]',
 2, 3, NOW(), NOW()),

(42, 'Logitech G Pro Wireless',
 'Wireless Gaming Mouse, Lightweight Design',
 399.00, 18,
 '["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7"]',
 2, 3, NOW(), NOW()),

(43, 'Razer DeathAdder V3',
 'Ergonomic Gaming Mouse, 30K DPI',
 349.00, 20,
 '["https://images.unsplash.com/photo-1527814050087-3793815479db"]',
 2, 3, NOW(), NOW()),

(44, 'Logitech G213 Keyboard',
 'RGB Gaming Keyboard, Spill Resistant',
 189.00, 25,
 '["https://images.unsplash.com/photo-1587829741301-dc798b83add3"]',
 2, 3, NOW(), NOW()),

(45, 'Razer BlackWidow V4',
 'Mechanical RGB Gaming Keyboard',
 499.00, 12,
 '["https://images.unsplash.com/photo-1595225476474-87563907a212"]',
 2, 3, NOW(), NOW()),

(46, 'Corsair K70 RGB',
 'Mechanical Gaming Keyboard, Cherry MX',
 549.00, 9,
 '["https://images.unsplash.com/photo-1587829741301-dc798b83add3"]',
 2, 3, NOW(), NOW()),

(47, 'Logitech G733 Headset',
 'Wireless RGB Gaming Headset',
 399.00, 15,
 '["https://images.unsplash.com/photo-1599669454699-248893623440"]',
 2, 3, NOW(), NOW()),

(48, 'HyperX Cloud II',
 'Gaming Headset with 7.1 Surround Sound',
 299.00, 22,
 '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"]',
 2, 3, NOW(), NOW()),

(49, 'Sony WH-1000XM5',
 'Wireless Noise Cancelling Headphones',
 1099.00, 8,
 '["https://images.unsplash.com/photo-1546435770-a3e426bf472b"]',
 2, 3, NOW(), NOW()),

(50, 'AirPods Pro 2',
 'Wireless Earbuds with Active Noise Cancellation',
 899.00, 13,
 '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434"]',
 2, 3, NOW(), NOW()),

(51, 'Samsung Galaxy Buds 3',
 'Wireless Earbuds with ANC',
 599.00, 16,
 '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df"]',
 2, 3, NOW(), NOW()),

(52, 'LG UltraGear 27GN800',
 '27 inch QHD Gaming Monitor, 144Hz',
 999.00, 7,
 '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"]',
 2, 3, NOW(), NOW()),

(53, 'Samsung Odyssey G5',
 '32 inch QHD Curved Gaming Monitor, 165Hz',
 1299.00, 6,
 '["https://images.unsplash.com/photo-1616763355548-1b606f439f86"]',
 2, 3, NOW(), NOW()),

(54, 'ASUS TUF VG27AQ',
 '27 inch QHD IPS Gaming Monitor, 165Hz',
 1199.00, 8,
 '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"]',
 2, 3, NOW(), NOW()),

(55, 'Dell UltraSharp U2723QE',
 '27 inch 4K USB-C Professional Monitor',
 1599.00, 5,
 '["https://images.unsplash.com/photo-1593640495253-23196b27a87f"]',
 2, 3, NOW(), NOW()),

(56, 'TP-Link Archer AX55',
 'WiFi 6 Dual Band Gigabit Router',
 299.00, 18,
 '["https://images.unsplash.com/photo-1606904825846-647eb07f5be2"]',
 2, 3, NOW(), NOW()),

(57, 'Logitech C920 Webcam',
 'Full HD 1080p Webcam with Stereo Audio',
 279.00, 20,
 '["https://images.unsplash.com/photo-1587826080692-f439cd0b70da"]',
 2, 3, NOW(), NOW()),

(58, 'Elgato Stream Deck',
 '15-Key Live Content Control Pad',
 699.00, 7,
 '["https://images.unsplash.com/photo-1598550476439-6847785fcea6"]',
 2, 3, NOW(), NOW()),

(59, 'Samsung T7 SSD 1TB',
 'Portable External SSD, USB-C',
 399.00, 15,
 '["https://images.unsplash.com/photo-1597848212624-a19eb35e2651"]',
 2, 3, NOW(), NOW()),

(60, 'Kingston Fury 16GB RAM',
 'DDR5 16GB Gaming Memory Module',
 189.00, 25,
 '["https://images.unsplash.com/photo-1562976540-1502c2145186"]',
 2, 3, NOW(), NOW());


-- =====================================================
-- 4. CARTS
-- =====================================================

INSERT INTO carts
(id, userId, createdAt, updatedAt)
VALUES
(1, 4, NOW(), NOW()),
(2, 5, NOW(), NOW());


-- =====================================================
-- 5. CART ITEMS
-- =====================================================

INSERT INTO cartitems
(id, cartId, productId, quantity, createdAt, updatedAt)
VALUES
(1, 1, 5, 1, NOW(), NOW()),
(2, 1, 14, 1, NOW(), NOW()),
(3, 1, 41, 2, NOW(), NOW()),
(4, 1, 50, 1, NOW(), NOW()),

(5, 2, 21, 1, NOW(), NOW()),
(6, 2, 24, 1, NOW(), NOW()),
(7, 2, 48, 1, NOW(), NOW());


-- =====================================================
-- 6. REVIEWS
-- =====================================================

INSERT INTO reviews
(id, rating, comment, userId, productId, createdAt, updatedAt)
VALUES
(1, 5, 'Produit parfait, livraison rapide!', 4, 1, NOW(), NOW()),
(2, 4, 'Tres bon produit et autonomie excellente.', 5, 2, NOW(), NOW()),
(3, 5, 'Excellent PC gaming, tres performant.', 4, 5, NOW(), NOW()),
(4, 4, 'Tres bon rapport qualite prix.', 5, 6, NOW(), NOW()),
(5, 5, 'MacBook magnifique et tres rapide.', 4, 14, NOW(), NOW()),
(6, 5, 'Excellent telephone, camera incroyable.', 5, 21, NOW(), NOW()),
(7, 4, 'Tres bon ecran et performances solides.', 4, 24, NOW(), NOW()),
(8, 5, 'Souris tres confortable pour gaming.', 5, 41, NOW(), NOW()),
(9, 4, 'Clavier excellent et RGB magnifique.', 4, 45, NOW(), NOW()),
(10, 5, 'Casque tres confortable avec excellent son.', 5, 49, NOW(), NOW()),
(11, 5, 'Monitor parfait pour le gaming.', 4, 52, NOW(), NOW()),
(12, 4, 'SSD rapide et facile a utiliser.', 5, 59, NOW(), NOW());


-- =====================================================
-- 7. VERIFICATION
-- =====================================================

SELECT 'USERS' AS table_name, COUNT(*) AS total FROM users
UNION ALL
SELECT 'CATEGORIES', COUNT(*) FROM categories
UNION ALL
SELECT 'PRODUCTS', COUNT(*) FROM products
UNION ALL
SELECT 'CARTS', COUNT(*) FROM carts
UNION ALL
SELECT 'CART ITEMS', COUNT(*) FROM cartitems
UNION ALL
SELECT 'REVIEWS', COUNT(*) FROM reviews;