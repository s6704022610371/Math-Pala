import React, { useEffect, useRef } from 'react';
import { Difficulty, ShopConfig } from '../types/game';
import { Trophy, RotateCcw, Store, Sparkles, SlidersHorizontal } from 'lucide-react';
import { playClick, playTimeUp } from '../utils/audio';

interface GameOverModalProps {
  shop: ShopConfig;
  difficulty: Difficulty;
  solvedCount: number;
  isNewRecord: boolean;
  bestRecord: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  shop,
  difficulty,
  solvedCount,
  isNewRecord,
  bestRecord,
  onPlayAgain,
  onChangeDifficulty,
  onGoHome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    playTimeUp();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#f87171'];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
    }[] = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.vx *= 0.98;
        p.rotation += p.vRot;

        if (p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const difficultyLabel = difficulty === 'easy' ? shop.easyLabel : shop.hardLabel;

  let cheerTitle = 'เก่งมาก ๆ เลย!';
  let cheerDescription = 'ฝึกฝนบ่อย ๆ จะคิดเลขได้ไวยิ่งขึ้นนะ!';

  if (solvedCount >= 15) {
    cheerTitle = 'อัจฉริยะคิดเลขเร็วตัวจริง! 👑';
    cheerDescription = 'ว้าว! ตอบได้รวดเร็วและแม่นยำมาก สุดยอดไปเลย!';
  } else if (solvedCount >= 10) {
    cheerTitle = 'ยอดนักคิดเลขตัวย้อย! 🌟';
    cheerDescription = 'ทำโจทย์ได้เยอะมาก ไหวพริบยอดเยี่ยมจริง ๆ!';
  } else if (solvedCount >= 5) {
    cheerTitle = 'ยอดเยี่ยมมากเลย! 🎉';
    cheerDescription = 'ทำได้ดีมาก ความพยายามยอดเยี่ยมที่สุด!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 w-full h-full"
      />

      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-yellow-400 overflow-hidden shadow-2xl z-20 flex flex-col relative text-center">
        {/* Banner */}
        <div
          className={`p-4 sm:p-5 bg-linear-to-r ${shop.themeColor.gradient} text-white relative flex flex-col items-center justify-center border-b-4 border-black/15`}
        >
          <div className="text-4xl sm:text-5xl mb-1 animate-bounce-subtle">
            {isNewRecord ? '🏆' : '🎉'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading leading-tight">
            หมดเวลา 30 วินาทีแล้วจ้า!
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-yellow-200 font-bold mt-1">
            <span>{shop.icon} {shop.name}</span>
            <span>·</span>
            <span>{difficultyLabel}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-amber-50/50">
          {isNewRecord && (
            <div className="bg-yellow-300 text-amber-950 font-black text-xs sm:text-sm py-2 px-3 rounded-xl border-2 border-yellow-500 flex items-center justify-center gap-1.5 animate-pulse shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>ยินดีด้วย! คุณทำสถิติสูงสุดใหม่สำเร็จ!</span>
              <Sparkles className="w-4 h-4 text-amber-900" />
            </div>
          )}

          {/* Solved Count Display Box */}
          <div className="bg-amber-950 border-3 border-yellow-400 rounded-2xl p-4 text-white shadow-inner">
            <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider block">
              จำนวนข้อที่ทำได้ในรอบนี้
            </span>
            <div className="flex items-baseline justify-center gap-2 mt-1">
              <span className="text-5xl sm:text-6xl font-black text-yellow-400 font-mono tabular-nums leading-none">
                {solvedCount}
              </span>
              <span className="text-base font-bold text-yellow-200">ข้อ</span>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-amber-800 flex items-center justify-center gap-2 text-xs text-amber-200">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>สถิติสูงสุดของคุณ:</span>
              <span className="font-black text-yellow-300 font-mono tabular-nums text-sm">
                {bestRecord} ข้อ
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800 font-heading">
              {cheerTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{cheerDescription}</p>
          </div>

          {/* Arcade 3D Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                playClick();
                onPlayAgain();
              }}
              className="btn-game-yellow py-2.5 px-3 rounded-xl text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เล่นอีกครั้ง</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onChangeDifficulty();
              }}
              className="btn-game-white py-2.5 px-3 rounded-xl text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>เปลี่ยนระดับ</span>
            </button>
          </div>

          <button
            onClick={() => {
              playClick();
              onGoHome();
            }}
            className="w-full py-2 text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>กลับไปเลือกด่านที่ตลาดนัด</span>
          </button>
        </div>
      </div>
    </div>
  );
};
