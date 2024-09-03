import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.get("/deve-estar-logado", verifyToken, shouldBeLoggedIn);

router.get("/deve-ser-admin", shouldBeAdmin);

export default router;