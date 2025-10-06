import express from 'express';
import chambreController from '..\controllers\chambreController.js';

const router = express.Router();

//pour afficher toutes les chambres
router.get('/', chambreController.findAll);
//pour afficher une chambre en particulier
router.get('/:id/', chambreController.getOne);


//pour afficher la cration de chambre
router.get('/', chambreController.Create);
//pour créer une chambre en particulier
router.post('/:id/create/', chambreController.CreateChambre);


//pour afficher l'edit des chambres
router.get('/', chambreController.Update);
//pour éditer une chambre en particulier
router.post('/:id/edit/', chambreController.UpdateChambre);


//pour afficher la suppresion des chambres
router.get('/delete/', chambreController.Delete);
//pour la suppression d'une chambre en particulier
router.post('/:id/delete/', chambreController.DeleteChambre);



export default router;