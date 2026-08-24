CREATE DATABASE IF NOT EXISTS bdstore;
USE bdstore;

-- Development reset script. Do not run against production data.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS orderitems;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS cartitems;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NULL,
	address TEXT NULL,
	role ENUM('client', 'seller', 'admin') NOT NULL DEFAULT 'client',
	isApproved TINYINT(1) NOT NULL DEFAULT 0,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE categories (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(80) NOT NULL UNIQUE,
	description TEXT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT NULL,
	price DECIMAL(10, 2) NOT NULL,
	images JSON NOT NULL,
	stock INT NOT NULL DEFAULT 0,
	sellerId INT NOT NULL,
	categoryId INT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT fk_products_seller FOREIGN KEY (sellerId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_products_category FOREIGN KEY (categoryId) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	status ENUM('active', 'completed') NOT NULL DEFAULT 'active',
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT fk_carts_user FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cartitems (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	cartId INT NOT NULL,
	productId INT NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT fk_cartitems_cart FOREIGN KEY (cartId) REFERENCES carts(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_cartitems_product FOREIGN KEY (productId) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	rating INT NOT NULL,
	comment TEXT NULL,
	userId INT NOT NULL,
	productId INT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
	CONSTRAINT fk_reviews_user FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_reviews_product FOREIGN KEY (productId) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	cartId INT NULL,
	totalAmount FLOAT NOT NULL,
	status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
	paymentStatus ENUM('pending', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_orders_cart FOREIGN KEY (cartId) REFERENCES carts(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE orderitems (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	orderId INT NOT NULL,
	productId INT NOT NULL,
	quantity INT NOT NULL,
	price FLOAT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	CONSTRAINT fk_orderitems_order FOREIGN KEY (orderId) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_orderitems_product FOREIGN KEY (productId) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 1. USERS
-- =====================================================

INSERT INTO users
(id, name, email, password, phone, address, role, isApproved, createdAt, updatedAt)
VALUES
(1, 'Roua Admin', 'admin@bytestore.tn',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'20111222', 'Sfax, Tunisia', 'admin', 1, NOW(), NOW()),

(2, 'Nadia Seller', 'nadia.seller@bytestore.tn',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'22333444', 'Tunis, Tunisia', 'seller', 1, NOW(), NOW()),

(3, 'Med Khalil Seller', 'khalil.seller@bytestore.tn',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'25555666', 'Sousse, Tunisia', 'seller', 1, NOW(), NOW()),

(4, 'Ahmed Client', 'ahmed.client@gmail.com',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'50123456', 'Sfax, Tunisia', 'client', 1, NOW(), NOW()),

(5, 'Sarra Client', 'sarra.client@gmail.com',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'98765432', 'Monastir, Tunisia', 'client', 1, NOW(), NOW()),

(6, 'Yassine Seller', 'yassine.seller@bytestore.tn',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'22112233', 'Bizerte, Tunisia', 'seller', 1, NOW(), NOW()),

(7, 'Meriem Seller', 'meriem.seller@bytestore.tn',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'33223344', 'Nabeul, Tunisia', 'seller', 1, NOW(), NOW()),

(8, 'Amine Client', 'amine.client@gmail.com',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'44556677', 'Ariana, Tunisia', 'client', 1, NOW(), NOW()),

(9, 'Ines Client', 'ines.client@gmail.com',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'55667788', 'Menzah, Tunisia', 'client', 1, NOW(), NOW()),

(10, 'Malek Client', 'malek.client@gmail.com',
'$2a$12$V5h686KV6URS8dgNtXu7y.XYhTPVQ/VNudtN/8SiBw2//Zju9YOmO',
'66778899', 'Mahdia, Tunisia', 'client', 1, NOW(), NOW());


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
 NOW(), NOW()),

(4, 'Gaming Consoles',
 'PlayStation, Xbox, Nintendo and gaming consoles',
 NOW(), NOW()),

(5, 'Storage',
 'SSDs, HDDs, USB drives and external storage',
 NOW(), NOW()),

(6, 'Networking',
 'Routers, Wi-Fi devices, switches and networking accessories',
 NOW(), NOW()),

(7, 'Printers & Scanners',
 'Printers, scanners and printing accessories',
 NOW(), NOW()),

(8, 'PC Components',
 'Graphics cards, processors, RAM and computer components',
 NOW(), NOW()),

(9, 'Smartwatches',
 'Smartwatches, fitness trackers and wearable devices',
 NOW(), NOW()),

(10, 'Accessories',
 'Chargers, cables, stands, bags and tech accessories',
 NOW(), NOW());


-- =====================================================
-- 3. PRODUCTS
-- 81 PRODUCTS
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
 2, 3, NOW(), NOW()),

(61, 'PlayStation 5 Slim',
 'Sony PlayStation 5 Slim Digital Edition',
 2199.00, 8,
 '["https://images.unsplash.com/photo-1606813907291-d86efa9b94db"]',
 3, 4, NOW(), NOW()),

(62, 'Xbox Series X',
 'Microsoft Xbox Series X 1TB Gaming Console',
 2299.00, 7,
 '["https://images.unsplash.com/photo-1621259182978-fbf93132d53d"]',
 3, 4, NOW(), NOW()),

(63, 'Nintendo Switch OLED',
 'Nintendo Switch OLED with 64GB internal storage',
 1499.00, 10,
 '["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e"]',
 6, 4, NOW(), NOW()),

(64, 'Samsung T7 Shield 2TB',
 'Portable external SSD 2TB USB-C',
 699.00, 14,
 '["https://images.unsplash.com/photo-1597848212624-a19eb35e2651"]',
 6, 5, NOW(), NOW()),

(65, 'WD Black SN850X 1TB',
 'High-performance NVMe PCIe 4.0 SSD',
 499.00, 16,
 '["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b"]',
 6, 5, NOW(), NOW()),

(66, 'Seagate Expansion 2TB',
 'External USB 3.0 portable hard drive',
 299.00, 20,
 '["https://images.unsplash.com/photo-1531492746076-161ca9b34339"]',
 7, 5, NOW(), NOW()),

(67, 'TP-Link Archer AX73',
 'Wi-Fi 6 dual-band Gigabit router',
 429.00, 12,
 '["https://images.unsplash.com/photo-1606904825846-647eb07f5be2"]',
 7, 6, NOW(), NOW()),

(68, 'TP-Link Deco X20',
 'Wi-Fi 6 mesh system with two units',
 649.00, 9,
 '["https://images.unsplash.com/photo-1558494949-ef010cbdcc31"]',
 7, 6, NOW(), NOW()),

(69, 'Canon PIXMA G3410',
 'All-in-one wireless ink tank printer',
 699.00, 6,
 '["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6"]',
 6, 7, NOW(), NOW()),

(70, 'HP LaserJet Pro M404dn',
 'Professional monochrome laser printer',
 899.00, 5,
 '["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae"]',
 7, 7, NOW(), NOW()),

(71, 'NVIDIA GeForce RTX 4070 Super',
 '12GB GDDR6X graphics card for high-end gaming',
 2599.00, 6,
 '["https://images.unsplash.com/photo-1591488320449-011701bb6704"]',
 3, 8, NOW(), NOW()),

(72, 'AMD Ryzen 7 7800X3D',
 '8-core gaming desktop processor',
 1499.00, 8,
 '["https://images.unsplash.com/photo-1555617778-02518510b9fa"]',
 3, 8, NOW(), NOW()),

(73, 'Corsair Vengeance 32GB DDR5',
 '32GB DDR5 6000MHz desktop memory kit',
 399.00, 15,
 '["https://images.unsplash.com/photo-1562976540-1502c2145186"]',
 2, 8, NOW(), NOW()),

(74, 'Apple Watch Series 10',
 'Advanced smartwatch with fitness and health features',
 1799.00, 8,
 '["https://images.unsplash.com/photo-1546868871-7041f2a55e12"]',
 2, 9, NOW(), NOW()),

(75, 'Samsung Galaxy Watch 7',
 'Premium Android smartwatch with fitness tracking',
 1099.00, 10,
 '["https://images.unsplash.com/photo-1523275335684-37898b6baf30"]',
 7, 9, NOW(), NOW()),

(76, 'Xiaomi Smart Band 9',
 'Fitness tracker with AMOLED display',
 179.00, 25,
 '["https://images.unsplash.com/photo-1557935728-e6d1eaabe558"]',
 7, 9, NOW(), NOW()),

(77, 'Anker 65W USB-C Charger',
 'Compact GaN fast charger with USB-C support',
 149.00, 30,
 '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0"]',
 2, 10, NOW(), NOW()),

(78, 'Baseus USB-C Hub 8-in-1',
 'Multiport USB-C hub with HDMI and card reader',
 189.00, 22,
 '["https://images.unsplash.com/photo-1625842268584-8f3296236761"]',
 6, 10, NOW(), NOW()),

(79, 'Laptop Stand Aluminum',
 'Adjustable aluminum laptop stand for desk setup',
 119.00, 28,
 '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"]',
 7, 10, NOW(), NOW()),

(80, 'Tech Travel Backpack',
 'Water-resistant backpack with laptop compartment',
 249.00, 18,
 '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"]',
 6, 10, NOW(), NOW()),

(81, 'Anker Power Bank 20000mAh',
 'High-capacity portable power bank with USB-C',
 199.00, 20,
 '["https://images.unsplash.com/photo-1609592424389-6d8a1d3d7a55"]',
 2, 10, NOW(), NOW());


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
-- 7. ORDERS AND ORDER ITEMS
-- =====================================================

INSERT INTO orders
(id, userId, cartId, totalAmount, status, paymentStatus, createdAt, updatedAt)
VALUES
(1, 4, NULL, 3850.00, 'paid', 'paid', NOW(), NOW()),
(2, 5, NULL, 1198.00, 'processing', 'paid', NOW(), NOW()),
(3, 8, NULL, 899.00, 'delivered', 'paid', NOW(), NOW());

INSERT INTO orderitems
(id, orderId, productId, quantity, price, createdAt, updatedAt)
VALUES
(1, 1, 1, 1, 3850.00, NOW(), NOW()),
(2, 2, 41, 2, 249.00, NOW(), NOW()),
(3, 2, 50, 1, 700.00, NOW(), NOW()),
(4, 3, 39, 1, 899.00, NOW(), NOW());


-- =====================================================
-- 8. VERIFICATION
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
SELECT 'REVIEWS', COUNT(*) FROM reviews
UNION ALL
SELECT 'ORDERS', COUNT(*) FROM orders
UNION ALL
SELECT 'ORDER ITEMS', COUNT(*) FROM orderitems;

SELECT 'orphan products' AS check_name, COUNT(*) AS total
FROM products p LEFT JOIN users u ON u.id = p.sellerId LEFT JOIN categories c ON c.id = p.categoryId
WHERE u.id IS NULL OR c.id IS NULL
UNION ALL
SELECT 'orphan cart items', COUNT(*)
FROM cartitems ci LEFT JOIN carts c ON c.id = ci.cartId LEFT JOIN products p ON p.id = ci.productId
WHERE c.id IS NULL OR p.id IS NULL
UNION ALL
SELECT 'orphan reviews', COUNT(*)
FROM reviews r LEFT JOIN users u ON u.id = r.userId LEFT JOIN products p ON p.id = r.productId
WHERE u.id IS NULL OR p.id IS NULL
UNION ALL
SELECT 'orphan order items', COUNT(*)
FROM orderitems oi LEFT JOIN orders o ON o.id = oi.orderId LEFT JOIN products p ON p.id = oi.productId
WHERE o.id IS NULL OR p.id IS NULL;