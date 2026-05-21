import { Router } from "express";
import { register, login, refresh, logout, verifyLoginCode, resendLoginCode } from "../controllers/AuthController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-login-code", verifyLoginCode);
router.post("/resend-login-code", resendLoginCode);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
