import { PrismaClient } from '@prisma/client'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

// esse jwt significa json web token, eu salvei no arquivo .ENV um código
// pois ele aumenta o nível de segurança do token! Veja lá!
const JWT_SECRET = process.env.JWT_SECRET

router.post('/cadastro', async (req, res) => {
    
    try {
        const user = req.body

        const salt = await bcrypt.genSalt(10)
        const hashSenha = await bcrypt.hash(user.senha, salt)
    
        const userDB = await prisma.user.create({
            data: {
                nome: user.nome,
                senha: hashSenha,
                email: user.email
            }
        })
        res.status(201).json(userDB)
    } catch (error) {
        res.status(500)
    }
})

router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body

        //busca o user no db a partir do email unico
        const user = await prisma.user.findUnique({
            where: { email: userInfo.email }
        });

        // se nao encontrar o user retorna o erro
        if(!user) {
            return res.status(404).json({messagem: 'não encontrou o usuario'})
        }

        // ao encontrar o user, checa se a senha é a mesma do db
        const isMatch = await bcrypt.compare(userInfo.senha, user.senha)

        //retorna erro na senha
        if(!isMatch) {
            return res.status(400).json({mensagem: 'senha errada'})
        }

        // gerar token para liberar o acesso do user nas rotas especificas do software
        const token = jwt.sign(
            {
                id: user.id
            },
            JWT_SECRET,
            {
                expiresIn: '1d',
                algorithm: 'HS512'
            }
        )
        console.log("Token gerado:", token);
        res.status(200).json({token})
    }catch(error) {
        res.status(500).json({erro: error})
    }

})

export default router