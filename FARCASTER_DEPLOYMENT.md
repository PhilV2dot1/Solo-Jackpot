# 🎰 Solo Jackpot - Farcaster Mini-App Deployment Guide

This guide provides step-by-step instructions for deploying Solo Jackpot as a Farcaster Mini-App.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (or other hosting platform)
- ✅ Farcaster account with custody address access
- ✅ Desktop browser for Warpcast developer tools
- ✅ Mobile phone with Farcaster client (for QR code signing)

---

## 🚀 Deployment Steps

### Phase 1: Initial Deployment

#### Step 1: Deploy to Vercel

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Farcaster deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository `Solo-Jackpot`
   - Click "Deploy"

3. **Get your production URL**
   - After deployment, copy your Vercel URL (e.g., `solo-jackpot.vercel.app`)
   - Save this URL - you'll need it for the next steps

#### Step 2: Update Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add the following variables:

   ```env
   NEXT_PUBLIC_URL=https://YOUR-VERCEL-URL.vercel.app
   ```

   Replace `YOUR-VERCEL-URL` with your actual Vercel domain.

2. **Redeploy** to apply environment variables:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"

---

### Phase 2: Farcaster Manifest Generation

#### Step 3: Generate Account Association Signature

1. **Open Warpcast on Desktop**
   - Navigate to Warpcast developer tools
   - Access the Mini App Manifest Tool

2. **Enter Your Domain**
   - Input your production domain (e.g., `solo-jackpot.vercel.app`)
   - Do NOT include `https://` or trailing slash

3. **Claim Ownership**
   - Click "Claim Ownership" button
   - A QR code will appear

4. **Sign with Farcaster (Mobile)**
   - Open Farcaster app on your mobile phone
   - Scan the QR code from Warpcast desktop
   - Approve the signature request with your custody address
   - Wait for confirmation

5. **Copy Account Association**
   - After signing, three values will appear:
     - `header` (base64-encoded)
     - `payload` (base64-encoded)
     - `signature` (base64-encoded)
   - **Copy these values** - you'll need them in the next step

#### Step 4: Update Farcaster Manifest

1. **Update `public/.well-known/farcaster.json`**

   Replace the placeholder values in the `accountAssociation` section:

   ```json
   {
     "accountAssociation": {
       "header": "PASTE_YOUR_HEADER_HERE",
       "payload": "PASTE_YOUR_PAYLOAD_HERE",
       "signature": "PASTE_YOUR_SIGNATURE_HERE"
     },
     ...
   }
   ```

2. **Update URLs in manifest** (if your Vercel URL is different):

   Replace `https://solo-jackpot.vercel.app` with your actual production URL in:
   - `iconUrl`
   - `homeUrl`
   - `splashImageUrl`
   - `heroImageUrl`
   - `ogImageUrl`

3. **Update `.env.local`** with Farcaster credentials:

   ```env
   NEXT_PUBLIC_FARCASTER_HEADER=your_header_value
   NEXT_PUBLIC_FARCASTER_PAYLOAD=your_payload_value
   NEXT_PUBLIC_FARCASTER_SIGNATURE=your_signature_value
   ```

#### Step 5: Update Vercel Environment Variables

1. **Add Farcaster variables in Vercel:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add the three Farcaster variables:
     - `NEXT_PUBLIC_FARCASTER_HEADER`
     - `NEXT_PUBLIC_FARCASTER_PAYLOAD`
     - `NEXT_PUBLIC_FARCASTER_SIGNATURE`

2. **Commit and push manifest changes:**
   ```bash
   git add public/.well-known/farcaster.json .env.local
   git commit -m "Add Farcaster manifest signature"
   git push origin main
   ```

3. **Vercel will auto-deploy** with the updated manifest

---

### Phase 3: Verification & Testing

#### Step 6: Verify Manifest Endpoint

1. **Check manifest is accessible:**
   ```bash
   curl https://YOUR-DOMAIN.com/.well-known/farcaster.json
   ```

   Should return your complete manifest JSON.

