import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const query = req.query;



    try {

        const posts = await prisma.post.findMany({
            where: {
                city: {
                    contains: query.cidade || undefined,
                    mode: 'insensitive'
                },
                buyOrRent: query.disponibilidade || undefined,
                brand: query.marca || undefined,
                condition: query.condicao || undefined,
                transmission: query.transmissao || undefined,
                color: query.cor || undefined,
                ...(query.disponibilidade === 'Comprar' && {
                    priceToBuy: {
                        gte: parseInt(query.minPrice) || 0,
                        lte: parseInt(query.maxPrice) || 10000000
                    }
                }),
                ...(query.disponibilidade === 'Alugar' && {
                    priceToRent: {
                        gte: parseInt(query.minPrice) || 0,
                        lte: parseInt(query.maxPrice) || 10000000
                    }
                })
            }
        })

        res.status(200).json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao buscar carros!"})
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id;
    
    try {
        const post = await prisma.post.findUnique({
            where: {id: id},
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatarURL: true
                    }
                },
            }
        });

        res.status(200).json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao buscar carro!"})
    }
}

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                },
            }
        })

        res.status(200).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao adicionar carro!"})
    }
}

export const updatePost = async (req, res) => {
    try {
        res.status(200).json();

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao editar carro!"})
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    
    try {
        const post = await prisma.post.findUnique({
            where: {id: id},
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({message: "Não autorizado!"})
        }

        await prisma.post.delete({
            where: {id: id},
        })

        res.status(200).json({message: "Publicação deletada!"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao deletar carro!"})
    }
}