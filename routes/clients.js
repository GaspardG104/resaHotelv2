// ============================================================
// ROUTES CLIENTS - aiguille les URL /clients/* vers le controller
// ⚠️ Convention différente de chambres.js : ici /:id/edit (pas /edit/:id)
//    → incohérence à assumer si on me la fait remarquer
// ⚠️ Pas de page de confirmation pour la suppression (POST direct)
// ============================================================

import express from 'express';
import ClientController from '../controllers/clientController.js';

const router = express.Router();

// CRUD Client
router.get('/', ClientController.index);             // GET    /clients         → liste
router.get('/create', ClientController.create);      // GET    /clients/create  → formulaire vide
router.post('/', ClientController.store);            // POST   /clients         → créer
router.get('/:id/edit', ClientController.edit);      // GET    /clients/:id/edit→ formulaire pré-rempli
router.post('/:id/edit', ClientController.update);   // POST   /clients/:id/edit→ modifier
router.post('/:id/delete', ClientController.destroy);// POST   /clients/:id/delete→ supprimer (sans confirmation)

export default router;
