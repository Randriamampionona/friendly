import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { WebhookEvent } from "@clerk/nextjs/server";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const headerPayload = await headers(); // not async

    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    };

    if (!svixHeaders["svix-id"]) {
      console.error("❌ Missing Svix headers");
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, svixHeaders) as WebhookEvent;
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const user = evt.data;

      const userRef = doc(db, "users", user.id);
      const existingUser = await getDoc(userRef);
      const existingData = existingUser.exists() ? existingUser.data() : {};

      // Keep existing username if already set
      const username =
        existingData.username ||
        (user.first_name && user.last_name
          ? `${user.first_name}_${user.last_name}`.toLowerCase()
          : user.first_name?.toLowerCase() ||
            user.last_name?.toLowerCase() ||
            user.id);

      const data = {
        id: user.id,
        email: user.email_addresses?.[0]?.email_address || "",
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        imageUrl: user.image_url,
        username: username,
        createdAt: existingData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, data, { merge: true });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
