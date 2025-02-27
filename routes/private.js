import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/listar-usuarios', async (req, res) => {

    try {
        const users = await prisma.user.findMany({
            omit: {senha: true}
        })
        res.status(200).json({mensagem: 'Usuarios listados', users})

    } catch (error) {
        res.status(500).json({mensagem: 'falha no servidor'})
    }
})

export default router
