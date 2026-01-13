import { describe, it, expect, vi } from 'vitest'
import ChambreModels from '../models/chambre.js'

describe("tests sur les chambres du crud", () => {

    it('doit crrer une chambre avec un titre vide pour vérifié si le site bloque', () => {
        const data = {
            numero: '',
            capacite: 1
        }

        expect(ChambreModels.create(data)).not.toBe()
    })

    it('chambre doit ajouter une nouvelle chambre et répondre avec 333', () => {
        // 1. On prépare une requête simulée avec un corps valide
        const data = {
            numero: '333',
            capacite: 5
    
        }

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(ChambreModels.create(data)).not.toBe(0)

    })
/*
    it('verifier que la chambre 333 existe', () => {
            const data = {
            numero: '333',
            capacite: 5
    
        }

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(ChambreModels.index(data)).not.toBe(0)

    })

    // on verife que la chambre a bien été modifiée
    it('verifie la modification du numéro et de la capacité de la chambre 333', () => {
            const data = {
            numero: '333',
            capacite: 5
        }

        expect(ChambreModels.index(data)).not.toBe(0)



    })
 */

    it('chambre doit supprimer la nouvelle chambre et répondre avec 333', () => {
        // 1. On prépare une requête simulée avec un corps valide
        const data = {
            numero: '333',
            capacite: 5
    
        }

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(ChambreModels.delete(data)).not.toBe(0)

    })


})