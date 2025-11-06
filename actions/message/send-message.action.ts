"use server";

import { db } from "@/lib/firebase";
import { currentUser } from "@clerk/nextjs/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

interface SendMessageInput {
  sender_id: string;
  text: string;
  asset?: string;
}

export async function sendMessageAction({
  sender_id,
  text,
  asset,
}: SendMessageInput) {
  const user = await currentUser();
  if (!sender_id || (!text && !asset)) {
    throw new Error("sender_id and text are required");
  }

  // ?? Get username from the 'users' collection in Firestore
  const userRef = doc(db, "users", sender_id);
  const userSnap = await getDoc(userRef);

  let username = "Unknown User";
  if (userSnap.exists()) {
    const userData = userSnap.data();
    username = userData.username || "Unknown User";
  }

  // ?? Save message in 'chats' collection
  const chatsRef = collection(db, "chats");
  const docRef = await addDoc(
    chatsRef,
    asset
      ? {
          sender_id,
          text,
          avatar_url: user?.imageUrl || null,
          username,
          asset,
          timestamp: serverTimestamp(),
        }
      : {
          sender_id,
          text,
          avatar_url: user?.imageUrl || null,
          username,
          timestamp: serverTimestamp(),
        }
  );

  return { id: docRef.id };
}
