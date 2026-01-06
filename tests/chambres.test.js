import { describe, it, expect, vi } from 'vitest'
import ChambreModels from '../models/chambre.js'

describe("tests sur les chambres du crud", () => {

    it('chambre doit ajouter une nouvelle chambre et répondre avec 333', () => {
        // 1. On prépare une requête simulée avec un corps valide
        const data = {
            numero: '333',
            capacite: 5
    
        }

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(ChambreModels.create(data)).not.toBe(0)

    })

    it('verifier que la chambre 333 existe', () => {
                const data = {
            numero: '333',
            capacite: 5
    
        }

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(ChambreModels.create(data)).toThrow()

    })

    it('verifie la capacité de la chambre 333', () => {



    })


})