# 🚀 Guide de Déploiement - Solo Jackpot

Guide complet pour déployer Solo Jackpot sur Vercel avec intégration Farcaster et Celo.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir:

- ✅ Compte GitHub avec le repository `solo-jackpot`
- ✅ Compte Vercel (gratuit)
- ✅ Smart contract déployé sur Celo Mainnet: `0x07bc49e8a2baf7c68519f9a61fcd733490061644`
- ✅ Compte Farcaster avec accès à Warpcast
- ✅ Hosted Manifest ID Farcaster: `019aa99b-e5ea-79c1-95d1-18c77aa9ef12`

---

## 🔧 Étape 1: Préparer le Repository

### 1.1 Vérifier que tous les fichiers sont commités

```bash
cd C:\Users\Philv2dot1\solo-jackpot
git status
```

Si des fichiers sont modifiés:

```bash
git add .
git commit -m "feat: Complete on-chain integration with session tracking

- Implement automatic sessionId tracking from PartyStarted events
- Add session status indicator in UI
- Integrate startParty on first spin in on-chain mode
- Update SaveToLeaderboard to use tracked sessions
- Add automatic session reset when switching modes
- Optimize rotation speed to exactly 3 seconds

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 1.2 Pousser vers GitHub

```bash
git push origin main
```

---

## 🌐 Étape 2: Déployer sur Vercel

### 2.1 Connexion à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Connectez-vous avec votre compte GitHub

### 2.2 Importer le Project

1. Cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre repository **`solo-jackpot`**
3. Cliquez sur **"Import"**

### 2.3 Configuration du Projet

**Framework Preset:** Next.js (détecté automatiquement)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Root Directory:** `.` (racine)

### 2.4 Variables d'Environnement

Ajoutez TOUTES ces variables avant de déployer:

```env
# Farcaster Configuration
NEXT_PUBLIC_URL=https://solo-jackpot.vercel.app
NEXT_PUBLIC_FARCASTER_HEADER=eyJmaWQiOjQ5MTM1MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGYxOTM1NmFEQmZiMjcwZDc5MmIwZkExMjBlNzQ0RTQ3OTI2QTA2ZDAifQ
NEXT_PUBLIC_FARCASTER_PAYLOAD=eyJkb21haW4iOiJzb2xvLWphY2twb3QudmVyY2VsLmFwcCJ9
NEXT_PUBLIC_FARCASTER_SIGNATURE=VHYTQ8dErvqIGKC3T58LEHU37be8djQnkh1hN6wS41EHVEOnhomrxCox/FbDt1FpV/FLqIgbnvhhfF71ZakujBs=
NEXT_PUBLIC_HOSTED_MANIFEST_ID=019aa99b-e5ea-79c1-95d1-18c77aa9ef12

# Blockchain Configuration
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_LEADERBOARD_ADDRESS=0x07bc49e8a2baf7c68519f9a61fcd733490061644
```

**⚠️ IMPORTANT:** Après le déploiement, vous devrez mettre à jour `NEXT_PUBLIC_URL` avec l'URL réelle de Vercel.

### 2.5 Déployer

Cliquez sur **"Deploy"** et attendez (~2-3 minutes)

---

## 🔄 Étape 3: Post-Déploiement

### 3.1 Récupérer l'URL de Production

Une fois le déploiement terminé:
1. Notez votre URL Vercel (ex: `https://solo-jackpot-abc123.vercel.app`)
2. Allez dans **Settings** → **Environment Variables**
3. Modifiez `NEXT_PUBLIC_URL` avec votre vraie URL
4. Cliquez sur **"Save"**

### 3.2 Redéployer

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **trois points** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Confirmez avec **"Redeploy"**

---

## ✅ Étape 4: Vérification

### 4.1 Tests de Base

Visitez votre URL de production et vérifiez:

