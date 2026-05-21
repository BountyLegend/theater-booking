import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { LoginVerificationCode } from "../entities/LoginVerificationCode";

const userRepository = AppDataSource.getRepository(User);
const codeRepository = AppDataSource.getRepository(LoginVerificationCode);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "dev-access-token-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

if (!process.env.ACCESS_TOKEN_SECRET && !process.env.JWT_SECRET) {
    console.warn("ACCESS_TOKEN_SECRET/JWT_SECRET missing. Using development access token secret.");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    console.warn("REFRESH_TOKEN_SECRET missing. Using development refresh token secret.");
}

const publicUser = (user: User) => ({ id: user.id, name: user.name, email: user.email });

const createAccessToken = (user: User) =>
    jwt.sign(
        { userId: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as any
    );

const createRefreshToken = (user: User) =>
    jwt.sign(
        { userId: user.id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any
    );

const authPayload = (user: User) => {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return {
        accessToken,
        refreshToken,
        token: accessToken,
        user: publicUser(user)
    };
};

const generateLoginCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendLoginCode = async (email: string, code: string) => {
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!smtpConfigured) {
        console.log(`DEV LOGIN CODE for ${email}: ${code}`);
        return "Verification code generated. Check server console in development.";
    }

    try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: "Your theatre booking login code",
            text: `Your login verification code is ${code}. It expires in 5 minutes.`
        });

        return "Verification code sent.";
    } catch (error) {
        console.warn("SMTP login code send failed. Falling back to console code.", error);
        console.log(`DEV LOGIN CODE for ${email}: ${code}`);
        return "Verification code generated. Check server console in development.";
    }
};

const createLoginCode = async (user: User) => {
    const oldCodes = await codeRepository.find({
        where: { user: { id: user.id }, email: user.email, used: false }
    });

    if (oldCodes.length > 0) {
        await codeRepository.save(oldCodes.map(code => ({ ...code, used: true })));
    }

    const code = generateLoginCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const record = codeRepository.create({
        user,
        email: user.email,
        code_hash: codeHash,
        expires_at: expiresAt,
        used: false
    });

    await codeRepository.save(record);
    const message = await sendLoginCode(user.email, code);

    return { email: user.email, message };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({ name, email, password_hash: hashedPassword });
        await userRepository.save(user);

        res.status(201).json(authPayload(user));
    } catch (error) {
        res.status(400).json({ error: "Registration failed", details: error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findOneBy({ email });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const verification = await createLoginCode(user);
        res.json({
            requiresVerification: true,
            email: verification.email,
            message: verification.message || "Verification code sent."
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

export const verifyLoginCode = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: "Email and verification code are required" });
    }

    try {
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid or expired verification code" });
        }

        const record = await codeRepository.findOne({
            where: { user: { id: user.id }, email, used: false },
            order: { created_at: "DESC" }
        });

        if (!record || record.expires_at.getTime() < Date.now()) {
            if (record) {
                record.used = true;
                await codeRepository.save(record);
            }
            return res.status(401).json({ error: "Invalid or expired verification code" });
        }

        const valid = await bcrypt.compare(code, record.code_hash);

        if (!valid) {
            return res.status(401).json({ error: "Invalid or expired verification code" });
        }

        record.used = true;
        await codeRepository.save(record);

        res.json(authPayload(user));
    } catch (error) {
        res.status(500).json({ error: "Failed to verify login code" });
    }
};

export const resendLoginCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ error: "Could not send verification code" });
        }

        const verification = await createLoginCode(user);
        res.json({
            requiresVerification: true,
            email: verification.email,
            message: verification.message || "Verification code sent."
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to resend login code" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required" });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
        const user = await userRepository.findOneBy({ id: payload.userId });

        if (!user) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const accessToken = createAccessToken(user);
        res.json({ accessToken, token: accessToken });
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.json({ message: "Logged out" });
};
