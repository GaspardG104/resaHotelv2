// models/reservation.js
import pool from './connexion.js';

class Reservation {
    constructor(data) {
        this.id = data.id;
        this.client_id = data.client_id;
        this.chambre_id = data.chambre_id;
        this.date_arrivee = data.date_arrivee;
        this.date_depart = data.date_depart;
        // Champs joints (peuvent être undefined si pas de JOIN)
        this.client_nom = data.client_nom;
        this.chambre_numero = data.chambre_numero;
        this.chambre_capacite = data.chambre_capacite;
    }

    // Récupérer toutes les réservations avec infos client et chambre
    static async findAll() {
        try {
            const [rows] = await pool.query(`
                SELECT
                    r.id,
                    r.client_id,
                    r.chambre_id,
                    r.date_arrivee,
                    r.date_depart,
                    c.nom AS client_nom,
                    ch.numero AS chambre_numero,
                    ch.capacite AS chambre_capacite
                FROM reservations r
                INNER JOIN clients c   ON r.client_id  = c.id
                INNER JOIN chambres ch ON r.chambre_id = ch.id
                ORDER BY r.date_arrivee DESC
            `);
            return rows.map(row => new Reservation(row));
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des réservations: ${error.message}`);
        }
    }

    // Récupérer une réservation par son ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT
                    r.id,
                    r.client_id,
                    r.chambre_id,
                    r.date_arrivee,
                    r.date_depart,
                    c.nom AS client_nom,
                    ch.numero AS chambre_numero,
                    ch.capacite AS chambre_capacite
                FROM reservations r
                INNER JOIN clients c   ON r.client_id  = c.id
                INNER JOIN chambres ch ON r.chambre_id = ch.id
                WHERE r.id = ?
            `, [id]);
            return rows.length > 0 ? new Reservation(rows[0]) : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la réservation: ${error.message}`);
        }
    }

    // Vérifier la disponibilité d'une chambre sur une période
    // (excludeId permet d'ignorer la réservation en cours d'édition)
    static async isAvailable(chambreId, dateArrivee, dateDepart, excludeId = null) {
        try {
            let sql = `
                SELECT COUNT(*) AS conflits
                FROM reservations
                WHERE chambre_id = ?
                  AND date_arrivee < ?
                  AND date_depart  > ?
            `;
            const params = [chambreId, dateDepart, dateArrivee];

            if (excludeId) {
                sql += ' AND id != ?';
                params.push(excludeId);
            }

            const [rows] = await pool.query(sql, params);
            return rows[0].conflits === 0;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification de disponibilité: ${error.message}`);
        }
    }

    // Créer une nouvelle réservation
    static async create(data) {
        try {
            const dispo = await Reservation.isAvailable(
                data.chambre_id,
                data.date_arrivee,
                data.date_depart
            );
            if (!dispo) {
                throw new Error('Cette chambre est déjà réservée sur la période sélectionnée');
            }

            const [result] = await pool.query(
                `INSERT INTO reservations (client_id, chambre_id, date_arrivee, date_depart)
                 VALUES (?, ?, ?, ?)`,
                [data.client_id, data.chambre_id, data.date_arrivee, data.date_depart]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Erreur lors de la création de la réservation: ${error.message}`);
        }
    }

    // Mettre à jour une réservation
    static async update(id, data) {
        try {
            const dispo = await Reservation.isAvailable(
                data.chambre_id,
                data.date_arrivee,
                data.date_depart,
                id
            );
            if (!dispo) {
                throw new Error('Cette chambre est déjà réservée sur la période sélectionnée');
            }

            const [result] = await pool.query(
                `UPDATE reservations
                 SET client_id = ?, chambre_id = ?, date_arrivee = ?, date_depart = ?
                 WHERE id = ?`,
                [data.client_id, data.chambre_id, data.date_arrivee, data.date_depart, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la réservation: ${error.message}`);
        }
    }

    // Supprimer une réservation
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM reservations WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la réservation: ${error.message}`);
        }
    }

    // Compter le nombre total de réservations
    static async count() {
        try {
            const [rows] = await pool.query('SELECT COUNT(*) AS total FROM reservations');
            return rows[0].total;
        } catch (error) {
            throw new Error(`Erreur lors du comptage des réservations: ${error.message}`);
        }
    }
}

export default Reservation;
