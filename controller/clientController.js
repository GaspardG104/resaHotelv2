import Client from '../models/client.js';

class ClientController {
    // Liste des clients
    static async index(req, res) {
        try {
            const clients = await Client.findAll();
            res.render('clients/index', { title: 'Gestion des Clients', clients });
        } catch (error) {
            res.redirect('/');
        }
    }

    // Formulaire ajout
    static create(req, res) {
        res.render('clients/create', { title: 'Ajouter un Client', client: {}, errors: [] });
    }

    // Ajout d’un client
    static async store(req, res) {
        try {
            await Client.create(req.body);
            res.redirect('/clients');
        } catch (error) {
            res.render('clients/create', { title: 'Ajouter un Client', client: req.body, errors: [{ msg: error.message }] });
        }
    }

    // Formulaire édition
    static async edit(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) return res.redirect('/clients');

            res.render('clients/edit', { title: 'Modifier un Client', client, errors: [] });
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // Mise à jour d’un client
    static async update(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (client) {
                await client.update(req.body);
            }
            res.redirect('/clients');
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // Suppression d’un client
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
