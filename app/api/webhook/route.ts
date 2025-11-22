import { NextRequest, NextResponse } from "next/server";

/**
 * Farcaster Mini-App Webhook Endpoint
 *
 * This endpoint receives notifications from Farcaster about events
 * related to your Mini App (e.g., installations, launches, etc.)
 *
 * Webhook URL: https://your-domain.com/api/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Farcaster webhook received:", {
      timestamp: new Date().toISOString(),
      event: body.event,
      data: body,
    });

    // Handle different event types
    switch (body.event) {
      case "miniapp.installed":
        // User installed your Mini App
        console.log("Mini App installed by FID:", body.fid);
        break;

      case "miniapp.launched":
        // User launched your Mini App
        console.log("Mini App launched by FID:", body.fid);
        break;

      case "miniapp.uninstalled":
        // User uninstalled your Mini App
        console.log("Mini App uninstalled by FID:", body.fid);
        break;

      default:
        console.log("Unknown event type:", body.event);
    }

    // Respond with success
    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}

// Verify webhook is accessible via GET (health check)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Farcaster Mini-App Webhook",
    timestamp: new Date().toISOString(),
  });
}
