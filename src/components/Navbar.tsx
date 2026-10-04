import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, Store, Sparkles } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/audio';

interface NavbarProps {
  onOpenTrophy: () => void;
  onOpenHelp: () => void;
  onGoHome: () => void;
  inGame?: boolean;
  totalBestSolved: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTrophy,
  onOpenHelp,
  onGoHome,
  inGame = false,
  totalBestSolved,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <header className="h-[clamp(2.3rem,7.2vh,3.5rem)] px-2 sm:px-4 md:px-6 bg-linear-to-r from-amber-600 via-orange-500 to-amber-600 border-b-2 sm:border-b-4 border-amber-800 flex items-center justify-between shadow-md shrink-0 z-30 select-none">
      {/* Zone 1: Arcade Game Brand Title */}
      <button
        onClick={() => {
          playClick();
          onGoHome();
        }}
        className="flex items-center gap-1.5 sm:gap-2 text-left focus:outline-hidden group cursor-pointer"
      >
        <div className="w-[clamp(1.8rem,5.5vh,2.5rem)] h-[clamp(1.8rem,5.5vh,2.5rem)] rounded-lg sm:rounded-xl bg-amber-900 border-2 border-yellow-300 flex items-center justify-center text-[clamp(1rem,3.2vh,1.5rem)] shadow-inner group-hover:scale-105 transition-transform">
          🏪
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h1 className="text-[clamp(0.8rem,2.5vh,1.1rem)] font-black tracking-wide text-yellow-300 font-heading drop-shadow-sm leading-none">
              ตลาดคณิตคิดเร็ว
            </h1>
            <span className="bg-yellow-400 text-amber-950 text-[9px] font-black px-1 py-0.5 rounded-sm uppercase tracking-wider leading-none">
              30s
            </span>
          </div>
          <span className="text-[10px] text-amber-100 font-medium hidden sm:inline-block leading-tight">
            เกมคณิตศาสตร์แนวนอนสำหรับเด็กประถม
          </span>
        </div>
      </button>

      {/* Zone 2: Global Record Display (Game HUD Meter) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playClick();
            onOpenTrophy();
          }}
          className="flex items-center gap-1.5 bg-amber-900/80 hover:bg-amber-900 border border-yellow-400/80 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-white shadow-inner cursor-pointer transition-colors"
          title="สถิติรวมทุกร้าน"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-300" />
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-yellow-200/90 font-bold hidden xs:inline">สถิติรวม:</span>
            <span className="text-xs sm:text-sm font-black font-mono text-yellow-300 tabular-nums">
              {totalBestSolved}
            </span>
            <span className="text-[10px] text-yellow-200">ข้อ</span>
          </div>
        </button>
      </div>

      {/* Zone 3: Arcade Game Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {inGame && (
          <button
            onClick={() => {
              playClick();
              onGoHome();
            }}
            className="btn-game-yellow px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-amber-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            title="กลับไปที่ตลาด"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">หน้าตลาด</span>
          </button>
        )}

        <button
          onClick={() => {
            playClick();
            onOpenHelp();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-700/80 hover:bg-amber-700 border border-amber-900 text-yellow-200 flex items-center justify-center cursor-pointer transition-colors"
          title="วิธีเล่น"
          aria-label="วิธีเล่น"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleSound}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-700/80 hover:bg-amber-700 border border-amber-900 text-yellow-200 flex items-center justify-center cursor-pointer transition-colors"
          title={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
          aria-label={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
        >
          {soundOn ? (
            <Volume2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <VolumeX className="w-4 h-4 text-amber-300/50" />
          )}
        </button>
      </div>
    </header>
  );
};
