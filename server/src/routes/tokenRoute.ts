import express from "express";
const router = express.Router();
import tokenController from "../controllers/tokenController.js";

router.get("/refresh-tokens", tokenController.giveNewTokens);

export default router;