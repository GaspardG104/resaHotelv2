// ============================================================
// ROUTES NETTOYAGE
// ============================================================

import express from 'express';
import NettoyageController from '../controllers/nettoyageController.js';

const router = express.Router();

// GET /nettoyage → liste des chambres à nettoyer aujourd'hui
router.get('/', NettoyageController.index);

export default router;
