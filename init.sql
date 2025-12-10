CREATE DATABASE IF NOT EXISTS eczane;
USE eczane;

-- Reçetesiz kullanıcılar
CREATE TABLE IF NOT EXISTS hastalar (
  tc_kimlik VARCHAR(11) PRIMARY KEY,
  ad VARCHAR(50) NOT NULL
);

-- Reçeteli ilaçlar (her koda karşı 2 ilaç)
CREATE TABLE IF NOT EXISTS ilaclar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recete_kodu VARCHAR(20) NOT NULL,
  ad VARCHAR(100) NOT NULL,
  skt DATE NOT NULL,
  kullanim_talimati TEXT NOT NULL
);

-- Örnek hastalar
INSERT IGNORE INTO hastalar (tc_kimlik, ad) VALUES
  ('12345678901', 'Ahmet Yılmaz'),
  ('39876543210', 'Ayşe Demir');

-- Örnek reçeteli ilaçlar
INSERT IGNORE INTO ilaclar (recete_kodu, ad, skt, kullanim_talimati) VALUES
  ('CODE1', 'Paracetamol', '2025-12-31', 'Günde 3 kez, yemek sonrası alınız'),
  ('CODE1', 'Ibuprofen',   '2024-06-30', 'Günde 2 kez, 200 mg, tok karnına alınız'),
  ('CODE2', 'Aspirin',      '2025-03-31', 'Günde 1 kez, sabah aç karnına alınız'),
  ('CODE2', 'Naproksen',    '2025-11-30', 'Günde 2 kez, 250 mg, yemek sonrası alınız'); 
