// ============================================================
// CONTROLLER CLIENT - logique métier pour les clients
// ⚠️ Moins robuste que ChambreController :
//   - Pas de validation manuelle des données
//   - Erreurs souvent silencieuses (juste un redirect)
// ============================================================

import Client from '../models/client.js';

class ClientController {
    // GET /clients → afficher la LISTE
    static async index(req, res) {
        try {
            const clients = await Client.findAll();
            res.render('clients/index', { title: 'Gestion des Clients', clients });
        } catch (error) {
            res.redirect('/');
        }
    }

    // GET /clients/create → FORMULAIRE VIDE
    static create(req, res) {
        res.render('clients/create', { title: 'Ajouter un Client', client: {}, errors: [] });
    }

    // POST /clients → CRÉER en BDD
    // ⚠️ Pas de validation : on envoie req.body brut au model
    static async store(req, res) {
        try {
            await Client.create(req.body);
            res.redirect('/clients'); // pattern PRG
        } catch (error) {
            res.render('clients/create', { title: 'Ajouter un Client', client: req.body, errors: [{ msg: error.message }] });
        }
    }

    // GET /clients/:id/edit → FORMULAIRE PRÉ-REMPLI
    static async edit(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) return res.redirect('/clients');

            res.render('clients/edit', { title: 'Modifier un Client', client, errors: [] });
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // POST /clients/:id/edit → MODIFIER en BDD
    // → Utilise une MÉTHODE D'INSTANCE (client.update) car Client est codé ainsi
    static async update(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (client) {
                await client.update(req.body);
            }
            res.redirect('/clients');
        } catch (error) {
            res.redirect('/clients'); // erreur silencieuse (à améliorer)
        }
    }

    // POST /clients/:id/delete → SUPPRIMER en BDD
    // ⚠️ Pas de page de confirmation (différent du flow Chambre)
    // → ON DELETE CASCADE supprime aussi toutes ses réservations
    static async destroy(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (client) {
                await client.delete();
            }
            res.redirect('/clients');
        } catch (error) {
            res.redirect('/clients');
        }
    }
}

export default ClientController;
