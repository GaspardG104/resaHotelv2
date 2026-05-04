// ============================================================
// MODEL CLIENT - parle à la BDD pour les clients
// → Utilise les MÉTHODES D'INSTANCE (client.update) pour update/delete
//   (différent de Chambre qui utilise des méthodes statiques)
// ⚠️ INCOHÉRENCE : ce model utilise prenom/email
//   mais la table SQL contient nom/email/telephone/nombre_personnes
//   (champs prenom inexistant en BDD, telephone/nombre_personnes ignorés)
// ============================================================

import db from './connexion.js'; // db = le pool (juste un nom différent)

class Client {
    constructor(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
    }

    // READ - tous les clients
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom');
            return rows.map(row => new Client(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des clients: ' + error.message);
        }
    }

    // READ - un client par id (renvoie null si non trouvé)
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du client: ' + error.message);
        }
    }

    // CREATE - INSERT en BDD
    static async create(clientData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO clients (nom, prenom, email) VALUES (?, ?, ?)',
                [clientData.nom, clientData.prenom, clientData.email]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    // UPDATE - méthode d'instance (s'appelle sur un objet client)
    async update(clientData) {
        try {
            await db.execute(
                'UPDATE clients SET nom = ?, prenom = ?, email = ? WHERE id = ?',
                [clientData.nom, clientData.prenom, clientData.email, this.id]
            );
            this.nom = clientData.nom;
            this.prenom = clientData.prenom;
            this.email = clientData.email;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    // DELETE - méthode d'instance
    // ⚠️ Pas de vérification : si le client a des réservations,
    //    elles sont supprimées automatiquement par le ON DELETE CASCADE
    async delete() {
        try {
            await db.execute('DELETE FROM clients WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }
}

export default Client;
