import React from 'react';
import { X, Clock, HelpCircle, Trophy } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-amber-600 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b-4 border-black/15">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-300" />
            <h2 className="text-lg font-black font-heading text-yellow-300 leading-tight">
              วิธีเล่นเกมตลาดคณิต
            </h2>
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-amber-50/50 text-slate-700 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border-2 border-amber-200">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-black text-slate-900 font-heading">
                เลือกร้านค้าที่ต้องการเล่น
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                มี 5 ร้านค้า: ร้านผลไม้ (บวก/ลบ), ร้านเครื่องดื่ม (คูณ), ร้านขนม (หาร), ร้านเสื้อผ้า (ร้อยละ) และร้านของฉัน (ผสม 4 ร้าน & กำไรขาดทุน)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border-2 border-amber-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-black text-slate-900 font-heading">
                เลือกระดับความท้าทาย
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                ร้านทั่วไปมีระดับ <strong>ง่าย</strong> และ <strong>ยาก</strong> ส่วนร้านของฉันเป็นด่านรวมมิตร มีระดับ <strong>ยาก</strong> และ <strong>ยากมาก</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border-2 border-amber-200">
            <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-black text-slate-900 font-heading flex items-center gap-1">
                จับเวลา 30 วินาที
                <Clock className="w-4 h-4 text-orange-600" />
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                เมื่อเริ่มเกม ให้ตอบตัวเลือกที่ถูกต้องให้ได้มากที่สุด สามารถกดปุ่มบนหน้าจอ หรือกดแป้นคีย์บอร์ดเลข [1] [2] [3] [4] ได้เลย!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border-2 border-amber-200">
            <div className="w-7 h-7 rounded-xl bg-yellow-500 text-amber-950 flex items-center justify-center font-black text-sm shrink-0">
              4
            </div>
            <div>
              <h4 className="font-black text-slate-900 font-heading flex items-center gap-1">
                ไม่มีหักคะแนน บันทึกสถิติสูงสุด
                <Trophy className="w-4 h-4 text-amber-600" />
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                เล่นได้สบายใจ ไม่มีความกดดัน ระบบจะบันทึกจำนวนข้อที่ทำได้มากที่สุดเก็บไว้เป็นสถิติสูงสุดของคุณเสมอ
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-amber-200 flex justify-end">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="btn-game-yellow px-5 py-2 rounded-xl text-amber-950 font-black text-xs cursor-pointer"
          >
            เข้าใจแล้ว เริ่มเลย!
          </button>
        </div>
      </div>
    </div>
  );
};
