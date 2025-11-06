import { Timestamp } from "firebase-admin/firestore";

type TMessage = {
  sender_id: string;
  username: string;
  text: string;
  asset?: string;
  timestamp: Timestamp;
  avatar_url: string;
};

type TChat = TMessage[];
