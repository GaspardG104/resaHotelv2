// ============================================================
// ROUTES RESERVATIONS - aiguille les URL /reservations/* vers le controller
// → Mêmes 7 routes que pour les chambres (CRUD complet avec confirmation)
// ============================================================

import express from 'express';
import ReservationController from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', ReservationController.index);              // liste
router.get('/create', ReservationController.create);       // formulaire vide
router.post('/', ReservationController.store);             // créer
router.get('/edit/:id', ReservationController.edit);       // formulaire pré-rempli
router.post('/:id', ReservationController.update);         // modifier
router.get('/delete/:id', ReservationController.delete);   // page de confirmation
router.post('/delete/:id', ReservationController.destroy); // suppression réelle

export default router;