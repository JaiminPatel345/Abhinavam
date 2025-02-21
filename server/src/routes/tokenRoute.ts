import express from "express";
const router = express.Router();
import tokenController from "../controllers/tokenController.js";

router.get("/", tokenController.giveNewTokens);

export default router;
