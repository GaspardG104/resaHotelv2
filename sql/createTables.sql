-- Suppression et création de la base
DROP DATABASE IF EXISTS sql7800709;
CREATE DATABASE sql7800709;
USE sql7800709;

-- Table clients
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    nombre_personnes INT NOT NULL
) ENGINE=InnoDB;

-- Table chambres
CREATE TABLE chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL UNIQUE,
    capacite INT NOT NULL
) ENGINE=InnoDB;

-- Table réservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    chambre_id INT NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (chambre_id) REFERENCES chambres(id) ON DELETE CASCADE
) ENGINE=InnoDB;



-- Table employés
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Données initiales

-- Clients (doivent être insérés avant les réservations)
INSERT INTO clients (nom, email, telephone, nombre_personnes) VALUES
('Jean Dupont', 'jean.dupont@email.com', '0612345678', 2),
('Marie Martin', 'marie.martin@email.com', '0687654321', 3),
('Pierre Durand', 'pierre.durand@email.com', '0654321789', 1),
('Sophie Leclerc', 'sophie.leclerc@email.com', '0678912345', 4),
('Thomas Bernard', 'thomas.bernard@email.com', '0690123456', 2),
('Émilie Moreau', 'emilie.moreau@email.com', '0676543210', 1),
('François Petit', 'francois.petit@email.com', '0645678912', 2),
('Isabelle Roux', 'isabelle.roux@email.com', '0698765432', 3);

-- Chambres
INSERT INTO chambres (numero, capacite) VALUES
('101', 2),
('102', 2),
('103', 1),
('201', 3),
('202', 2),
('203', 4),
('301', 2),
('302', 3),
('401', 4),
('402', 1);

-- Réservations (les IDs clients/chambres doivent exister)
-- Réservations passées
INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES
(1, 1, '2024-01-15', '2024-01-20'),
(3, 3, '2024-02-05', '2024-02-07');

-- Réservations en cours
INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES
(2, 4, '2025-03-18', '2025-03-25'),
(5, 2, '2025-03-15', '2025-03-22');

-- Réservations futures
INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES
(4, 6, '2025-04-10', '2025-04-17'),
(6, 8, '2025-05-01', '2025-05-05'),
(7, 5, '2025-06-15', '2025-06-22'),
(8, 9, '2025-07-01', '2025-07-10');

-- Réservations pour même chambre à dates différentes
INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES
(1, 1, '2025-05-10', '2025-05-15'),
(2, 1, '2025-06-20', '2025-06-25');

-- Réservations pour même client dans différentes chambres
INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart) VALUES
(4, 7, '2025-08-05', '2025-08-12'),
(4, 10, '2025-10-10', '2025-10-15');

-- Employés génériques
INSERT INTO employes (username, password, email, role) VALUES
('alice', 'hashed_password_1', 'alice@example.com', 'admin'),
('bob', 'hashed_password_2', 'bob@example.com', 'user'),
('charlie', 'hashed_password_3', 'charlie@example.com', 'user'),
('diana', 'hashed_password_4', 'diana@example.com', 'moderator'),
('eric', 'hashed_password_5', 'eric@example.com', 'user');

-- Utilisateurs spécifiques au TP (mot de passe haché SHA2)
INSERT INTO employes (username, password, email, role) VALUES
('cnorris', SHA2('Azerty123', 256), 'cnorris@hotelcalifornia.com', 'responsable'),
('hdupont', SHA2('Azerty123', 256), 'hdupont@hotelcalifornia.com', 'standard');

-- Sélection finale
SELECT * FROM clients;
SELECT * FROM employes;
SELECT * FROM reservations;

-- (Optionnel, pas vraiment utile dans un script DDL/DML classique)
COMMIT;
