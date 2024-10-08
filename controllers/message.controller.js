import prisma from "../lib/prisma.js";


export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;

    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            }
        })

        if (!chat) {
            return res.status(404).json({ message: "Conversa não encontrada!" });
        }

        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId
            }
        });

        await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                seenBy: [tokenUserId],
                lastMessage: text,
                lastMessageSenderId: tokenUserId
            }
        })

        res.status(200).json(message);

    } catch (error) {
        res.status(500).json({message: "Falha ao enviar mensagem!"})
    }
}