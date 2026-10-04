/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SHOPS } from './data/shops';
import { Difficulty, GameResult, HighScores, ShopConfig, ShopId } from './types/game';
import { getHighScores, resetAllHighScores, saveHighScore } from './utils/storage';
import { TitleScreen } from './components/TitleScreen';
import { MarketView } from './components/MarketView';
import { ShopModal } from './components/ShopModal';
import { GameStage } from './components/GameStage';
import { GameOverModal } from './components/GameOverModal';
import { TrophyModal } from './components/TrophyModal';
import { HelpModal } from './components/HelpModal';
import { LandscapeLockOverlay } from './components/LandscapeLockOverlay';

export default function App() {
  const [highScores, setHighScores] = useState<HighScores>(() => getHighScores());
  const [view, setView] = useState<'title' | 'market' | 'game'>('title');

  // Active game session
  const [activeShop, setActiveShop] = useState<ShopConfig | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('easy');

  // Modals state
  const [shopModalOpen, setShopModalOpen] = useState<boolean>(false);
  const [trophyModalOpen, setTrophyModalOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);

  // Result of latest 30-sec session
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  // Sync high scores
  useEffect(() => {
    setHighScores(getHighScores());
  }, []);

  // When clicking a shop card to inspect
  const handleSelectShop = (shop: ShopConfig) => {
    setActiveShop(shop);
    setShopModalOpen(true);
  };

  // Direct 1-click play from shop card
  const handleQuickPlay = (shopId: ShopId, difficulty: Difficulty) => {
    const targetShop = SHOPS.find((s) => s.id === shopId);
    if (!targetShop) return;
    setActiveShop(targetShop);
    setActiveDifficulty(difficulty);
    setView('game');
  };

  // Start game from inside shop modal
  const handleStartGame = (difficulty: Difficulty) => {
    setActiveDifficulty(difficulty);
    setShopModalOpen(false);
    setView('game');
  };

  // 30 seconds ended
  const handleGameOver = (solvedCount: number) => {
    if (!activeShop) return;

    const { isNewRecord, previousBest } = saveHighScore(
      activeShop.id,
      activeDifficulty,
      solvedCount
    );

    // Refresh stored scores
    setHighScores(getHighScores());

    setLastResult({
      shopId: activeShop.id,
      difficulty: activeDifficulty,
      solvedCount,
      isNewRecord,
      previousBest: Math.max(previousBest, solvedCount),
    });

    setGameOverModalOpen(true);
  };

  // Play again same shop & difficulty
  const handlePlayAgain = () => {
    setGameOverModalOpen(false);
    setView('market');
    setTimeout(() => {
      setView('game');
    }, 50);
  };

  // Change difficulty for current shop
  const handleChangeDifficulty = () => {
    setGameOverModalOpen(false);
    setView('market');
    setShopModalOpen(true);
  };

  // Return to market street
  const handleGoHome = () => {
    setGameOverModalOpen(false);
    setShopModalOpen(false);
    setView('market');
  };

  const handleResetScores = () => {
    const fresh = resetAllHighScores();
    setHighScores(fresh);
  };

  const totalBestSolved = Object.values(highScores).reduce(
    (acc, curr) => acc + (curr.easy || 0) + (curr.hard || 0),
    0
  );

  const currentHighScore =
    activeShop && activeDifficulty
      ? highScores[activeShop.id]?.[activeDifficulty] || 0
      : 0;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col fixed inset-0 select-none bg-amber-100">
      {/* 1. Strict Landscape Lock Overlay (Locks UI when orientation is portrait) */}
      <LandscapeLockOverlay />

      {/* 2. Main Fullscreen Arcade Game View */}
      <main className="flex-1 min-h-0 overflow-hidden relative">
        {view === 'title' ? (
          <TitleScreen
            onStartGame={() => setView('market')}
            onOpenTrophy={() => setTrophyModalOpen(true)}
            totalBestSolved={totalBestSolved}
          />
        ) : view === 'market' ? (
          <MarketView
            highScores={highScores}
            onSelectShop={handleSelectShop}
            onQuickPlay={handleQuickPlay}
            onGoTitle={() => setView('title')}
            totalBestSolved={totalBestSolved}
          />
        ) : (
          activeShop && (
            <GameStage
              shop={activeShop}
              difficulty={activeDifficulty}
              highScore={currentHighScore}
              onGameOver={handleGameOver}
              onExit={handleGoHome}
            />
          )
        )}
      </main>

      {/* Shop Detail & Level Picker Modal */}
      {shopModalOpen && activeShop && (
        <ShopModal
          shop={activeShop}
          highScores={highScores}
          onClose={() => setShopModalOpen(false)}
          onStartGame={handleStartGame}
        />
      )}

      {/* 30-Second Game Over Modal */}
      {gameOverModalOpen && activeShop && lastResult && (
        <GameOverModal
          shop={activeShop}
          difficulty={activeDifficulty}
          solvedCount={lastResult.solvedCount}
          isNewRecord={lastResult.isNewRecord}
          bestRecord={lastResult.previousBest}
          onPlayAgain={handlePlayAgain}
          onChangeDifficulty={handleChangeDifficulty}
          onGoHome={handleGoHome}
        />
      )}

      {/* All-Shop Trophy / Records Modal */}
      {trophyModalOpen && (
        <TrophyModal
          highScores={highScores}
          onClose={() => setTrophyModalOpen(false)}
          onReset={handleResetScores}
        />
      )}

      {/* Help / Rules Guide Modal */}
      {helpModalOpen && (
        <HelpModal onClose={() => setHelpModalOpen(false)} />
      )}
    </div>
  );
}
