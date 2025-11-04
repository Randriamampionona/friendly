import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { WebhookEvent } from "@clerk/clerk-sdk-node";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!; // from Clerk Dashboard ? Webhooks

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(payload, svixHeaders) as WebhookEvent;
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const user = evt.data;
      await setDoc(doc(db, "users", user.id), {
        id: user.id,
        email: user.email_addresses?.[0]?.email_address || "",
        name: user.first_name + " " + (user.last_name || ""),
        imageUrl: user.image_url,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
