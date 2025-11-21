# 🎰 Solo Jackpot - Farcaster Mini-App

A fun and engaging jackpot game built as a Farcaster Mini-App with dual gameplay modes: **Free Play** (off-chain) and **On-Chain** (Celo blockchain).

## ✨ Features

- 🎮 **Dual Game Modes**
  - **Free Play**: Unlimited spins, off-chain gameplay
  - **On-Chain**: Blockchain-backed gameplay on Celo network

- 🎡 **Interactive Spinning Wheel**
  - Beautiful Canvas-based wheel animation
  - 8 different outcome segments
  - Jackpot prizes up to 1000 points

- 🏆 **Leaderboard System**
  - Separate leaderboards for Free Play and On-Chain modes
  - Real-time rankings
  - Track high scores and total games played

- 🔗 **Blockchain Integration**
  - Smart contract deployed on Celo
  - Wallet connection via Farcaster Frame Connector
  - Gas-efficient leaderboard storage

- 📱 **Social Features**
  - Share scores directly to Farcaster
  - Integrated with Farcaster Mini-App SDK
  - Automatic user authentication via FID

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Celo, Wagmi, Viem, Hardhat
- **Farcaster**: @farcaster/frame-sdk, frame-wagmi-connector
- **Animations**: Framer Motion
- **State Management**: @tanstack/react-query

## 📁 Project Structure

```
solo-jackpot/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for free play
│   ├── leaderboard/       # Leaderboard page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main game page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── JackpotWheel.tsx   # Spinning wheel
│   ├── SpinButton.tsx     # Spin action button
│   ├── ResultDisplay.tsx  # Result animation
│   ├── Leaderboard.tsx    # Leaderboard display
│   ├── WalletConnect.tsx  # Wallet connection
│   ├── FarcasterShare.tsx # Social sharing
│   ├── ModeToggle.tsx     # Game mode switcher
│   └── providers.tsx      # Context providers
├── hooks/                 # Custom React hooks
│   └── useGame.ts         # Game logic hook
├── lib/                   # Utilities
│   ├── wagmi.ts           # Wagmi configuration
│   ├── farcaster.ts       # Farcaster SDK setup
│   └── utils.ts           # Helper functions
└── contracts/             # Smart contracts
    ├── contracts/
    │   └── Leaderboard.sol # On-chain leaderboard
    ├── scripts/
    │   └── deploy.js       # Deployment script
    └── hardhat.config.js   # Hardhat configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Celo wallet with testnet tokens (for on-chain mode)
- Farcaster account (for testing in Farcaster)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd solo-jackpot
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:3000`
   - Or test in Farcaster client for full mini-app experience

### Smart Contract Deployment

1. **Setup environment variables**:
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   ```

2. **Deploy to Celo Alfajores (Testnet)**:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network alfajores
   ```

3. **Deploy to Celo Mainnet**:
   ```bash
   npx hardhat run scripts/deploy.js --network celo
   ```

4. **Update frontend with contract address**:
   - Copy the deployed contract address
   - Add to your frontend `.env.local`:
     ```
     NEXT_PUBLIC_LEADERBOARD_ADDRESS=<deployed_address>
     NEXT_PUBLIC_CHAIN_ID=44787  # or 42220 for mainnet
     ```

## 🎮 How to Play

### Free Play Mode
1. Click "Free Play" mode toggle
2. Press the "SPIN" button
3. Watch the wheel spin and see your result!
4. Share your score on Farcaster
5. Check the leaderboard to see your rank

### On-Chain Mode
1. Click "On-Chain" mode toggle
2. Connect your wallet via Farcaster
3. Start a party (creates a game session on-chain)
4. Press "SPIN" to play
5. Your score is recorded on the Celo blockchain
6. View on-chain leaderboard

## 📊 Game Mechanics

### Wheel Segments
- **10 points**: 25% chance
- **25 points**: 20% chance
- **50 points**: 15% chance
- **100 points**: 15% chance (Silver badge)
- **250 points**: 10% chance
- **500 points**: 8% chance (Gold badge)
- **1000 points (JACKPOT!)**: 2% chance
- **0 points**: 5% chance

### Scoring
- Points accumulate across spins
- High score is tracked for leaderboard
- Badges awarded for special achievements

## 🔒 Smart Contract

The `SoloJackpotLeaderboard` contract provides:

- `startParty(fid)`: Initialize a game session
- `submitScore(sessionId, score)`: Record final score on-chain
- `getTopScores(limit)`: Retrieve leaderboard entries
- `getUserSessions(fid)`: Get all sessions for a Farcaster ID

**Contract Features**:
- Gas-optimized storage
- Top 100 leaderboard maintained on-chain
- Events for indexing
- FID-based player identification

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Import your GitHub repository
   - Set environment variables
   - Deploy

3. **Environment Variables**:
   ```
   NEXT_PUBLIC_LEADERBOARD_ADDRESS=<contract_address>
   NEXT_PUBLIC_CHAIN_ID=42220
   ```

### Register as Farcaster Mini-App

1. Visit Farcaster Mini-App submission portal
2. Provide your app URL
3. Add metadata (name, description, icon)
4. Submit for review

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test in Farcaster:
# Use Farcaster developer tools or actual client
```

## 📝 Future Enhancements

- [ ] Add more wheel segments and outcomes
- [ ] Implement daily spin limits
- [ ] Add collectible NFTs
- [ ] Multi-player tournaments
- [ ] Seasonal leaderboards
- [ ] Token rewards (requires tokenomics design)
- [ ] The Graph indexer for efficient leaderboard queries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with [Farcaster Mini-App SDK](https://miniapps.farcaster.xyz/)
- Powered by [Celo](https://celo.org/)
- UI components inspired by modern casino aesthetics

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Contact via Farcaster: @yourusername

---

**Made with ❤️ for the Farcaster and Celo communities**

🎰 **Spin to Win!** 🎰
