// controllers/chambreControllers.js
import Chambre from '../models/chambre.js';

class ChambreController {
    // Afficher la liste des chambres
    static async index(req, res) {
        try {
            const chambres = await Chambre.findAll();
            res.render('chambres/index', {
                title: 'Gestion des Chambres',
                chambres: chambres
            });
        } catch (error) {
            console.error('Erreur index:', error);
            res.redirect('/');
        }
    }

    // Afficher le formulaire de création
    static create(req, res) {
        res.render('chambres/create', {
            title: 'Ajouter une Chambre',
            chambre: {},
            errors: []
        });
    }

    // Traiter la création d'une chambre
    static async store(req, res) {
        try {
            // Validation manuelle des données
            const errors = [];

            // Vérification du numéro
            if (!req.body.numero || req.body.numero.trim() === '') {
                errors.push({ msg: 'Le numéro de chambre est requis' });
            } else if (isNaN(req.body.numero) || parseInt(req.body.numero) <= 0) {
                errors.push({ msg: 'Le numéro doit être un entier positif' });
            }

            // Vérification de la capacité
            if (!req.body.capacite || isNaN(req.body.capacite) || parseInt(req.body.capacite) <= 0) {
                errors.push({ msg: 'La capacité doit être un nombre positif' });
            }

            // Si des erreurs existent, retourner à la vue avec les erreurs
            if (errors.length > 0) {
                return res.render('chambres/create', {
                    title: 'Ajouter une Chambre',
                    chambre: req.body,
                    errors: errors
                });
            }

            await Chambre.create({
                numero: parseInt(req.body.numero),
                capacite: parseInt(req.body.capacite)
            });

            res.redirect('/chambres');
        } catch (error) {
            res.render('chambres/create', {
                title: 'Ajouter une Chambre',
                chambre: req.body,
                errors: [{ msg: error.message }]
            });
        }
    }

    // Afficher le formulaire d'édition
    static async edit(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres');
            }
            res.render('chambres/edit', {
                title: 'Modifier la Chambre',
                chambre: chambre,
                errors: []
            });
        } catch (error) {
            console.error('Erreur edit:', error);
            res.redirect('/chambres');
        }
    }

    // Traiter la mise à jour d'une chambre
    static async update(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres');
            }

            // Validation
            const errors = [];
            if (!req.body.numero || isNaN(req.body.numero) || parseInt(req.body.numero) <= 0) {
                errors.push({ msg: 'Le numéro doit être un entier positif' });
            }
            if (!req.body.capacite || isNaN(req.body.capacite) || parseInt(req.body.capacite) <= 0) {
                errors.push({ msg: 'La capacité doit être un nombre positif' });
            }

            if (errors.length > 0) {
                return res.render('chambres/edit', {
                    title: 'Modifier la Chambre',
                    chambre: { ...chambre, ...req.body },
                    errors: errors
                });
            }

            await Chambre.update(req.params.id, {
                numero: parseInt(req.body.numero),
                capacite: parseInt(req.body.capacite)
            });

            res.redirect('/chambres');
        } catch (error) {
            const chambre = await Chambre.findById(req.params.id);
            res.render('chambres/edit', {
                title: 'Modifier la Chambre',
                chambre: { ...chambre, ...req.body },
                errors: [{ msg: error.message }]
            });
        }
    }

    // Afficher la confirmation de suppression
    static async delete(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres');
            }
            res.render('chambres/delete', {
                title: 'Supprimer la Chambre',
                chambre: chambre
            });
        } catch (error) {
            console.error('Erreur delete view:', error);
            res.redirect('/chambres');
        }
    }

    // Traiter la suppression d'une chambre
    static async destroy(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres');
            }

            await Chambre.delete(req.params.id);
            res.redirect('/chambres');
        } catch (error) {
            console.error('Erreur destroy:', error);
            if (req.session) {
                req.session.messages = [{ type: 'error', text: error.message }];
            }
            res.redirect('/chambres');
        }
    }
}

export default ChambreController;