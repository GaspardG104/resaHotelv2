// ============================================================
// CONTROLLER NETTOYAGE
// → Affiche les chambres occupées AUJOURD'HUI qui ont demandé le grand ménage
// ============================================================

import Reservation from '../models/reservation.js';

class NettoyageController {
    // GET /nettoyage → liste pour le service nettoyage
    static async index(req, res) {
        try {
            const reservations = await Reservation.findGrandMenageEnCours();
            res.render('nettoyage/index', {
                title: 'Service Nettoyage - Grand Ménage',
                reservations
            });
        } catch (error) {
            console.error('Erreur nettoyage:', error);
            res.redirect('/');
        }
    }
}

export default NettoyageController;
