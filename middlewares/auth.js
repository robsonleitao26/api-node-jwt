import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {

    const token = req.headers.authorization

    // Verifica se o token começa com "Bearer " antes de tentar remover
    const tokenNovo = token.replace('Bearer ', '')

    if(!token) {
        return res.status(401).json({mensagem: 'acesso negado'})
    }

    try {
        const decoded = jwt.verify(tokenNovo, JWT_SECRET)
        console.log(decoded)
        req.user = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido'});
    }
}

export default auth