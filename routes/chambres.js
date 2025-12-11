// routes/chambres.js
import express from 'express';
import ChambreController from '../controllers/chambreController.js';

const router = express.Router();

// Afficher la liste des chambres
router.get('/', ChambreController.index);

// Afficher le formulaire de création d'une chambre
router.get('/create', ChambreController.create);

// Traiter la création d'une chambre
router.post('/', ChambreController.store);

// Afficher le formulaire d'édition d'une chambre
router.get('/edit/:id', ChambreController.edit);

// Traiter la mise à jour d'une chambre
router.post('/:id', ChambreController.update);

// Afficher la confirmation de suppression d'une chambre
router.get('/delete/:id', ChambreController.delete);

// Traiter la suppression d'une chambre
router.post('/delete/:id', ChambreController.destroy);

export default router;











