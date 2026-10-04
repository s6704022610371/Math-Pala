import React, { useState } from 'react';
import { Difficulty, HighScores, ShopConfig } from '../types/game';
import { X, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { playClick } from '../utils/audio';

interface ShopModalProps {
  shop: ShopConfig | null;
  highScores: HighScores;
  onClose: () => void;
  onStartGame: (difficulty: Difficulty) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  shop,
  highScores,
  onClose,
  onStartGame,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  if (!shop) return null;

  const currentScores = highScores[shop.id] || { easy: 0, hard: 0 };
  const isMyShop = shop.id === 'myshop';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Arcade Modal Header */}
        <div className={`p-4 bg-linear-to-r ${shop.themeColor.gradient} text-white relative border-b-4 border-black/15`}>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner">
              {shop.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-yellow-200">
                <span>{shop.shopkeeperAvatar} {shop.shopkeeper}</span>
                <span>·</span>
                <span>{shop.topic}</span>
              </div>
              <h2 className="text-xl font-black font-heading leading-tight">{shop.name}</h2>
            </div>
          </div>
        </div>

        {/* Modal Body: Difficulty Chooser */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-amber-50/50">
          <div className="text-center">
            <h3 className="text-base font-black text-slate-900 font-heading">
              เลือกระดับความท้าทาย (จับเวลา 30 วินาที)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              ตอบโจทย์ให้ได้มากที่สุด บันทึกสถิติสูงสุดอัตโนมัติ
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: easy difficulty */}
            <button
              onClick={() => {
                playClick();
                setSelectedDifficulty('easy');
              }}
              className={`p-3.5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                selectedDifficulty === 'easy'
                  ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:border-emerald-200'
              }`}
            >
              {selectedDifficulty === 'easy' && (
                <div className="absolute top-2.5 right-2.5 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{isMyShop ? '🔥' : '🌟'}</span>
                  <span className="font-black text-emerald-800 text-sm font-heading">
                    {shop.easyLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                  {shop.easyDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">สถิติสูงสุด:</span>
                <span className="font-black text-emerald-700 font-mono tabular-nums">
                  {currentScores.easy > 0 ? `${currentScores.easy} ข้อ` : '-'}
                </span>
              </div>
            </button>

            {/* Option 2: hard difficulty */}
            <button
              onClick={() => {
                playClick();
                setSelectedDifficulty('hard');
              }}
              className={`p-3.5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                selectedDifficulty === 'hard'
                  ? 'border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-300'
                  : 'border-slate-200 bg-white hover:border-orange-200'
              }`}
            >
              {selectedDifficulty === 'hard' && (
                <div className="absolute top-2.5 right-2.5 text-orange-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{isMyShop ? '⚡' : '🔥'}</span>
                  <span className="font-black text-orange-800 text-sm font-heading">
                    {shop.hardLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                  {shop.hardDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-orange-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">สถิติสูงสุด:</span>
                <span className="font-black text-orange-700 font-mono tabular-nums">
                  {currentScores.hard > 0 ? `${currentScores.hard} ข้อ` : '-'}
                </span>
              </div>
            </button>
          </div>

          <div className="bg-amber-100/80 rounded-xl p-2.5 border border-amber-300 flex items-center gap-2 text-xs text-amber-950 font-medium">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              ตอบต่อเนื่องใน 30 วินาที ไม่มีหักคะแนน ยิ่งตอบเร็ว ยิ่งทำสถิติได้เยอะ!
            </span>
          </div>
        </div>

        {/* Modal Footer with 3D Arcade Start Button */}
        <div className="p-3.5 bg-white border-t-2 border-amber-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            onClick={() => {
              playClick();
              onStartGame(selectedDifficulty);
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${
              selectedDifficulty === 'easy' && !isMyShop
                ? 'btn-game-green'
                : 'btn-game-orange text-white'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              เริ่มเกม {selectedDifficulty === 'easy' ? shop.easyLabel : shop.hardLabel} (30 วิ)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
