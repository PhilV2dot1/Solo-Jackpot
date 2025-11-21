import sdk from "@farcaster/miniapp-sdk";

export { sdk };

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export async function initializeFarcaster() {
  try {
    await sdk.actions.ready();
    return true;
  } catch (error) {
    console.error("Failed to initialize Farcaster SDK:", error);
    return false;
  }
}

export function getFarcasterUser(): FarcasterUser | null {
  try {
    const context = sdk.context;
    if (!context || !context.user) {
      return null;
    }

    return {
      fid: context.user.fid,
      username: context.user.username,
      displayName: context.user.displayName,
      pfpUrl: context.user.pfpUrl,
    };
  } catch (error) {
    console.error("Failed to get Farcaster user:", error);
    return null;
  }
}

export function isInFarcasterFrame(): boolean {
  try {
    return sdk.context?.client?.clientFid !== undefined;
  } catch (error) {
    return false;
  }
}

export async function shareOnFarcaster(text: string, embeds?: string[]) {
  const embedsParam = embeds?.map(e => `embeds[]=${encodeURIComponent(e)}`).join('&') || '';
  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}${embedsParam ? '&' + embedsParam : ''}`;

  try {
    await sdk.actions.openUrl(shareUrl);
  } catch (error) {
    // Fallback: open in new window
    window.open(shareUrl, '_blank');
  }
}
