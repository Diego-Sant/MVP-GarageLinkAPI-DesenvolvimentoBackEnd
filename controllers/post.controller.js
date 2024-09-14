import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    const query = req.query;

    try {

        const posts = await prisma.post.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                city: {
                                    contains: query.cidade || undefined,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                noAccentCity: {
                                    contains: query.cidade || undefined,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    },
                    {
                        buyOrRent: query.disponibilidade || undefined,
                        brand: query.marca || undefined,
                        condition: query.condicao || undefined,
                        transmission: query.transmissao || undefined,
                        color: query.cor || undefined,
                        ...(query.disponibilidade === 'Comprar' && {
                            priceToBuy: {
                                gte: parseInt(query.precoMin) || 0,
                                lte: parseInt(query.precoMax) || 10000000
                            }
                        }),
                        ...(query.disponibilidade === 'Alugar' && {
                            priceToRent: {
                                gte: parseInt(query.precoMin) || 0,
                                lte: parseInt(query.precoMax) || 10000000
                            }
                        })
                    }
                ]
            }
        });

        setTimeout(() => {
            res.status(200).json(posts);
        }, 500)

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

        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    const saved = await prisma.savedPost.findUnique({
                        where: {
                            userId_postId: {
                                postId: id,
                                userId: payload.id,
                            }
                        }
                    });
                    return res.status(200).json({...post, isSaved: saved ? true : false});
                } else {
                    return res.status(200).json({...post, isSaved: false});
                }
            });
        } else {
            return res.status(200).json({...post, isSaved: false});
        }

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
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { postDetail, ...postData } = req.body;

    try {
        const existingPost = await prisma.post.findUnique({
            where: { id: id }
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Postagem não encontrada!" });
        }

        if (existingPost.userId !== tokenUserId) {
            return res.status(403).json({ message: "Não autorizado!" });
        }

        const updatedPost = await prisma.post.update({
            where: { id: id },
            data: {
                title: postData.title,
                city: postData.city,
                noAccentCity: postData.noAccentCity,
                address: postData.address,
                condition: postData.condition,
                brand: postData.brand,
                transmission: postData.transmission,
                buyOrRent: postData.buyOrRent,
                fuel: postData.fuel,
                color: postData.color,
                priceToBuy: postData.priceToBuy,
                priceToRent: postData.priceToRent,
                latitude: postData.latitude,
                longitude: postData.longitude,
                images: postData.images,
                postDetail: postDetail ? {
                    update: postDetail
                } : undefined
                },
                include: {
                postDetail: true
                }
        });

        res.status(200).json(updatedPost);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Falha ao editar postagem!" });
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    
    try {
        const post = await prisma.post.findUnique({
            where: { id: id },
            include: { postDetail: true }
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({message: "Não autorizado!"})
        }

        await prisma.$transaction([
            prisma.postDetail.delete({
                where: { postId: id }
            }),
            prisma.post.delete({
                where: { id: id }
            })
        ]);

        res.status(200).json({message: "Publicação deletada!"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Falha ao deletar carro!"})
    }
}