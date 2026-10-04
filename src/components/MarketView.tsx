import React, { useState } from 'react';
import { SHOPS } from '../data/shops';
import { Difficulty, HighScores, ShopConfig, ShopId } from '../types/game';
import { Home, Trophy, Volume2, VolumeX, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { playClick, isSoundEnabled, toggleSound } from '../utils/audio';

interface MarketViewProps {
  highScores: HighScores;
  onSelectShop?: (shop: ShopConfig) => void;
  onQuickPlay: (shopId: ShopId, difficulty: Difficulty) => void;
  onGoTitle: () => void;
  totalBestSolved: number;
}

export const MarketView: React.FC<MarketViewProps> = ({
  highScores,
  onQuickPlay,
  onGoTitle,
  totalBestSolved,
}) => {
  const [selectedShopId, setSelectedShopId] = useState<ShopId>('fruit');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const currentShop = SHOPS.find((s) => s.id === selectedShopId) || SHOPS[0];
  const currentScores = highScores[currentShop.id] || { easy: 0, hard: 0 };
  const isMyShop = currentShop.id === 'myshop';

  const handleShopClick = (shopId: ShopId) => {
    playClick();
    setSelectedShopId(shopId);
  };

  const handleStartGame = () => {
    playClick();
    onQuickPlay(selectedShopId, selectedDifficulty);
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden select-none bg-linear-to-b from-sky-300 via-sky-100 to-amber-100 flex flex-col justify-between relative">
      {/* 1. Daytime Sky Atmosphere with Animated Floating Clouds */}
      <div className="absolute top-1 inset-x-0 flex justify-between px-6 pointer-events-none opacity-80 z-0">
        <span className="text-xl sm:text-3xl animate-bounce-subtle" style={{ animationDuration: '4s' }}>
          ☁️
        </span>
        <span className="text-lg sm:text-2xl animate-bounce-subtle" style={{ animationDuration: '6s', animationDelay: '1s' }}>
          ☁️
        </span>
        <span className="text-xl sm:text-3xl animate-bounce-subtle" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          ☁️
        </span>
      </div>

      {/* 2. Top Bar (Header): Budgeted ~6vh max 34px */}
      <header className="relative z-20 h-[clamp(26px,6vh,34px)] px-2 sm:px-4 flex items-center justify-between shrink-0 pt-0.5">
        {/* 1) ปุ่มกลับบ้าน */}
        <button
          onClick={() => {
            playClick();
            onGoTitle();
          }}
          className="btn-game-yellow px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl text-amber-950 font-black text-[clamp(10px,1.9vh,12px)] flex items-center gap-1 shadow-xs cursor-pointer transition-transform active:scale-95"
          title="กลับหน้าเริ่มเกม"
        >
          <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-900" />
          <span>หน้าแรก</span>
        </button>

        {/* 2) สถิติรวม */}
        <div className="bg-amber-950/90 border-2 border-yellow-400 px-2.5 sm:px-3.5 py-0.5 rounded-xl text-white shadow-xs flex items-center gap-1.5">
          <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 animate-pulse" />
          <div className="flex items-baseline gap-1">
            <span className="text-[9px] sm:text-[11px] text-yellow-200 font-bold">สถิติรวม:</span>
            <span className="text-[11px] sm:text-sm font-black font-mono text-yellow-300 tabular-nums">
              {totalBestSolved}
            </span>
            <span className="text-[9px] sm:text-[11px] text-yellow-200">ข้อ</span>
          </div>
        </div>

        {/* 3) ปุ่มเสียง */}
        <button
          onClick={handleToggleSound}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-950/90 hover:bg-amber-900 border-2 border-yellow-400 text-yellow-300 flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95"
          title={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
          aria-label={soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
        >
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300/50" />
          )}
        </button>
      </header>

      {/* 3. Hanging Party Bunting Flags Rope - Budgeted ~2vh */}
      <div className="relative z-10 w-full flex items-center justify-around py-0 pointer-events-none opacity-90 overflow-hidden shrink-0 h-[clamp(12px,2.2vh,18px)]">
        {['🚩', '🟡', '🔷', '🟢', '🔶', '🟣', '🔴', '⭐', '🚩', '🟡', '🔷', '🟢', '🔶', '🟣', '🔴'].map((flag, idx) => (
          <span
            key={idx}
            className="text-[10px] sm:text-xs drop-shadow-xs animate-bounce-subtle"
            style={{ animationDelay: `${(idx % 4) * 0.3}s` }}
          >
            {flag}
          </span>
        ))}
      </div>

      {/* 4. Middle Stage: Auto-Scaled 5 Shop Stalls & Cobblestone Street - Budgeted ~58vh to 62vh */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end items-center px-1 sm:px-2.5 overflow-hidden">
        {/* Full Width Grid: Distribute 5 shops across the screen width, dynamically constrained by container height */}
        <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2.5 items-end justify-center z-10 h-full max-h-[58vh] pb-0.5">
          {SHOPS.map((shop) => {
            const isSelected = shop.id === selectedShopId;
            const score = highScores[shop.id] || { easy: 0, hard: 0 };

            return (
              <button
                key={shop.id}
                onClick={() => handleShopClick(shop.id)}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 focus:outline-hidden relative group w-full h-full justify-end ${
                  isSelected
                    ? '-translate-y-2 sm:-translate-y-3 scale-102 sm:scale-104 z-20'
                    : 'hover:-translate-y-1 opacity-95 hover:opacity-100 z-10'
                }`}
              >
                {/* Glowing Ground Spotlight Ring for selected shop */}
                {isSelected && (
                  <div className="absolute -bottom-1.5 inset-x-1 h-3 sm:h-4 bg-yellow-400/80 rounded-full blur-xs animate-pulse -z-10" />
                )}

                {/* Animated Speech Bubble above selected shop */}
                {isSelected && (
                  <div className="absolute -top-5 sm:-top-6 bg-yellow-300 border-2 border-amber-950 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black text-amber-950 shadow-xs animate-bounce-subtle flex items-center gap-0.5 z-30 whitespace-nowrap">
                    <span>{shop.shopkeeperAvatar}</span>
                    <span>ร้านนี้เลย!</span>
                  </div>
                )}

                {/* Scaled Shop Card - Fully Adaptive within Available Stage Height */}
                <div
                  className={`w-full h-full rounded-xl sm:rounded-2xl border-2 sm:border-3 border-amber-950 overflow-hidden shadow-md transition-all flex flex-col justify-between bg-white ${
                    isSelected ? 'ring-2 sm:ring-3 ring-yellow-400 shadow-xl' : 'hover:border-amber-900'
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? '0 6px 0 #78350f, 0 10px 18px rgba(0,0,0,0.3)'
                      : '0 3px 0 #78350f, 0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Awning Roof Stripe */}
                  <div
                    className={`h-[clamp(5px,1.2vh,8px)] w-full bg-linear-to-r ${shop.themeColor.gradient} flex items-center justify-around border-b border-black/10 shrink-0`}
                  >
                    <div className="w-1 h-full bg-white/40 skew-x-12"></div>
                    <div className="w-1 h-full bg-white/40 skew-x-12"></div>
                    <div className="w-1 h-full bg-white/40 skew-x-12"></div>
                  </div>

                  {/* Shop Name Header */}
                  <div className="py-0.5 px-0.5 text-center bg-amber-50/90 border-b border-amber-200 shrink-0">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="text-[10px] sm:text-xs">{shop.icon}</span>
                      <span className="text-[clamp(9px,1.8vh,12px)] font-black text-amber-950 font-heading leading-tight truncate">
                        {shop.shortName}
                      </span>
                    </div>
                  </div>

                  {/* Adaptive Image Container: Flexible height with object-cover, zero overflow */}
                  <div className="relative flex-1 min-h-0 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-linear-to-br from-amber-100 to-amber-200 items-center justify-center flex-col text-center p-1">
                      <span className="text-2xl">{shop.icon}</span>
                      <span className="text-[10px] font-bold text-amber-900 mt-0.5">{shop.name}</span>
                    </div>
                  </div>

                  {/* Shop Info Below Image */}
                  <div className="p-0.5 sm:p-1 bg-amber-50/90 border-t border-amber-200/90 flex flex-col gap-0.5 shrink-0">
                    <div className="flex items-center justify-between text-[clamp(8px,1.4vh,10px)] font-bold text-slate-800 px-0.5">
                      <span className="truncate">{shop.shopkeeperAvatar} {shop.shopkeeper}</span>
                      <span className="bg-amber-200/90 text-amber-950 px-1 py-0.2 rounded text-[8px] sm:text-[9px] shrink-0 font-black">
                        {shop.topic}
                      </span>
                    </div>

                    <div className="w-full bg-white border border-amber-200 rounded py-0.2 sm:py-0.5 px-0.5 flex items-center justify-around text-[clamp(8px,1.3vh,9.5px)] font-black text-amber-950">
                      <span className="text-emerald-700 truncate">
                        {shop.easyBadge}: {score.easy > 0 ? `${score.easy}` : '-'}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-orange-700 truncate">
                        {shop.hardBadge}: {score.hard > 0 ? `${score.hard}` : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stall Shadow on Cobblestone */}
                <div className="w-4/5 h-1.5 bg-black/25 rounded-full blur-[1px] mt-0.5" />
              </button>
            );
          })}
        </div>

        {/* Cobblestone Paved Street (ถนนปูหิน) - Budgeted ~3vh */}
        <div className="w-full h-[clamp(14px,3vh,20px)] bg-linear-to-b from-stone-400 via-stone-500 to-stone-600 border-t-2 border-amber-950 rounded-t-lg shadow-inner relative overflow-hidden flex items-center justify-around px-4 shrink-0">
          <div className="w-full flex justify-between opacity-40 pointer-events-none">
            {['🪨', '🔘', '🪨', '🔘', '🪨', '🔘', '🪨', '🔘', '🪨', '🔘', '🪨', '🔘'].map((stone, idx) => (
              <span key={idx} className="text-[9px] sm:text-[10px]">
                {stone}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Auto-Scaled Floating In-Game Bottom Card: Budgeted ~25vh to 28vh (Strictly fit in 1 screen) */}
      <div className="relative z-30 w-[98%] max-w-5xl mx-auto mb-1 h-[clamp(58px,26vh,105px)] bg-amber-950 border-2 sm:border-3 border-amber-900 rounded-xl sm:rounded-2xl p-1 sm:p-2 text-white shadow-[0_4px_0_#451a03,0_8px_16px_rgba(0,0,0,0.35)] flex flex-row items-center justify-between gap-1.5 sm:gap-2.5 shrink-0 overflow-hidden">
        {/* Left: Selected Shop Profile & Topic */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-[25%] sm:max-w-[28%]">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-900 border-2 border-yellow-400 flex items-center justify-center text-xl sm:text-2xl shadow-xs shrink-0">
            {currentShop.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="bg-yellow-400 text-amber-950 text-[8px] sm:text-[10px] font-black px-1 py-0.2 rounded shrink-0">
                {currentShop.shopkeeperAvatar} {currentShop.shopkeeper}
              </span>
              <h3 className="text-yellow-300 text-[10px] sm:text-xs font-black font-heading leading-tight truncate">
                {currentShop.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] sm:text-[10px] text-amber-200 font-bold shrink-0">ฝึก:</span>
              <span className="bg-amber-900 border border-yellow-400/60 text-yellow-300 px-1 py-0.2 rounded text-[9px] sm:text-[10px] font-black truncate">
                {currentShop.topic}
              </span>
            </div>
          </div>
        </div>

        {/* Center: The 2 Level Buttons WITH FULL ORIGINAL DESCRIPTIONS (Always in row, compact & high contrast) */}
        <div className="flex-1 min-w-0 grid grid-cols-2 gap-1 sm:gap-1.5 h-full max-w-xl">
          {/* Level 1 Button (ง่าย หรือ ยาก สำหรับร้านของฉัน) */}
          <button
            onClick={() => {
              playClick();
              setSelectedDifficulty('easy');
            }}
            className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-full overflow-hidden ${
              selectedDifficulty === 'easy'
                ? isMyShop
                  ? 'bg-orange-600 border-yellow-300 ring-2 ring-yellow-400 text-white shadow-xs'
                  : 'bg-emerald-600 border-yellow-300 ring-2 ring-yellow-400 text-white shadow-xs'
                : 'bg-amber-900/90 border-amber-700 hover:bg-amber-800 text-white/90'
            }`}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-0.5 font-black text-[9px] sm:text-xs text-yellow-200 truncate">
                <span>{isMyShop ? '🔥' : '🌟'}</span>
                <span>{currentShop.easyLabel}</span>
              </div>
              {selectedDifficulty === 'easy' && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-yellow-300 shrink-0" />}
            </div>
            {/* FULL DESCRIPTION - HIGH CONTRAST */}
            <p className="text-[8px] sm:text-[10px] font-bold text-white line-clamp-2 my-0.2 leading-tight">
              {currentShop.easyDesc}
            </p>
            <div className="text-[8px] sm:text-[9.5px] font-black text-yellow-300 truncate shrink-0">
              สถิติ: {currentScores.easy > 0 ? `${currentScores.easy} ข้อ` : 'ยังไม่มีสถิติ'}
            </div>
          </button>

          {/* Level 2 Button (ยาก หรือ ยากมาก สำหรับร้านของฉัน - ร้านเครื่องดื่มแสดง "ระดับยาก" เท่านั้น) */}
          <button
            onClick={() => {
              playClick();
              setSelectedDifficulty('hard');
            }}
            className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-full overflow-hidden ${
              selectedDifficulty === 'hard'
                ? isMyShop
                  ? 'bg-red-600 border-yellow-300 ring-2 ring-yellow-400 text-white shadow-xs'
                  : 'bg-orange-600 border-yellow-300 ring-2 ring-yellow-400 text-white shadow-xs'
                : 'bg-amber-900/90 border-amber-700 hover:bg-amber-800 text-white/90'
            }`}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-0.5 font-black text-[9px] sm:text-xs text-yellow-200 truncate">
                <span>{isMyShop ? '⚡' : '🔥'}</span>
                <span>{currentShop.hardLabel}</span>
              </div>
              {selectedDifficulty === 'hard' && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-yellow-300 shrink-0" />}
            </div>
            {/* FULL DESCRIPTION - HIGH CONTRAST */}
            <p className="text-[8px] sm:text-[10px] font-bold text-white line-clamp-2 my-0.2 leading-tight">
              {currentShop.hardDesc}
            </p>
            <div className="text-[8px] sm:text-[9.5px] font-black text-yellow-300 truncate shrink-0">
              สถิติ: {currentScores.hard > 0 ? `${currentScores.hard} ข้อ` : 'ยังไม่มีสถิติ'}
            </div>
          </button>
        </div>

        {/* Right: Giant Cartoon "เริ่มเล่น (30 วิ)" Button */}
        <div className="shrink-0 flex items-center h-full">
          <button
            onClick={handleStartGame}
            className="btn-game-yellow px-3 sm:px-6 py-1.5 sm:py-2.5 h-[80%] max-h-[55px] rounded-xl sm:rounded-2xl text-amber-950 font-black text-[clamp(11px,2.2vh,14px)] font-heading flex items-center justify-center gap-1 shadow-xs cursor-pointer transform hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-950" />
            <span className="whitespace-nowrap">เริ่มเล่น (30 วิ)</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-800" />
          </button>
        </div>
      </div>
    </div>
  );
};
