import React from 'react';
import { Play, Trophy, Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import { playClick, isSoundEnabled, toggleSound } from '../utils/audio';
import titleMarketSceneImg from '../assets/images/title_market_scene_1791100104889.jpg';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenTrophy: () => void;
  totalBestSolved: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenTrophy,
  totalBestSolved,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none flex flex-col justify-between items-center bg-sky-300">
      {/* 2D Cartoon Market Background Illustration */}
      <div className="absolute inset-0 z-0">
        <img
          src={titleMarketSceneImg}
          alt="ฉากตลาดการ์ตูน Math ปะละ"
          className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.05]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Soft cartoon vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/35 pointer-events-none" />
      </div>

      {/* Decorative Hanging Bunting Flags across the top */}
      <div className="relative z-10 w-full flex items-center justify-around overflow-hidden py-1 pointer-events-none">
        {['🚩', '🟡', '🔷', '🟢', '🔶', '🟣', '🔴', '⭐', '🚩', '🟡', '🔷', '🟢', '🔶', '🟣'].map((item, idx) => (
          <span
            key={idx}
            className="text-base sm:text-xl drop-shadow-sm animate-bounce-subtle"
            style={{ animationDelay: `${(idx % 5) * 0.25}s` }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Top Controls: Total Score & Sound only */}
      <div className="relative z-10 w-full px-3 sm:px-6 flex items-center justify-between">
        <button
          onClick={() => {
            playClick();
            onOpenTrophy();
          }}
          className="btn-game-yellow flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-amber-950 font-black shadow-md cursor-pointer transition-transform active:scale-95"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] sm:text-xs">สถิติรวม:</span>
            <span className="text-sm sm:text-base font-black font-mono tabular-nums">
              {totalBestSolved}
            </span>
            <span className="text-[10px] sm:text-xs">ข้อ</span>
          </div>
        </button>

        <button
          onClick={handleToggleSound}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-950/85 hover:bg-amber-900 border-2 sm:border-3 border-yellow-400 text-yellow-300 flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-95"
          title={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
          aria-label={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
        >
          {soundOn ? (
            <Volume2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-amber-300/50" />
          )}
        </button>
      </div>

      {/* Center Zone: Game Title Logo only */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4">
        {/* Decorative Stars */}
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-5 -left-8 text-yellow-300 text-2xl sm:text-3xl animate-bounce-subtle">
            ✨
          </div>
          <div
            className="absolute -top-4 -right-8 text-yellow-300 text-2xl sm:text-3xl animate-bounce-subtle"
            style={{ animationDelay: '0.4s' }}
          >
            🌟
          </div>

          {/* Big Game Title: "Math ปะละ" */}
          <div className="py-1">
            <h1
              className="text-[clamp(2.6rem,11.5vh,5rem)] font-black tracking-wider font-heading leading-none text-white"
              style={{
                WebkitTextStroke: 'clamp(3px, 0.7vh, 5px) #451a03',
                textShadow: '0 8px 0 #78350f, 0 14px 20px rgba(0,0,0,0.5)',
              }}
            >
              <span className="text-yellow-300">Math</span>{' '}
              <span className="text-orange-400">ปะละ</span>
            </h1>
          </div>

          {/* Subtitle Ribbon: "ตลาดคณิตคิดเร็ว" */}
          <div className="mt-1 sm:mt-2">
            <div className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 border-3 border-amber-950 px-5 sm:px-7 py-1 rounded-full shadow-[0_4px_0_#78350f,0_8px_12px_rgba(0,0,0,0.3)] flex items-center gap-2 transform -rotate-1">
              <Star className="w-4 h-4 text-amber-950 fill-current" />
              <span className="text-[clamp(0.85rem,2.8vh,1.25rem)] font-black text-amber-950 font-heading tracking-wide">
                ตลาดคณิตคิดเร็ว
              </span>
              <Star className="w-4 h-4 text-amber-950 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Big "เริ่มเกม" Button */}
      <div className="relative z-10 w-full pb-4 sm:pb-6 px-4 flex flex-col items-center gap-1 shrink-0">
        <button
          onClick={() => {
            playClick();
            onStartGame();
          }}
          className="btn-game-green px-10 sm:px-14 py-[clamp(0.6rem,2.2vh,1rem)] rounded-2xl sm:rounded-3xl text-white font-black text-[clamp(1.2rem,4.2vh,1.8rem)] font-heading flex items-center gap-3 shadow-[0_6px_0_#065f46,0_12px_22px_rgba(0,0,0,0.4)] cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
        >
          <Play className="w-7 h-7 fill-current text-yellow-200 animate-pulse" />
          <span className="tracking-wider drop-shadow-sm">เริ่มเกม</span>
          <Sparkles className="w-6 h-6 text-yellow-200" />
        </button>
      </div>
    </div>
  );
};