2. **Validate manifest** using Warpcast tools:
   - Use Warpcast Mini App Embed Tool
   - Enter your production URL
   - Check for validation errors

#### Step 7: Test in Farcaster

1. **Share a test cast** with your Mini App URL:
   ```
   Check out my new crypto jackpot game!
   https://YOUR-DOMAIN.com
   ```

2. **Verify the embed**:
   - Should show your OG image
   - Should have "Play Now" button
   - Button should open your Mini App

3. **Test wallet connection**:
   - Open Mini App within Farcaster
   - Connect wallet
   - Verify Celo network support

4. **Test game functionality**:
   - Spin the wheel
   - Check crypto logos load correctly
   - Save score to leaderboard
   - Verify leaderboard displays

---

## 🎨 Customizing Images

The project includes SVG placeholder images. Replace them with professional designs:

### Icon (`public/icon.svg` → `public/icon.png`)
- **Size:** 1024x1024px
- **Format:** PNG (no transparency recommended)
- **Content:** Your app logo
- **Update manifest:** Change `iconUrl` from `.svg` to `.png`

### OG Image (`public/og-image.svg` → `public/og-image.png`)
- **Size:** 1200x630px (3:2 aspect ratio)
- **Format:** PNG, JPG, WebP, or GIF
- **Max Size:** Under 10MB
- **Content:** Attractive share image with game preview
- **Update manifest:** Change `ogImageUrl` and `heroImageUrl`

### Splash Screen (`public/splash.svg` → `public/splash.png`)
- **Size:** 200x200px
- **Format:** PNG
- **Content:** Loading screen icon
- **Update manifest:** Change `splashImageUrl`

After replacing images, update the manifest URLs and redeploy.

---

## 🔍 Troubleshooting

### Manifest Not Found (404)
- Ensure `.well-known` directory exists in `public/`
- Check file is named exactly `farcaster.json`
- Verify Vercel deployment included the file
- Check Next.js isn't excluding the directory

### Invalid Signature
- Regenerate signature using Warpcast tool
- Ensure you're using your production domain
- Check no typos in header/payload/signature values
- Verify custody address has permission

### Images Not Loading
- Check image URLs are absolute (include `https://`)
- Verify images are in `public/` directory
- Test image URLs directly in browser
- Check Vercel deployment includes images

### Wallet Connection Fails
- Verify Farcaster connector is first in wagmi config
- Check `@farcaster/miniapp-wagmi-connector` is installed
- Test in actual Farcaster client (not browser)
- Verify Celo chains are configured correctly

### Embed Doesn't Appear
- Check `fc:miniapp` metadata in layout.tsx
- Verify OG image is accessible
- Test URL in Warpcast Embed Tool
- Clear Farcaster cache (force refresh)

---

## ✅ Post-Deployment Checklist

- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] All images load correctly (icon, og-image, splash)
- [ ] App opens in Farcaster client
- [ ] Wallet connection works
- [ ] Game spins and shows crypto logos
- [ ] Leaderboard saves scores
- [ ] Share functionality works
- [ ] Embed preview shows correct image/button
- [ ] No console errors in production

---

## 🔗 Useful Links

- [Farcaster Developer Docs](https://docs.farcaster.xyz/)
- [Mini Apps Documentation](https://docs.farcaster.xyz/developers/frames/v2/miniapps)
- [Warpcast](https://warpcast.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Celo Documentation](https://docs.celo.org/)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Inspect browser console for errors
3. Verify all environment variables are set
4. Test manifest endpoint directly
5. Use Warpcast developer tools for validation

---

## 🎉 Success Criteria

Your Farcaster Mini-App is successfully deployed when:

1. ✅ Manifest validates in Warpcast tools
2. ✅ App URL shared in Farcaster shows embed preview
3. ✅ "Play Now" button opens your Mini App
4. ✅ Wallet connection works within Farcaster
5. ✅ Game functions correctly (spin, save score, leaderboard)
6. ✅ Images display properly
7. ✅ No errors in production logs

**Congratulations! Your Solo Jackpot Mini-App is now live on Farcaster! 🎰🎉**
