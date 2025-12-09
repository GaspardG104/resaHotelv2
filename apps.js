//index.js ce machin permet de lancer l'app en nodemon
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import chambreRoutes from './routes/chambres.js';
import clientsRoutes from './routes/clients.js';


const app = express();
// Routes

const PORT = process.env.PORT || 3000;
// Récupérer le chemin local (file://...) et le répertoire courant (workspace/resaHotelCalifornia2)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Dossier public pour les fichiers statiques (CSS, JS, images)
app.use(express.static('public'));

// Middleware (ajout de la route /public, gestion JSON et URLencoded)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration du middleware avec exclusion
app.use('/semantic-ui', express.static(
    path.join(__dirname, 'node_modules', 'semantic-ui-css'),
    { fallthrough: true }
));

// Route principale
app.get('/', (req, res) => {
    res.render('accueil/accueil', {
        title: 'Hôtel California - Système de Gestion'
    });
});


// Gestion des erreurs 404
// app.use((req, res) => {
//     res.status(404).render('error', {
//         title: 'Page non trouvée',
//         error: 'La page demandée n\'existe pas.'
//     });
// });

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

import clientRoutes from './routes/clients.js';


app.use('/chambres', chambreRoutes);
app.use('/clients', clientRoutes);


