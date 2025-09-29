-- Création de la table des clients
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    nombre_personnes INT NOT NULL
);

-- Création de la table des chambres
CREATE TABLE chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL UNIQUE,
    capacite INT NOT NULL
);

-- Création de la table des réservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    chambre_id INT NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (chambre_id) REFERENCES chambres(id) ON DELETE CASCADE
);

-- Ajout d'un index pour accélérer les recherches de disponibilité
CREATE INDEX idx_reservation_dates ON reservations(chambre_id, date_arrivee, date_depart);


-- Création de la table des employés
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) engine="InnoDB";