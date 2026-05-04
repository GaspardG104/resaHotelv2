// ============================================================
// CONTROLLER RESERVATION - le plus complexe (gère dates + relations)
// → Importe 3 models : Reservation, Client, Chambre (pour les <select>)
// → Utilise Promise.all pour charger clients + chambres EN PARALLÈLE
// → Validation factorisée dans une fonction validate() (principe DRY)
// ============================================================

import Reservation from '../models/reservation.js';
import Client from '../models/client.js';
import Chambre from '../models/chambre.js';

// Formate une date pour les <input type="date"> (qui attend YYYY-MM-DD)
function toInputDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// VALIDATION factorisée (DRY = Don't Repeat Yourself)
// → Utilisée dans store ET update : un seul endroit à modifier en cas de changement
function validate(body) {
    const errors = [];

    if (!body.client_id || isNaN(body.client_id) || parseInt(body.client_id) <= 0) {
        errors.push({ msg: 'Le client est requis' });
    }
    if (!body.chambre_id || isNaN(body.chambre_id) || parseInt(body.chambre_id) <= 0) {
        errors.push({ msg: 'La chambre est requise' });
    }
    if (!body.date_arrivee) {
        errors.push({ msg: 'La date d\'arrivée est requise' });
    }
    if (!body.date_depart) {
        errors.push({ msg: 'La date de départ est requise' });
    }
    if (body.date_arrivee && body.date_depart && body.date_depart <= body.date_arrivee) {
        errors.push({ msg: 'La date de départ doit être après la date d\'arrivée' });
    }

    return errors;
}

class ReservationController {
    // GET /reservations → LISTE des réservations
    static async index(req, res) {
        try {
            const reservations = await Reservation.findAll();
            res.render('reservations/index', {
                title: 'Gestion des Réservations',
                reservations,
                toInputDate
            });
        } catch (error) {
            console.error('Erreur index réservations:', error);
            res.redirect('/');
        }
    }

    // GET /reservations/create → FORMULAIRE VIDE
    // On a besoin de la liste des clients + chambres pour les <select>
    // Promise.all = exécute les 2 requêtes EN PARALLÈLE (plus rapide qu'en séquentiel)
    static async create(req, res) {
        try {
            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            res.render('reservations/create', {
                title: 'Ajouter une Réservation',
                reservation: {},
                clients,
                chambres,
                errors: [],
                toInputDate
            });
        } catch (error) {
            console.error('Erreur create form:', error);
            res.redirect('/reservations');
        }
    }

    // POST /reservations → CRÉER en BDD
    static async store(req, res) {
        const errors = validate(req.body); // appel de la fonction factorisée

        if (errors.length > 0) {
            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            return res.render('reservations/create', {
                title: 'Ajouter une Réservation',
                reservation: req.body,
                clients,
                chambres,
                errors,
                toInputDate
            });
        }

        try {
            await Reservation.create({
                client_id: parseInt(req.body.client_id),
                chambre_id: parseInt(req.body.chambre_id),
                date_arrivee: req.body.date_arrivee,
                date_depart: req.body.date_depart
            });
            res.redirect('/reservations');
        } catch (error) {
            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            res.render('reservations/create', {
                title: 'Ajouter une Réservation',
                reservation: req.body,
                clients,
                chambres,
                errors: [{ msg: error.message }],
                toInputDate
            });
        }
    }

    // Formulaire d'édition
    static async edit(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) return res.redirect('/reservations');

            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            res.render('reservations/edit', {
                title: 'Modifier la Réservation',
                reservation,
                clients,
                chambres,
                errors: [],
                toInputDate
            });
        } catch (error) {
            console.error('Erreur edit:', error);
            res.redirect('/reservations');
        }
    }

    // Traitement de la mise à jour
    static async update(req, res) {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.redirect('/reservations');

        const errors = validate(req.body);

        if (errors.length > 0) {
            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            return res.render('reservations/edit', {
                title: 'Modifier la Réservation',
                reservation: { ...reservation, ...req.body },
                clients,
                chambres,
                errors,
                toInputDate
            });
        }

        try {
            await Reservation.update(req.params.id, {
                client_id: parseInt(req.body.client_id),
                chambre_id: parseInt(req.body.chambre_id),
                date_arrivee: req.body.date_arrivee,
                date_depart: req.body.date_depart
            });
            res.redirect('/reservations');
        } catch (error) {
            const [clients, chambres] = await Promise.all([
                Client.findAll(),
                Chambre.findAll()
            ]);
            res.render('reservations/edit', {
                title: 'Modifier la Réservation',
                reservation: { ...reservation, ...req.body },
                clients,
                chambres,
                errors: [{ msg: error.message }],
                toInputDate
            });
        }
    }

    // Confirmation de suppression
    static async delete(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) return res.redirect('/reservations');

            res.render('reservations/delete', {
                title: 'Supprimer la Réservation',
                reservation,
                toInputDate
            });
        } catch (error) {
            console.error('Erreur delete view:', error);
            res.redirect('/reservations');
        }
    }

    // Traitement de la suppression
    static async destroy(req, res) {
        try {
            await Reservation.delete(req.params.id);
            res.redirect('/reservations');
        } catch (error) {
            console.error('Erreur destroy:', error);
            res.redirect('/reservations');
        }
    }
}

export default ReservationController;