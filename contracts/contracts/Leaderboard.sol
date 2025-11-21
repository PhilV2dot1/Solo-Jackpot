// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Solo Jackpot Leaderboard
 * @notice On-chain leaderboard for Solo Jackpot game on Celo
 * @dev Stores game sessions and maintains a leaderboard of top scores
 */
contract SoloJackpotLeaderboard {
    struct GameSession {
        uint256 fid;          // Farcaster ID
        address player;       // Player's wallet address
        uint256 score;        // Final score
        uint256 timestamp;    // When the game was played
        bool completed;       // Whether the session is finalized
    }

    // Session storage
    mapping(uint256 => GameSession) public sessions;
    mapping(uint256 => uint256[]) public fidToSessions; // FID => session IDs
    uint256 public sessionCount;

    // Leaderboard storage
    GameSession[] public topScores;
    uint256 public constant MAX_LEADERBOARD_SIZE = 100;

    // Events
    event PartyStarted(uint256 indexed sessionId, uint256 indexed fid, address indexed player);
    event ScoreSubmitted(uint256 indexed sessionId, uint256 indexed fid, uint256 score, uint256 rank);

    /**
     * @notice Start a new game session
     * @param _fid Farcaster ID of the player
     * @return sessionId The ID of the created session
     */
    function startParty(uint256 _fid) external returns (uint256) {
        require(_fid > 0, "Invalid FID");

        uint256 sessionId = sessionCount++;
        sessions[sessionId] = GameSession({
            fid: _fid,
            player: msg.sender,
            score: 0,
            timestamp: block.timestamp,
            completed: false
        });

        fidToSessions[_fid].push(sessionId);

        emit PartyStarted(sessionId, _fid, msg.sender);
        return sessionId;
    }

    /**
     * @notice Submit final score for a game session
     * @param _sessionId The session ID
     * @param _score The final score
     */
    function submitScore(uint256 _sessionId, uint256 _score) external {
        GameSession storage session = sessions[_sessionId];
        require(session.player == msg.sender, "Not session owner");
        require(!session.completed, "Session already completed");
        require(_score > 0, "Score must be positive");

        session.score = _score;
        session.completed = true;

        // Update leaderboard and get rank
        uint256 rank = _updateLeaderboard(session);

        emit ScoreSubmitted(_sessionId, session.fid, _score, rank);
    }

    /**
     * @notice Get top scores from the leaderboard
     * @param _limit Maximum number of entries to return
     * @return Array of top game sessions
     */
    function getTopScores(uint256 _limit) external view returns (GameSession[] memory) {
        uint256 limit = _limit > topScores.length ? topScores.length : _limit;
        GameSession[] memory result = new GameSession[](limit);

        for (uint256 i = 0; i < limit; i++) {
            result[i] = topScores[i];
        }

        return result;
    }

    /**
     * @notice Get all session IDs for a given FID
     * @param _fid Farcaster ID
     * @return Array of session IDs
     */
    function getUserSessions(uint256 _fid) external view returns (uint256[] memory) {
        return fidToSessions[_fid];
    }

    /**
     * @notice Get a specific session
     * @param _sessionId Session ID
     * @return GameSession struct
     */
    function getSession(uint256 _sessionId) external view returns (GameSession memory) {
        return sessions[_sessionId];
    }

    /**
     * @notice Get current leaderboard size
     * @return Number of entries in the leaderboard
     */
    function getLeaderboardSize() external view returns (uint256) {
        return topScores.length;
    }

    /**
     * @dev Internal function to update leaderboard with new score
     * @param newEntry The new game session to potentially add to leaderboard
     * @return rank The rank achieved (0 if not on leaderboard)
     */
    function _updateLeaderboard(GameSession memory newEntry) internal returns (uint256) {
        // If leaderboard not full, add directly
        if (topScores.length < MAX_LEADERBOARD_SIZE) {
            topScores.push(newEntry);
            _sortLeaderboard();
            return _findRank(newEntry.fid, newEntry.timestamp);
        }

        // Check if score qualifies for leaderboard
        if (newEntry.score > topScores[topScores.length - 1].score) {
            topScores[topScores.length - 1] = newEntry;
            _sortLeaderboard();
            return _findRank(newEntry.fid, newEntry.timestamp);
        }

        return 0; // Not on leaderboard
    }

    /**
     * @dev Simple bubble sort for leaderboard (descending order)
     * Note: For production with frequent updates, consider more gas-efficient sorting
     * or off-chain indexing with The Graph
     */
    function _sortLeaderboard() internal {
        uint256 n = topScores.length;
        for (uint256 i = 0; i < n - 1; i++) {
            for (uint256 j = 0; j < n - i - 1; j++) {
                if (topScores[j].score < topScores[j + 1].score) {
                    GameSession memory temp = topScores[j];
                    topScores[j] = topScores[j + 1];
                    topScores[j + 1] = temp;
                }
            }
        }
    }

    /**
     * @dev Find rank of a specific entry in the leaderboard
     * @param _fid Farcaster ID
     * @param _timestamp Timestamp to match specific entry
     * @return rank The rank (1-indexed), or 0 if not found
     */
    function _findRank(uint256 _fid, uint256 _timestamp) internal view returns (uint256) {
        for (uint256 i = 0; i < topScores.length; i++) {
            if (topScores[i].fid == _fid && topScores[i].timestamp == _timestamp) {
                return i + 1; // 1-indexed rank
            }
        }
        return 0;
    }
}
