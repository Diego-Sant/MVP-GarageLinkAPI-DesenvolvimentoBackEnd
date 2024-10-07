import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token recebido:", token);

    if (!token) {
        console.log("Token não encontrado");
        return res.status(401).json({message: "Não está autenticado!"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
        if (error) {
            console.log("Erro ao verificar token:", error);
            return res.status(403).json({message: "Token não é válido!"});
        }
        req.userId = payload.id;
        next();
    });
}