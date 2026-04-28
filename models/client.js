import db from './connexion.js';

class Client {
    constructor(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
        this.telephone = data.telephone;
    }

    // Récupérer tous les clients
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom');
            return rows.map(row => new Client(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des clients: ' + error.message);
        }
    }

    // Récupérer un client par ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du client: ' + error.message);
        }
    }

    // Créer un client
    static async create(clientData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO clients (nom, prenom, email, telephone) VALUES (?, ?, ?, ?)',
                [clientData.nom, clientData.prenom, clientData.email, clientData.telephone]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    // Modifier un client
    async update(clientData) {
        try {
            await db.execute(
                'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?',
                [clientData.nom, clientData.prenom, clientData.email, clientData.telephone,this.id]
            );
            this.nom = clientData.nom;
            this.prenom = clientData.prenom;
            this.email = clientData.email;
            this.telephone = clientData.telephone;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    // Supprimer un client
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
