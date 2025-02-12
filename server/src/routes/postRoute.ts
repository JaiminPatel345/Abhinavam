import express from "express";
import {formatResponse} from "../utils/formatResponse.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.json(formatResponse(true, "done"))
});

export default router;