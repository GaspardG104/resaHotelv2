import { describe, it, expect, vi } from 'vitest';
import ChambreController from '../controllers/chambreController.js';
import ChambreModels from '../models/chambre.js';

describe("tests sur les chambres du crud", () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            render: vi.fn(),
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });
    describe("tests sur la partie création de chambres"),() => {
        describe("tests sur create(data)"),() => {
            it('doit créer une chambre avec un titre vide pour vérifié si le site bloque bien la création', () => {
                const data = {
                    numero: '',
                    capacite: 1
                }

                //expect(ChambreModels.create(data)).not.toBe()
                expect(ChambreModels.create(data)).rejects.toBeTruthy()
            })

            it('chambre doit ajouter une nouvelle chambre et répondre avec 333', () => {
                // 1. On prépare une requête simulée avec un corps valide
                const data = {
                    numero: '333',
                    capacite: 5
            
                }

                expect(ChambreModels.create(data)).toBe()

            })
        };
    };
/*
    it('verifier que la chambre 333 existe', () => {
            const data = {
            numero: '333',
            capacite: 3
    
        }

        expect(ChambreModels.index(data)).not.toBe(0)

    })

    // on verife que la chambre a bien été modifiée
    it('verifie la modification du numéro et de la capacité de la chambre 333 -> 666', () => {
            const data = {
            numero: '666',
            capacite: 6
        }

        expect(ChambreModels.index(data)).not.toBe(0)



    })
 */

        it('chambre doit supprimer la nouvelle chambre et répondre avec 333', () => {
            ChambreModels.delete(data);
            
            expect(ChambreModels.index('333')).toBeNull()

        })

})