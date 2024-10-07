import prisma from "../lib/prisma.js";


export const getChats = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        });

        for (const chat of chats) {
            const receiverId = chat.userIDs.find(id => id !== tokenUserId);

            const receiver = await prisma.user.findUnique({
                where: {
                    id: receiverId,
                },

                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                }
            });

            chat.receiver = receiver;
        }

        res.status(200).json(chats);

    } catch (error) {
        res.status(500).json({message: "Falha ao acessar conversas!"})
    }
};

export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },
            include: {
                message: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        if (!chat) {
            return res.status(404).json({ message: "Conversa não encontrada!" });
        }

        const updatedSeenBy = [...new Set([...chat.seenBy, tokenUserId])];

        await prisma.chat.update({
            where: {
                id: req.params.id
            },
            data: {
                seenBy: {
                    set: updatedSeenBy
                }
            }
        });

        const lastMessageSenderId = chat.message[chat.message.length - 1]?.userId;

        res.status(200).json({ ...chat, lastMessageSenderId });

    } catch (error) {
        res.status(500).json({message: "Falha ao acessar conversa!"})
    }
};

export const addChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, req.body.receiverId]
            }
        })
        res.status(200).json(newChat);

    } catch (error) {
        res.status(500).json({message: "Falha ao adicionar conversa!"})
    }
};

export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const updatedSeenBy = [...new Set([...chat.seenBy, tokenUserId])];

        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            data: {
                seenBy: {
                    set: updatedSeenBy
                }
            }
        })

        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json({message: "Falha ao ler conversa!"})
    }
};