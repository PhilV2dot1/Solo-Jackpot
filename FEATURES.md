# 🎰 Solo Jackpot - Fonctionnalités

## 🎮 Vue d'ensemble

Solo Jackpot est une mini-app Farcaster de type machine à sous intégrant la blockchain Celo pour un gameplay transparent et vérifiable.

---

## ✨ Fonctionnalités Principales

### 🎲 Système de Jeu

#### Cryptomonnaies basées sur Market Cap
Chaque crypto a une valeur de points reflétant son classement:

| Crypto | Points | Market Cap Rank | Probabilité |
|--------|--------|-----------------|-------------|
| 🟠 **BTC** | 1000 | #1 | 2% (Jackpot!) |
| 🔵 **ETH** | 500 | #2 | 5% |
| ⚪ **XRP** | 250 | #3 | 8% |
| 🟡 **BNB** | 100 | #4 | 12% |
| 🟣 **SOL** | 50 | #5 | 15% |
| 🟢 **CELO** | 25 | #6 | 18% |
| 🟤 **DOGE** | 10 | #7 | 20% |
| ❌ **MISS** | 0 | - | 20% (Perte) |

#### Temps de Rotation Optimisé
- **Durée totale:** 3 secondes exactement
- **Rotation visuelle:** 2 secondes
- **Stabilisation progressive:** 0.7 secondes
- **Affichage résultat:** 0.3 secondes

### 🎨 Interface Utilisateur

