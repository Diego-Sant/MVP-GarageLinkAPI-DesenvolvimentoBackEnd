import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username, 
                email, 
                password: hashedPassword
            }
        });

        console.log(newUser);

        res.status(201).json({message: "Usuário criado com sucesso!"});

    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Falha ao criar usuário!"})
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {username: username}
        })

        if (!user) return res.status(401).json({message: "Credenciais Inválidas!"});

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({message: "Credenciais Inválidas!"});
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao autenticar o usuário!"})
    }
}

export const logout = (req, res) => {
    
}