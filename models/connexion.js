// ============================================================
// CONNEXION À LA BASE DE DONNÉES MYSQL
// Utilise un POOL de connexions (10 portes réutilisables)
// ============================================================

import mysql from 'mysql2/promise'; // Driver MySQL avec support des promesses (await)
import fs from 'fs';                 // Pour lire le fichier de config
import ini from 'ini';               // Pour parser le format .ini
import path from 'path';
import { fileURLToPath } from 'url';

// Reconstruction de __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lecture des identifiants depuis db.ini
// → Pourquoi un fichier séparé ? Pour ne pas mettre le mot de passe dans le code
// → Le fichier est dans .gitignore (pas envoyé sur GitHub)
const config = ini.parse(fs.readFileSync(path.join(__dirname, '../config/db.ini'), 'utf-8'));
const dbConfig = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    charset: config.charset
};

// POOL = réservoir de 10 connexions MySQL réutilisées
// → Ouvrir/fermer une connexion à chaque requête serait trop lent
// → Si 11 requêtes en même temps : la 11ème attend qu'une porte se libère
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;