#### Design Mobile-First
- **Background:** Jaune Celo (#FCFF52)
- **Taille optimale:** 375-428px (iPhone/Android)
- **Logos crypto:** Images CoinGecko 96x96px
- **Animations:** Framer Motion fluides
- **Thème:** Noir/Vert Celo/Jaune Celo

#### Indicateurs Visuels
- 🏆 Score total en temps réel
- 🎯 Résultat du dernier spin
- ⚡ Statut de session (On-Chain)
- 🔗 État de connexion wallet
- 📊 Position dans le leaderboard

---

## 🔄 Deux Modes de Jeu

### 🆓 Mode Free Play

**Caractéristiques:**
- ✅ Accès instantané
- ✅ Pas de frais
- ✅ Connexion Farcaster uniquement
- ✅ Stockage temporaire (in-memory)
- ✅ Partage social intégré

**Flow:**
1. Ouvrir l'app
2. Cliquer sur SPIN
3. Accumuler des points
4. Sauvegarder le score (in-memory)
5. Partager sur Farcaster

### ⛓️ Mode On-Chain

**Caractéristiques:**
- ✅ Scores immortalisés sur Celo
- ✅ Vérifiable publiquement
- ✅ Tracking de sessions
- ✅ Smart contract auditable
- ⚠️ Requiert gas fees (CELO)

**Flow:**
1. Activer mode On-Chain
2. Connecter wallet Celo
3. **Premier spin:** `startParty(fid)` automatique
   - Transaction confirmée
   - SessionId extrait de l'événement
   - Indicateur: 🟢 Active Session #123
4. **Spins suivants:** Utilise la session active
5. **Sauvegarder:** `submitScore(sessionId, score)`
   - Transaction confirmée
   - Score permanent on-chain

---

## 🏆 Système de Leaderboard

### Mode Free
- Stockage en mémoire (Map)
- Tri par highScore
- Top 100 joueurs
- Agrégation par FID:
  - `highScore`: Meilleur score
  - `totalScore`: Somme de tous les scores
  - `gamesPlayed`: Nombre de parties

### Mode On-Chain
- Lecture depuis smart contract
- Données immutables
- Vérifiable sur CeloScan
- Events indexables:
  - `PartyStarted(sessionId, fid, player)`
  - `ScoreSubmitted(sessionId, fid, score, rank)`

---

## 🔗 Intégration Blockchain

### Smart Contract: SoloJackpotLeaderboard

**Adresse Celo Mainnet:**
```
0x07bc49e8a2baf7c68519f9a61fcd733490061644
```

**Fonctions principales:**
```solidity
function startParty(uint256 _fid) external returns (uint256 sessionId)
function submitScore(uint256 _sessionId, uint256 _score) external
function getTopScores(uint256 _limit) external view returns (GameSession[])
function getUserSessions(uint256 _fid) external view returns (uint256[])
```

**Structure GameSession:**
```solidity
struct GameSession {
  uint256 fid;        // Farcaster ID
  address player;     // Wallet address
  uint256 score;      // Score final
  uint256 timestamp;  // Date de jeu
  bool completed;     // Statut
}
```

### Gestion de Sessions

**Cycle de vie:**
```
1. startParty(fid) → sessionId émis
2. Jeu en cours (accumulation score)
3. submitScore(sessionId, totalScore)
4. Session marquée "completed"
```

**Tracking automatique:**
- Hook `useLeaderboardContract` écoute l'événement `PartyStarted`
- Extrait le `sessionId` des logs de transaction
- Stocke localement pour les soumissions futures
- Réinitialise automatiquement au changement de mode

---

## 🎯 Intégration Farcaster

### Manifest Hébergé
- **ID:** `019aa99b-e5ea-79c1-95d1-18c77aa9ef12`
- **Redirect 307:** `/.well-known/farcaster.json`
- **Destination:** Farcaster hosted manifest API

### Account Association
- **FID:** 491350
- **Header:** Signature cryptographique
- **Payload:** Domain verification
- **Signature:** Ed25519 signature

### Fonctionnalités Sociales
- Partage de score avec Cast
- Intégration frame metadata
- OG images optimisées
- Deep linking depuis Warpcast

---

## 🛠️ Stack Technique

### Frontend
```typescript
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
```

### Blockchain
```typescript
- Wagmi (Wallet interaction)
- Viem (Ethereum library)
- Celo (Layer-1 blockchain)
- Hardhat (Contract development)
```

### Farcaster
```typescript
- @farcaster/frame-sdk
- frame-wagmi-connector
```

### Utils
```typescript
- Lucide Icons
- React Query
- Next.js Image Optimization
```

---

## 📊 Métriques de Performance

### Build Size
```
Route (app)                    Size      First Load JS
┌ ○ /                          122 kB    333 kB
└ ○ /leaderboard              1.8 kB    98.5 kB
+ Shared chunks               87.3 kB
```

### Optimisations
- ✅ Static page generation
- ✅ Image optimization (Next.js)
- ✅ Code splitting automatique
- ✅ Tree shaking
- ✅ Minification production

### Temps de Chargement Cibles
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s

---

## 🔒 Sécurité

### Frontend
- ✅ Pas de clés privées
- ✅ Variables publiques prefixées `NEXT_PUBLIC_`
- ✅ Validation des inputs
- ✅ Protection CSRF (Next.js built-in)

### Smart Contract
- ✅ Access control (msg.sender)
- ✅ Validation des paramètres
- ✅ Events pour auditabilité
- ✅ Gas-optimized
- ⚠️ Audit recommandé avant production à grande échelle

### Blockchain
- ✅ Transactions signées par wallet
- ✅ Nonces anti-replay
- ✅ Confirmations attendues
- ✅ Error handling complet

---

## 🌐 Compatibilité

### Navigateurs
- ✅ Chrome/Edge (94+)
- ✅ Firefox (91+)
- ✅ Safari (15+)
- ✅ Mobile browsers

### Wallets
- ✅ MetaMask
- ✅ WalletConnect
- ✅ Coinbase Wallet
- ✅ Trust Wallet
- ✅ Rainbow

### Réseaux
- ✅ Celo Mainnet (chainId: 42220)
- ✅ Celo Alfajores Testnet (chainId: 44787)

---

## 📈 Évolutions Futures

### Court Terme
- [ ] Persistance avec base de données (Postgres)
- [ ] Historique des parties par joueur
- [ ] Badges et achievements
- [ ] Leaderboard hebdomadaire/mensuel

### Moyen Terme
- [ ] Système de saisons
- [ ] Tournois organisés
- [ ] Récompenses CELO tokens
- [ ] NFT badges pour top players

### Long Terme
- [ ] Multi-chain (Base, Optimism, etc.)
- [ ] Gameplay amélioré (multiplicateurs, bonus)
- [ ] Mode multijoueur
- [ ] Intégration DeFi (staking, rewards)

---

## 📱 Distribution

### Farcaster
- Cast promotion
- Frame embedding
- Warpcast mini-app listing

### Web
- Direct URL access
- SEO optimization
- Social sharing

### Mobile
- PWA support
- Add to homescreen
- Offline capabilities (à venir)

---

## 🎓 Documentation

- **README.md** - Introduction et quick start
- **DEPLOYMENT.md** - Guide de déploiement Vercel
- **FEATURES.md** - Ce fichier (fonctionnalités)
- **contracts/README.md** - Documentation smart contract
- **API docs** - Routes API documentées inline

---

## 📞 Ressources

- **Repository:** https://github.com/[your-username]/solo-jackpot
- **Live App:** https://solo-jackpot.vercel.app
- **CeloScan:** https://celoscan.io/address/0x07bc49e8a2baf7c68519f9a61fcd733490061644
- **Farcaster Docs:** https://docs.farcaster.xyz

---

🎰 **Bonne chance et que les cryptos soient avec vous!** 🚀
