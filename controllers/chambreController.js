// ============================================================
// CONTROLLER CHAMBRE - la LOGIQUE MÉTIER pour les chambres
// Convention CRUD : index/create/store/edit/update/delete/destroy
//   (inspirée de Laravel)
// → "create" et "edit" et "delete" = AFFICHAGE (GET)
// → "store" et "update" et "destroy" = TRAITEMENT (POST)
// ============================================================

import Chambre from '../models/chambre.js';

class ChambreController {
    // GET /chambres → afficher la LISTE
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

    // GET /chambres/create → afficher le FORMULAIRE VIDE
    static create(req, res) {
        res.render('chambres/create', {
            title: 'Ajouter une Chambre',
            chambre: {},  // objet vide pour éviter les erreurs dans la vue
            errors: []
        });
    }

    // POST /chambres → TRAITER le formulaire et CRÉER en BDD
    static async store(req, res) {
        try {
            // === VALIDATION manuelle des données ===
            const errors = [];

            if (!req.body.numero || req.body.numero.trim() === '') {
                errors.push({ msg: 'Le numéro de chambre est requis' });
            } else if (isNaN(req.body.numero) || parseInt(req.body.numero) <= 0) {
                errors.push({ msg: 'Le numéro doit être un entier positif' });
            }

            if (!req.body.capacite || isNaN(req.body.capacite) || parseInt(req.body.capacite) <= 0) {
                errors.push({ msg: 'La capacité doit être un nombre positif' });
            }

            // === Si erreurs : on RE-RENDER le formulaire avec les valeurs déjà tapées ===
            if (errors.length > 0) {
                return res.render('chambres/create', {
                    title: 'Ajouter une Chambre',
                    chambre: req.body, // pour pré-remplir
                    errors: errors
                });
            }

            // === Création en BDD via le model ===
            await Chambre.create({
                numero: parseInt(req.body.numero), // req.body est toujours du texte → parseInt
                capacite: parseInt(req.body.capacite)
            });

            // PATTERN POST/REDIRECT/GET : on REDIRECT (pas render)
            // → évite que F5 renvoie le formulaire et crée 2 fois
            res.redirect('/chambres');
        } catch (error) {
            res.render('chambres/create', {
                title: 'Ajouter une Chambre',
                chambre: req.body,
                errors: [{ msg: error.message }]
            });
        }
    }

    // GET /chambres/edit/:id → afficher le FORMULAIRE PRÉ-REMPLI
    static async edit(req, res) {
        try {
            // req.params.id = valeur du :id dans l'URL
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres'); // chambre inexistante
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

    // POST /chambres/:id → TRAITER l'édition et MODIFIER en BDD
    static async update(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.redirect('/chambres');
            }

            // Même validation que dans store (à refactoriser dans une fonction commune → DRY)
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

            res.redirect('/chambres'); // pattern PRG
        } catch (error) {
            const chambre = await Chambre.findById(req.params.id);
            res.render('chambres/edit', {
                title: 'Modifier la Chambre',
                chambre: { ...chambre, ...req.body },
                errors: [{ msg: error.message }]
            });
        }
    }

    // GET /chambres/delete/:id → afficher la PAGE DE CONFIRMATION
    // (sécurité UX : éviter qu'on supprime par erreur)
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

    // POST /chambres/delete/:id → SUPPRIMER vraiment en BDD
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
            // ⚠️ req.session n'est pas configuré dans apps.js → ce message est perdu
            if (req.session) {
                req.session.messages = [{ type: 'error', text: error.message }];
            }
            res.redirect('/chambres');
        }
    }
}

export default ChambreController;