import { authService } from "@lastmile/api/features/auth/services";
import { authenticate } from "@lastmile/api/middlewares/authenticate";
import { validate } from "@lastmile/api/middlewares/validate";
import { Router } from "express";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["ADMIN", "REGISTRAR"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(
      req.body.email,
      req.body.password,
      req.body.name,
      req.body.role,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/sign-in", validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.cookie("lm_auth_token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/sign-out", async (_req, res) => {
  res.clearCookie("lm_auth_token", { path: "/" });
  res.json({ success: true });
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.cookie("lm_auth_token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/profile", authenticate, async (req, res, next) => {
  try {
    const user = req.user as NonNullable<typeof req.user>;
    const result = await authService.getProfile(user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
