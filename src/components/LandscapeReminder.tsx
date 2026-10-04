import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, X } from 'lucide-react';

export const LandscapeReminder: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if mobile device and in portrait
      const isMobile = window.innerWidth <= 768;
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs sticky top-16 z-25">
      <div className="flex items-center gap-2 font-medium">
        <Smartphone className="w-4 h-4 rotate-90 shrink-0 animate-bounce-subtle" />
        <span>แนะนำหมุนหน้าจอเป็น <strong>แนวนอน</strong> เพื่อมองเห็นร้านค้าได้เต็มตาและกดง่ายขึ้นนะจ๊ะ!</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-600 rounded-md transition-colors ml-2 cursor-pointer"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
