import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({message: "Não está autenticado!"});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
        if(error) return res.status(403).json({message: "Token não é válido!"});
    });

    res.status(200).json({ message: "Você está autenticado!"});
}

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({message: "Não está autenticado!"});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
        if(error) return res.status(403).json({message: "Token não é válido!"});
        if (!payload.isAdmin) {
            return res.status(403).json({message: "Não autorizado!"});
        }
    });

    res.status(200).json({ message: "Você está autenticado!"});
}