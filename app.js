import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import testRoute from "./routes/test.route.js"

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/postagens", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/testes", testRoute);

app.listen(8080, () => {
    console.log("Server está funcionando!")
})