import express from "express";
import { deleteUser, getUser, getUsers, savePost, updateUser, profilePosts } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.get("/", getUsers);
router.get("/pesquisar/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/favoritos", verifyToken, savePost);
router.get("/postagens", verifyToken, profilePosts);

export default router;