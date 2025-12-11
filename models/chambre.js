// models/chambre.js
import pool from './connexion.js';

class Chambre {
    constructor(data) {
        this.id = data.id;
        this.numero = data.numero;
        this.capacite = data.capacite;
    }

    // Récupérer toutes les chambres
    static async findAll() {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM chambres ORDER BY numero ASC'
            );
            return rows.map(row => new Chambre(row));
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des chambres: ${error.message}`);
        }
    }

    // Récupérer une chambre par son ID
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM chambres WHERE id = ?',
                [id]
            );
            return rows.length > 0 ? new Chambre(rows[0]) : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la chambre: ${error.message}`);
        }
    }

    // Créer une nouvelle chambre
    static async create(data) {
        try {
            // Vérifier si le numéro existe déjà
            const [existing] = await pool.query(
                'SELECT id FROM chambres WHERE numero = ?',
                [data.numero]
            );

            if (existing.length > 0) {
                throw new Error('Ce numéro de chambre existe déjà');
            }

            const [result] = await pool.query(
                'INSERT INTO chambres (numero, capacite) VALUES (?, ?)',
                [data.numero, data.capacite]
            );

            return result.insertId;
        } catch (error) {
            throw new Error(`Erreur lors de la création de la chambre: ${error.message}`);
        }
    }

    // Mettre à jour une chambre
    static async update(id, data) {
        try {
            // Vérifier si le numéro existe déjà pour une autre chambre
            const [existing] = await pool.query(
                'SELECT id FROM chambres WHERE numero = ? AND id != ?',
                [data.numero, id]
            );

            if (existing.length > 0) {
                throw new Error('Ce numéro de chambre est déjà utilisé par une autre chambre');
            }

            const [result] = await pool.query(
                'UPDATE chambres SET numero = ?, capacite = ? WHERE id = ?',
                [data.numero, data.capacite, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la chambre: ${error.message}`);
        }
    }

    // Supprimer une chambre
    static async delete(id) {
        try {
            // Vérifier s'il existe des réservations pour cette chambre
            const [reservations] = await pool.query(
                'SELECT COUNT(*) as count FROM reservations WHERE chambre_id = ?',
                [id]
            );

            if (reservations[0].count > 0) {
                throw new Error('Impossible de supprimer cette chambre car elle a des réservations associées');
            }

            const [result] = await pool.query(
                'DELETE FROM chambres WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la chambre: ${error.message}`);
        }
    }

    // Récupérer le nombre total de chambres
    static async count() {
        try {
            const [rows] = await pool.query('SELECT COUNT(*) as total FROM chambres');
            return rows[0].total;
        } catch (error) {
            throw new Error(`Erreur lors du comptage des chambres: ${error.message}`);
        }
    }
    // Vérifier la disponibilité d'une chambre
    static async isAvailable(chambreId, dateArrivee, dateDepart) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(*) as count
                FROM reservations
                WHERE chambre_id = ?
                AND (
                    (date_arrivee <= ? AND date_depart > ?) OR
                    (date_arrivee < ? AND date_depart >= ?) OR
                    (date_arrivee >= ? AND date_depart <= ?)
                )
            `, [chambreId, dateArrivee, dateArrivee, dateDepart, dateDepart, dateArrivee, dateDepart]);

            return rows[0].count === 0;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de disponibilité: ' + error.message);
        }
    }
}

export default Chambre;