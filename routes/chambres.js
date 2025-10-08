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
router.get('/:id/edit', ChambreController.edit);

// Traiter la mise à jour d'une chambre
router.post('/:id', ChambreController.update);

// Afficher la confirmation de suppression d'une chambre
router.get('/:id/delete', ChambreController.delete);

// Traiter la suppression d'une chambre
router.post('/:id/delete', ChambreController.destroy);

export default router;
