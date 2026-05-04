// ============================================================
// ROUTES CHAMBRES - aiguille les URL /chambres/* vers le controller
// → Que GET et POST (les formulaires HTML ne supportent pas PUT/DELETE)
// → :id = paramètre dynamique (récupéré via req.params.id)
// ============================================================

import express from 'express';
import ChambreController from '../controllers/chambreController.js';

const router = express.Router(); // mini-Express dédié aux chambres

// GET /chambres → liste
router.get('/', ChambreController.index);

// GET /chambres/create → formulaire vide
router.get('/create', ChambreController.create);

// POST /chambres → traitement de la création
router.post('/', ChambreController.store);

// GET /chambres/edit/:id → formulaire pré-rempli
router.get('/edit/:id', ChambreController.edit);

// POST /chambres/:id → traitement de la modification
router.post('/:id', ChambreController.update);

// GET /chambres/delete/:id → page de confirmation
router.get('/delete/:id', ChambreController.delete);

// POST /chambres/delete/:id → suppression réelle
router.post('/delete/:id', ChambreController.destroy);

export default router;











