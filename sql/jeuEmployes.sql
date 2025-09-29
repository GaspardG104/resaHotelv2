
-- Géneration d'une base donnée par ChatGPT
INSERT INTO employes (username, password, email, role) VALUES
('alice', 'hashed_password_1', 'alice@example.com', 'admin'),
('bob', 'hashed_password_2', 'bob@example.com', 'user'),
('charlie', 'hashed_password_3', 'charlie@example.com', 'user'),
('diana', 'hashed_password_4', 'diana@example.com', 'moderator'),
('eric', 'hashed_password_5', 'eric@example.com', 'user');

-- Utilisateurs du TP

INSERT INTO employes (username, password, email, role)
VALUES ('cnorris', SHA2('Azerty123', 256), 'cnorris@hotelcalifornia.com', 'responsable');
INSERT INTO employes (username, password, email, role)
VALUES ('hdupont', SHA2('Azerty123', 256), 'hdupont@hotelcalifornia.com', 'standard');

