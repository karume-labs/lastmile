import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "@lastmile/db/client";
import { account, user } from "@lastmile/db/schemas/auth";
import { and, eq } from "drizzle-orm";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production-2026";

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

const verifyPassword = (password: string, storedHash: string) => {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) return false;

  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(key, "hex");
  const b = Buffer.from(derivedKey, "hex");

  return a.length === b.length && timingSafeEqual(a, b);
};

const signToken = (payload: { id: string; email: string; role: "ADMIN" | "REGISTRAR" }) => {
  const issuedAt = Date.now();
  const body = JSON.stringify({ ...payload, issuedAt, expiresAt: issuedAt + TOKEN_TTL_MS });
  const encodedBody = Buffer.from(body).toString("base64url");
  const signature = createHmac("sha256", JWT_SECRET).update(encodedBody).digest("base64url");

  return `${encodedBody}.${signature}`;
};

export const verifyToken = (token: string) => {
  const [encodedBody, signature] = token.split(".");

  if (!encodedBody || !signature) return null;

  const expectedSignature = createHmac("sha256", JWT_SECRET)
    .update(encodedBody)
    .digest("base64url");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf8")) as {
    id: string;
    email: string;
    role: "ADMIN" | "REGISTRAR";
    expiresAt: number;
  };

  if (payload.expiresAt <= Date.now()) return null;

  return payload;
};

export const authService = {
  async register(email: string, password: string, name: string, role: "ADMIN" | "REGISTRAR") {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = hashPassword(password);
    const userId = randomUUID();

    await db.insert(user).values({
      id: userId,
      email,
      name,
      role,
    });

    await db.insert(account).values({
      id: randomUUID(),
      userId,
      accountId: email,
      providerId: "credential",
      password: hashedPassword,
    });

    return {
      user: {
        id: userId,
        email,
        name,
        role,
      },
    };
  },

  async login(email: string, password: string) {
    const userResult = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userResult) {
      throw new Error("Invalid credentials");
    }

    const accountResult = await db.query.account.findFirst({
      where: and(eq(account.userId, userResult.id), eq(account.providerId, "credential")),
    });

    if (
      !accountResult ||
      !accountResult.password ||
      !verifyPassword(password, accountResult.password)
    ) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({
      id: userResult.id,
      email: userResult.email,
      role: (userResult.role as "ADMIN" | "REGISTRAR") || "REGISTRAR",
    });

    return {
      user: {
        id: userResult.id,
        email: userResult.email,
        name: userResult.name,
        role: userResult.role as "ADMIN" | "REGISTRAR",
      },
      token,
    };
  },

  async getProfile(userId: string) {
    return db.query.user.findFirst({
      where: eq(user.id, userId),
    });
  },
};
