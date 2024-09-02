import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/cadastrar", register);

router.post("/entrar", login);

router.post("/sair", logout);

export default router;