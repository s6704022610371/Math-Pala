import React from 'react';
import { SHOPS } from '../data/shops';
import { HighScores } from '../types/game';
import { Trophy, X, Sparkles, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/audio';

interface TrophyModalProps {
  highScores: HighScores;
  onClose: () => void;
  onReset: () => void;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({
  highScores,
  onClose,
  onReset,
}) => {
  const totalSolved = Object.values(highScores).reduce(
    (acc, curr) => acc + (curr.easy || 0) + (curr.hard || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-amber-600 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b-4 border-black/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-900 border-2 border-yellow-300 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h2 className="text-lg font-black font-heading text-yellow-300 leading-tight">
                ทำเนียบสถิติสูงสุด
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                จำนวนข้อที่ทำได้มากที่สุดในเวลา 30 วินาที
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-amber-50/50">
          <div className="bg-amber-950 border-2 border-yellow-400 rounded-2xl p-3 text-white flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-xs sm:text-sm font-black text-yellow-200">
                รวมข้อที่ทำได้สูงสุดทั้งหมด:
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tabular-nums">
              {totalSolved} ข้อ
            </span>
          </div>

          {/* List of 5 Shops */}
          <div className="space-y-2">
            {SHOPS.map((shop) => {
              const score = highScores[shop.id] || { easy: 0, hard: 0 };
              const isMyShop = shop.id === 'myshop';

              return (
                <div
                  key={shop.id}
                  className="bg-white rounded-xl p-2.5 sm:p-3 border-2 border-amber-200 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl p-1 bg-amber-50 rounded-xl border border-amber-200 shrink-0">
                      {shop.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 font-heading truncate">
                        {shop.name}
                      </h4>
                      <span className="text-[11px] text-amber-800 font-medium block truncate">
                        {shop.topic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-center min-w-[58px]">
                      <span className="text-[9px] text-emerald-800 block font-bold">
                        {shop.easyBadge}
                      </span>
                      <span className="text-xs font-black text-emerald-900 font-mono tabular-nums">
                        {score.easy > 0 ? `${score.easy} ข้อ` : '-'}
                      </span>
                    </div>

                    <div className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-200 text-center min-w-[58px]">
                      <span className="text-[9px] text-orange-800 block font-bold">
                        {shop.hardBadge}
                      </span>
                      <span className="text-xs font-black text-orange-900 font-mono tabular-nums">
                        {score.hard > 0 ? `${score.hard} ข้อ` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-amber-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตสถิติทั้งหมดใช่หรือไม่?')) {
                playClick();
                onReset();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างสถิติ</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="btn-game-yellow px-5 py-2 rounded-xl text-amber-950 font-black text-xs cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
