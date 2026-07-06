import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";

interface FcmNotificationPayload {
  title: string;
  body: string;
  image?: string;
  clickAction?: string;
  data?: Record<string, string>;
}

interface SendFcmRequest {
  targetUserId?: string;
  tokens?: string[];
  notification: FcmNotificationPayload;
  data?: Record<string, string>;
}

async function getDeviceTokensForUser(userId: string): Promise<string[]> {
  const devicesQuery = query(collection(db, "users", userId, "devices"));
  const snapshot = await getDocs(devicesQuery);
  return snapshot.docs
    .map((doc) => doc.data()?.token)
    .filter((token): token is string => typeof token === "string");
}

async function sendToFcmServer(tokens: string[], notification: FcmNotificationPayload, data?: Record<string, string>) {
  const serverKey = process.env.FCM_SERVER_KEY || process.env.NEXT_PUBLIC_FCM_SERVER_KEY;

  if (!serverKey) {
    throw new Error("Missing FCM_SERVER_KEY environment variable");
  }

  const body = {
    registration_ids: tokens,
    notification: {
      title: notification.title,
      body: notification.body,
      image: notification.image,
      click_action: notification.clickAction,
    },
    data: data || {},
  };

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`FCM send failed: ${JSON.stringify(result)}`);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendFcmRequest;
    const tokens = body.tokens ?? (body.targetUserId ? await getDeviceTokensForUser(body.targetUserId) : []);

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ success: false, message: "No device tokens available" }, { status: 400 });
    }

    const result = await sendToFcmServer(tokens, body.notification, body.data);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("❌ [send-fcm] Error:", error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
