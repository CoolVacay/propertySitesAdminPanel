import { NextResponse } from "next/server";

// Base URL of your external API (configured via environment variable)
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!NEXT_PUBLIC_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable");
}

/**
 * GET handler: proxy GET requests to external API
 * Expected query: ?propertyId=<id>
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }
  // Forward GET to external service
  const res = await fetch(
    `${NEXT_PUBLIC_BASE_URL}/api/PropertySite?url=${propertyId}`,
    {
      cache: "no-cache",
    }
  );
  if (res.statusText === "Not Found") throw new Error("propertyId not found");
  const data = await res.json();

  return NextResponse.json(data, {
    status: res.status,
  });
}

/**
 * POST handler: proxy POST requests with a JSON body
 * Expected query: ?propertyId=<id>
 * Body: arbitrary JSON to update
 */
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
  }

  const bodyText = await request.text();

  // Forward POST to external service
  const res = await fetch(
    `${NEXT_PUBLIC_BASE_URL}/api/PropertySite?url=${propertyId}`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain",
        "API-Key": "!hs9dj!aDnO#O6*(S;12|ghSl+=wkjwDK4-",
      },
      body: bodyText,
    }
  );
  const contentType = res.headers.get("content-type") || "application/json";
  const responseBody = await res.text();

  return new NextResponse(responseBody, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
