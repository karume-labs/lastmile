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
  const targetUrl = `${apiBase}/api/${path}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key !== "host") {
      headers.set(key, value);
    }
  });

  const body =
    request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseBody = await response.arrayBuffer();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch {
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 502 });
  }
};
