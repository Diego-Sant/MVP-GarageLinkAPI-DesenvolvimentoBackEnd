import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";

const router = express.Router()

router.get("/deve-estar-logado", shouldBeLoggedIn);

router.get("/deve-ser-admin", shouldBeAdmin);

export default router;