- [ ] La page se charge correctement
- [ ] Le background jaune Celo (#FCFF52) s'affiche
- [ ] Les logos crypto CoinGecko se chargent
- [ ] Le mode toggle fonctionne (Free ↔ On-Chain)
- [ ] Le leaderboard s'affiche (`/leaderboard`)

### 4.2 Tests Mode Free

1. Cliquez sur **SPIN**
2. Vérifiez que:
   - [ ] Les rouleaux tournent pendant ~3 secondes
   - [ ] Le résultat s'affiche après l'arrêt
   - [ ] Le score total s'incrémente
   - [ ] Le bouton "Save Score" apparaît
   - [ ] La sauvegarde fonctionne (in-memory)
   - [ ] Le partage Farcaster fonctionne

### 4.3 Tests Mode On-Chain

1. Activez le mode **On-Chain**
2. Connectez votre wallet (MetaMask sur Celo Mainnet)
3. Vérifiez que:
   - [ ] Le bouton WalletConnect apparaît
   - [ ] La connexion wallet fonctionne
   - [ ] L'indicateur "No Active Session" s'affiche
   - [ ] Au premier SPIN, `startParty` est appelé
   - [ ] L'indicateur passe à "Starting Session..."
   - [ ] Après confirmation, "Active Session #X" s'affiche
   - [ ] Les spins suivants utilisent la même session
   - [ ] "Save Score" appelle `submitScore` avec la bonne session
   - [ ] Le leaderboard on-chain affiche les scores

### 4.4 Tests Farcaster

1. Ouvrez l'app dans Warpcast:
   - URL: `https://warpcast.com/~/developers/frames?url=https://solo-jackpot.vercel.app`
2. Vérifiez que:
   - [ ] L'app se charge dans Farcaster
   - [ ] Le manifest redirect (307) fonctionne
   - [ ] Les métadonnées OG s'affichent
   - [ ] Le partage de score fonctionne

---

## 🐛 Dépannage

### Problème: Variables d'environnement non appliquées

**Solution:**
1. Vérifiez que toutes les variables sont dans Vercel
2. Redéployez le projet (ne pas juste rebuild)

### Problème: Images CoinGecko ne se chargent pas

**Solution:**
1. Vérifiez `next.config.js` → `images.remotePatterns`
2. Pattern doit inclure: `hostname: 'assets.coingecko.com'`

### Problème: Smart contract non trouvé

**Vérifications:**
1. `NEXT_PUBLIC_LEADERBOARD_ADDRESS` est bien défini
2. L'adresse est correcte: `0x07bc49e8a2baf7c68519f9a61fcd733490061644`
3. Le contrat est déployé sur Celo Mainnet (pas testnet)

### Problème: Farcaster manifest 404

**Solution:**
1. Vérifiez `next.config.js` → `redirects()`
2. L'URL du manifest doit correspondre au `NEXT_PUBLIC_HOSTED_MANIFEST_ID`

### Problème: Session ne se crée pas

**Vérifications:**
1. Wallet connecté au bon réseau (Celo Mainnet, chainId: 42220)
2. Console navigateur pour les erreurs de transaction
3. Vérifiez que `startParty` est bien appelé (logs console)

---

## 📊 Monitoring

### Vercel Analytics

1. Allez dans **Analytics** dans votre dashboard Vercel
2. Activez **Web Analytics** (gratuit)
3. Suivez les métriques:
   - Visiteurs
   - Pages vues
   - Performance (Core Web Vitals)

### Blockchain Explorer

Vérifiez les transactions sur Celo:
- **Mainnet Explorer:** https://celoscan.io/address/0x07bc49e8a2baf7c68519f9a61fcd733490061644
- Recherchez les événements `PartyStarted` et `ScoreSubmitted`

---

## 🔒 Sécurité

### Variables d'Environnement

- ✅ Toutes les clés publiques sont prefixées par `NEXT_PUBLIC_`
- ✅ Pas de clés privées dans le code
- ✅ Les signatures Farcaster sont publiques (safe)

### Smart Contract

- ✅ Contrat vérifié sur CeloScan (recommandé)
- ✅ Code source public dans `/contracts`
- ✅ Audit de sécurité (si production)

---

## 🎯 Prochaines Étapes

Après un déploiement réussi:

1. **Domaine personnalisé** (optionnel)
   - Settings → Domains → Add Domain
   - Configurez votre DNS

2. **Base de données** (pour production)
   - Remplacer `Map` in-memory par PostgreSQL/MongoDB
   - Utiliser Vercel Postgres ou Supabase

3. **Monitoring avancé**
   - Sentry pour error tracking
   - Mixpanel/Amplitude pour analytics
   - Blockchain events indexing avec The Graph

4. **SEO & Social**
   - Optimiser les meta tags
   - Créer des OG images personnalisées
   - Soumettre à Google Search Console

---

## 📞 Support

En cas de problème:

1. **Logs Vercel:** Settings → Logs
2. **Console navigateur:** F12 → Console
3. **GitHub Issues:** https://github.com/anthropics/claude-code/issues
4. **Farcaster Docs:** https://docs.farcaster.xyz

---

## ✨ Checklist Finale

Avant de partager publiquement:

- [ ] ✅ Déployé sur Vercel
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ URL de production mise à jour
- [ ] ✅ Tests mode Free réussis
- [ ] ✅ Tests mode On-Chain réussis
- [ ] ✅ Tests Farcaster réussis
- [ ] ✅ Smart contract vérifié sur CeloScan
- [ ] ✅ Analytics activé
- [ ] ✅ Domaine configuré (si applicable)

---

🎉 **Félicitations! Votre Solo Jackpot est maintenant live!**

Partagez votre app sur Farcaster et commencez à jouer!

```
🎰 Solo Jackpot is live! 🚀

Play to win crypto-based rewards on Celo blockchain!

🆓 Free Mode: Play instantly
⛓️ On-Chain Mode: Immortalize your scores

Try it now: https://solo-jackpot.vercel.app

Cast this on Farcaster to share!
```
