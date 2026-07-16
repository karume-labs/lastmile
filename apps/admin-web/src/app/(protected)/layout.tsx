import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { env } from "@/env";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const tokenName = cookieStore.has("__Secure-better-auth.session_token")
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";

  const sessionToken = cookieStore.get(tokenName)?.value;

  if (!sessionToken) {
    redirect("/sign-in");
  }

  const reqHeaders = await headers();

  try {
    const apiRes = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
      headers: {
        Cookie: `${tokenName}=${sessionToken}`,
        "User-Agent": reqHeaders.get("user-agent") || "NextJs-Layout",
        Host: new URL(env.NEXT_PUBLIC_API_URL).host,
      },
      validateStatus: () => true, // Do not throw on error statuses
    });

    if (apiRes.status !== 200) {
      redirect("/sign-in");
    }

    const session = apiRes.data;

    if (!session?.user || !["admin", "super_admin"].includes(session.user.role)) {
      redirect("/sign-in");
    }
  } catch (error) {
    console.error("[LAYOUT AUTH ERROR]:", error);
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
