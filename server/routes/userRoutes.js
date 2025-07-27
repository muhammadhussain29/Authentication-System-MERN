import express from "express";
import { getDetails } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();

router.get('/get-user', userAuth, getDetails)

export default router;