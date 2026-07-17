import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

const apiBase = env.NEXT_PUBLIC_API_URL;

type Params = { params: Promise<{ proxy?: string[] }> };

export const GET = async (request: NextRequest, { params }: Params) => {
  const { proxy = [] } = await params;
  return proxyRequest(request, proxy);
};

export const POST = async (request: NextRequest, { params }: Params) => {
  const { proxy = [] } = await params;
  return proxyRequest(request, proxy);
};

export const PUT = async (request: NextRequest, { params }: Params) => {
  const { proxy = [] } = await params;
  return proxyRequest(request, proxy);
};

export const PATCH = async (request: NextRequest, { params }: Params) => {
  const { proxy = [] } = await params;
  return proxyRequest(request, proxy);
};

export const DELETE = async (request: NextRequest, { params }: Params) => {
  const { proxy = [] } = await params;
  return proxyRequest(request, proxy);
};

const proxyRequest = async (request: NextRequest, proxy: string[]) => {
  const path = proxy.join("/");
  const url = new URL(request.url);

  // Normalize apiBase to avoid trailing slash issues and map localhost to 127.0.0.1 for Node/axios IPv4 resolution
  let base = apiBase.replace(/\/+$/, "");
  if (base.includes("://localhost:")) {
    base = base.replace("://localhost:", "://127.0.0.1:");
  }
  const targetUrl = `${base}/api/${path}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower !== "host" &&
      lower !== "connection" &&
      lower !== "content-length" &&
      lower !== "transfer-encoding" &&
      lower !== "accept-encoding"
    ) {
      headers.set(key, value);
    }
  });

  const body =
    request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

  try {
    const response = await axios({
      url: targetUrl,
      method: request.method,
      headers: Object.fromEntries(headers.entries()),
      data: body,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    // Build response headers, properly forwarding Set-Cookie
    const responseHeaders = new Headers();
    for (const [key, value] of Object.entries(response.headers)) {
      if (key.toLowerCase() === "set-cookie") {
        const cookies = Array.isArray(value) ? value : [value];
        for (const cookie of cookies) {
          if (cookie) responseHeaders.append("Set-Cookie", cookie);
        }
      } else if (value != null) {
        responseHeaders.set(key, String(value));
      }
    }

    const bodyData =
      response.status === 204 || response.status === 304 || response.status === 205
        ? null
        : response.data;

    return new NextResponse(bodyData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(
      `[PROXY ERROR] Failed to proxy ${request.method} to ${targetUrl}:`,
      error?.message || error,
    );
    return NextResponse.json(
      { error: "Failed to proxy request", details: error?.message },
      { status: 502 },
    );
  }
};
