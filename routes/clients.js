import express from 'express';
import ClientController from '../controller/clientController.js';

const router = express.Router();

// Routes CRUD Client
router.get('/', ClientController.index);          // Liste clients
router.get('/create', ClientController.create);   // Formulaire ajout
router.post('/', ClientController.store);         // Ajouter client
router.get('/:id/edit', ClientController.edit);   // Formulaire édition
router.post('/:id/edit', ClientController.update);// Modifier client
router.post('/:id/delete', ClientController.destroy); // Supprimer client

export default router;
