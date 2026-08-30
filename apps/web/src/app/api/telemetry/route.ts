import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { digest, message, pathname, userAgent, timestamp } = body || {};

    const errorTime = timestamp
      ? new Date(timestamp).toLocaleString("id-ID")
      : new Date().toLocaleString("id-ID");
    const safePath = pathname || "Unknown path";
    const safeDigest = digest || "N/A";
    const safeMsg = message || "Unknown runtime client exception";

    // 1. Log to server console
    console.error(
      `[TELEMETRY][Client Error] ${errorTime} | Path: ${safePath} | Digest: ${safeDigest} | Msg: ${safeMsg}`,
    );

    // 2. Dispatch Telegram Alert if configured
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramText =
        `🚨 <b>Frontend Runtime Error Alert</b>\n\n` +
        `🕒 <b>Waktu:</b> <code>${errorTime}</code>\n` +
        `🌐 <b>Halaman:</b> <code>${safePath}</code>\n` +
        `🔑 <b>Digest:</b> <code>${safeDigest}</code>\n` +
        `⚠️ <b>Pesan:</b> <i>${safeMsg}</i>\n` +
        `📱 <b>User Agent:</b> <code>${(userAgent || "Unknown").slice(0, 120)}</code>`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText,
            parse_mode: "HTML",
          }),
        });
      } catch (tgError) {
        console.warn(
          "[TELEMETRY] Failed to dispatch Telegram notification:",
          tgError,
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TELEMETRY] Error processing error telemetry:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
