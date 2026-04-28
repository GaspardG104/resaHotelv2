// routes/reservations.js
import express from 'express';
import ReservationController from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', ReservationController.index);
router.get('/create', ReservationController.create);
router.post('/', ReservationController.store);
router.get('/edit/:id', ReservationController.edit);
router.post('/:id', ReservationController.update);
router.get('/delete/:id', ReservationController.delete);
router.post('/delete/:id', ReservationController.destroy);

export default router;