import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

export const LandscapeLockOverlay: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // If height > width, screen is currently in portrait
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-100 bg-amber-950 flex flex-col items-center justify-center p-6 text-center text-white select-none">
      {/* Animated Phone Rotation Graphic */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-amber-900/80 border-4 border-amber-400 flex items-center justify-center shadow-2xl">
          <Smartphone className="w-16 h-16 text-yellow-300 animate-rotate-device" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-amber-950 p-2 rounded-full shadow-lg">
          <RotateCw className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <div className="inline-block bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-yellow-400/40">
          🎮 รองรับเฉพาะแนวนอน (Landscape Only)
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-heading text-yellow-300 leading-tight">
          กรุณาหมุนอุปกรณ์เป็นแนวนอน
        </h2>

        <p className="text-amber-100 text-sm sm:text-base font-medium leading-relaxed">
          เกมนี้ถูกออกแบบมาในมุมมอง <strong className="text-white underline decoration-yellow-400">แนวนอนเต็มจอ</strong> เพื่อประสบการณ์การเล่นและการกดปุ่มที่สนุกที่สุดสำหรับเด็ก ๆ
        </p>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-amber-300/80 font-mono">
          <span>🔄 หมุนหน้าจอของคุณเพื่อเริ่มเล่นทันที</span>
        </div>
      </div>
    </div>
  );
};
