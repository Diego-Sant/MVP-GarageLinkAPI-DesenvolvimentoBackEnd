import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

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

        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, {expiresIn: age});

        const {password:userPassword, ...userInfo} = user

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age
        }).status(200).json(userInfo);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao autenticar o usuário!"})
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Sucesso ao sair da conta!"});
}