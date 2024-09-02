import express from "express";
import postRoute from "./routes/post.route.js"

const app = express();

app.use("/api/postagens", postRoute);

app.listen(3000, () => {
    console.log("Server está funcionando!")
})