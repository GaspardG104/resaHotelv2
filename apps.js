// ============================================================
// POINT D'ENTRÉE DE L'APPLICATION
// Architecture : MVC (Model / View / Controller)
// Stack : Node.js + Express + EJS + MySQL
// ============================================================

// --- IMPORTS ---
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routeurs (un par entité = on découpe pour la lisibilité)
import chambreRoutes from './routes/chambres.js';
import clientRoutes from './routes/clients.js';

// Création de l'app Express (= mon site web)
const app = express();

const PORT = process.env.PORT || 3000;

// Reconstruction de __dirname (nécessaire car on est en ESM, pas en CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION EJS ---
// EJS = moteur de templates : du HTML avec des "trous" (<%= %>) remplis par mon code
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES ---
// Middleware = code qui s'exécute entre la requête et la réponse

// Sert les fichiers statiques (CSS, images) du dossier public
app.use(express.static('public'));

// ⚠️ Doublon de la ligne du dessus (à nettoyer)
app.use(express.static(path.join(__dirname, 'public')));

// Lit le CORPS des formulaires HTML → remplit req.body (objet JavaScript)
app.use(express.urlencoded({ extended: true }));

// Lit les données JSON entrantes
app.use(express.json());

// Rend le CSS de Semantic UI accessible via /semantic-ui
app.use('/semantic-ui', express.static(
    path.join(__dirname, 'node_modules', 'semantic-ui-css'),
    { fallthrough: true }
));

// --- ROUTE PRINCIPALE ---
// Page d'accueil : affiche la vue accueil/accueil.ejs
app.get('/', (req, res) => {
    res.render('accueil/accueil', {
        title: 'Hôtel California - Système de Gestion'
    });
});

// (Gestion 404 commentée - non active)

// ⚠️ Anti-pattern : app.listen devrait être à la FIN du fichier
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// --- ENREGISTREMENT DES ROUTEURS ---
// Toute URL commençant par /chambres est aiguillée vers chambreRoutes
app.use('/chambres', chambreRoutes);
app.use('/clients', clientRoutes);

// ⚠️ Import au milieu du code (devrait être en haut avec les autres)
import reservationRoutes from './routes/reservations.js';

app.use('/reservations', reservationRoutes);
