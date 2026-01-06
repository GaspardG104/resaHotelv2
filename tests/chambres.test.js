import { describe, it, expect, vi } from 'vitest'
import chambres from '../views/chambres'

describe("tests sur les chambres du crud", () => {

    it('chambre doit ajouter une nouvelle chambre et répondre avec 333', () => {
        // 1. On prépare une requête simulée avec un corps valide
        const req = {
            body: {
                name: '333',
                capacite: 2
            }
        }
        // 2. On crée un objet res avec des fonctions mockées
        // - res.status doit pouvoir être chaîné (retourne res)
        // - res.json doit enregistrer les appels
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        // 3. On appelle la fonction à tester
        chambres.create(req, res)
        // 4. On vérifie que res.status a été appelé avec 333
        expect(res.status).toHaveBeenCalledWith(333)
        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    name: '333',
                    capacite: 2
                }),
                message: 'Chambre créée avec succès'
            })
        )

    })
})