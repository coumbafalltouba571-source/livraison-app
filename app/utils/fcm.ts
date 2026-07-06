export interface FcmNotificationPayload {
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

export async function sendFcmNotificationByUser(
  targetUserId: string,
  notification: FcmNotificationPayload,
  data?: Record<string, string>
): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/send-fcm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetUserId,
        notification,
        data,
      } as SendFcmRequest),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ FCM API response failed:", text);
      return false;
    }

    const result = await response.json();
    if (!result.success) {
      console.error("❌ FCM send failed:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ FCM send exception:", error);
    return false;
  }
}

export async function sendFcmNotificationToTokens(
  tokens: string[],
  notification: FcmNotificationPayload,
  data?: Record<string, string>
): Promise<boolean> {
  if (!tokens.length) {
    return false;
  }

  try {
    const response = await fetch("/api/notifications/send-fcm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens,
        notification,
        data,
      } as SendFcmRequest),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ FCM API response failed:", text);
      return false;
    }

    const result = await response.json();
    if (!result.success) {
      console.error("❌ FCM send failed:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ FCM send exception:", error);
    return false;
  }
}
