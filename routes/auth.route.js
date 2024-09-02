import express from "express";

const router = express.Router()

router.post("/cadastrar", (req, res) => {
    console.log("Rota funcionou!")
});

router.post("/entrar", (req, res) => {
    console.log("Rota funcionou!")
});

router.post("/sair", (req, res) => {
    console.log("Rota funcionou!")
});

export default router;