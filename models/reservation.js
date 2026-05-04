// ============================================================
// MODEL RESERVATION - parle à la BDD pour les réservations
// → C'est ici que se trouve la logique de DISPONIBILITÉ (isAvailable)
// → Les requêtes utilisent des INNER JOIN pour récupérer
//   le nom du client et le numéro de la chambre en même temps
// ============================================================

import pool from './connexion.js';

class Reservation {
    constructor(data) {
        this.id = data.id;
        this.client_id = data.client_id;     // CLÉ ÉTRANGÈRE → clients.id
        this.chambre_id = data.chambre_id;   // CLÉ ÉTRANGÈRE → chambres.id
        this.date_arrivee = data.date_arrivee;
        this.date_depart = data.date_depart;
        // Champs joints depuis clients/chambres (via INNER JOIN)
        this.client_nom = data.client_nom;
        this.chambre_numero = data.chambre_numero;
        this.chambre_capacite = data.chambre_capacite;
    }

    // READ - toutes les réservations
    // INNER JOIN pour récupérer en une seule requête : nom du client + numéro de chambre
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

    // READ - une réservation par id (avec ses infos client/chambre)
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

    // CHEVAUCHEMENT DE PÉRIODES
    // Détecte s'il y a déjà une réservation qui chevauche la période demandée
    //   date_arrivee_existante < dateDepart_nouvelle  (a commencé avant que la nouvelle parte)
    //   AND date_depart_existante > dateArrivee_nouvelle  (finit après que la nouvelle arrive)
    // → Si compteur de conflits = 0, la chambre est libre
    // excludeId : pour ignorer la réservation en cours d'édition
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

    // CREATE - vérifie la dispo, puis INSERT
    // ⚠️ RACE CONDITION possible entre isAvailable et INSERT
    //    (correctif : transaction SQL ou contrainte UNIQUE composite)
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

    // UPDATE - même logique que create mais avec excludeId pour s'ignorer soi-même
    static async update(id, data) {
        try {
            const dispo = await Reservation.isAvailable(
                data.chambre_id,
                data.date_arrivee,
                data.date_depart,
                id // exclure cette réservation pour qu'elle ne soit pas en conflit avec elle-même
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

    // DELETE - simple suppression
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
