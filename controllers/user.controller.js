import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";


export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao acessar usuários!"})
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await prisma.user.findUnique({
            where: {id: id}
        });
        res.status(200).json(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao acessar usuário!"})
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password, avatar, ...inputs} = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({message: "Não autorizado!"})
    }

    let updatedPassword = null;
    try {
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: {id: id},
            data: {
                ...inputs,
                ...(updatedPassword && {password: updatedPassword}),
                ...(avatar && {avatar: avatar}),
            }
        });

        const {password: userPassword, ...rest} = updatedUser;

        res.status(200).json(rest);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao atualizar usuário!"})
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({message: "Não autorizado!"})
    }

    try {
        await prisma.user.delete({
            where: {id: id}
        });

        res.status(200).json({message: "Usuário excluído com sucesso!"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao excluir usuário!"})
    }
}