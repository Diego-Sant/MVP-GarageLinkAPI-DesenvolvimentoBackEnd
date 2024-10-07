import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "../routes/auth.route.js"
import postRoute from "../routes/post.route.js"
import userRoute from "../routes/user.route.js"
import chatRoute from "../routes/chat.route.js"
import messageRoute from "../routes/message.route.js"

const app = express();
const PORT = process.env.PORT || 8080;

const whitelist = [
    '*'
];
  
app.use((req, res, next) => {
    const origin = req.get('referer');
    const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    if (isWhitelisted) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }

    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
});

const setContext = (req, res, next) => {
    if (!req.context) req.context = {};
    next();
};

app.use(setContext);

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/usuarios", userRoute);
app.use("/api/publicacoes", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/mensagens", messageRoute);

app.listen(PORT, () => {
    console.log(`Server está funcionando na porta ${PORT}`);
});