import { authService } from "@lastmile/api/features/auth/services";
import { authenticate } from "@lastmile/api/middlewares/authenticate";
import { validate } from "@lastmile/api/middlewares/validate";
import { AuthSignInSchema, AuthSignUpSchema } from "@lastmile/validators/auth";
import { Router } from "express";

const router = Router();

router.post("/sign-up", validate(AuthSignUpSchema), async (req, res, next) => {
  try {
    const result = await authService.signUp(
      req.body.email,
      req.body.password,
      `${req.body.firstName} ${req.body.lastName}`.trim(),
      "ADMIN", // Defaulting to ADMIN for now, or consider updating service if role is needed
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/sign-in", validate(AuthSignInSchema), async (req, res, next) => {
  try {
    const result = await authService.signIn(req.body.email, req.body.password);
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
