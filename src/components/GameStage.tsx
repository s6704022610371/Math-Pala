import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, Question, ShopConfig } from '../types/game';
import { generateQuestion } from '../utils/questionGenerator';
import { playCorrect, playWrong, playTick, playClick } from '../utils/audio';
import { ArrowLeft, Clock, Trophy, Award } from 'lucide-react';

interface GameStageProps {
  shop: ShopConfig;
  difficulty: Difficulty;
  highScore: number;
  onGameOver: (solvedCount: number) => void;
  onExit: () => void;
}

const TOTAL_TIME = 30; // 30 seconds

export const GameStage: React.FC<GameStageProps> = ({
  shop,
  difficulty,
  highScore,
  onGameOver,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion(shop.id, difficulty)
  );
  const [feedback, setFeedback] = useState<{
    selectedOption: number | null;
    isCorrect: boolean | null;
  }>({
    selectedOption: null,
    isCorrect: null,
  });
  const [cheerMessage, setCheerMessage] = useState<string>('พร้อมแล้ว เริ่มเลย!');

  const isAnsweringRef = useRef(false);
  const solvedCountRef = useRef(0);
  solvedCountRef.current = solvedCount;

  const cheerPhrases = [
    'เก่งมากเลย!',
    'ถูกต้องแล้วจ้า!',
    'สุดยอดไปเลย!',
    'เร็วมากเลย!',
    'ยอดเยี่ยมนักคิดเลข!',
    'ไปต่อข้อต่อไปเลย!',
  ];

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onGameOver(solvedCountRef.current);
          }, 100);
          return 0;
        }

        if (prev <= 6 && prev > 1) {
          playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGameOver]);

  const handleSelectOption = useCallback(
    (option: number) => {
      if (isAnsweringRef.current || timeLeft <= 0) return;

      isAnsweringRef.current = true;
      const isCorrect = option === currentQuestion.correctAnswer;

      if (isCorrect) {
        playCorrect();
        setSolvedCount((c) => c + 1);
        setFeedback({ selectedOption: option, isCorrect: true });
        setCheerMessage(
          cheerPhrases[Math.floor(Math.random() * cheerPhrases.length)]
        );

        setTimeout(() => {
          setFeedback({ selectedOption: null, isCorrect: null });
          setCurrentQuestion(generateQuestion(shop.id, difficulty));
          isAnsweringRef.current = false;
        }, 180);
      } else {
        playWrong();
        setFeedback({ selectedOption: option, isCorrect: false });
        setCheerMessage(`ข้อนี้ตอบ ${currentQuestion.correctAnswer} ${currentQuestion.unit} จ้า สู้ต่อเลย!`);

        setTimeout(() => {
          setFeedback({ selectedOption: null, isCorrect: null });
          setCurrentQuestion(generateQuestion(shop.id, difficulty));
          isAnsweringRef.current = false;
        }, 650);
      }
    },
    [currentQuestion, difficulty, shop.id, timeLeft, cheerPhrases]
  );

  // Keyboard 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[index] !== undefined) {
          handleSelectOption(currentQuestion.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, handleSelectOption]);

  const progressPercent = (timeLeft / TOTAL_TIME) * 100;
  const isUrgent = timeLeft <= 5;
  const difficultyLabel = difficulty === 'easy' ? shop.easyLabel : shop.hardLabel;
  const isHardVariant = difficulty === 'hard' || shop.id === 'myshop';

  return (
    <div className="h-full w-full flex flex-col justify-between p-[clamp(0.25rem,1.2vh,0.75rem)] overflow-hidden select-none bg-linear-to-b from-amber-100 via-orange-50 to-amber-200">
      {/* Top Arcade HUD Bar - Fluid Compact Height */}
      <div className="h-[clamp(2.1rem,7.2vh,3rem)] bg-amber-950 border-2 border-amber-800 rounded-xl sm:rounded-2xl px-2 sm:px-3 text-white shadow-md flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            playClick();
            onExit();
          }}
          className="btn-game-yellow px-2 sm:px-3 py-[clamp(0.15rem,0.6vh,0.35rem)] rounded-lg sm:rounded-xl text-amber-950 font-black text-[clamp(0.65rem,1.8vh,0.8rem)] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>ออก</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[clamp(1rem,3.2vh,1.4rem)]">{shop.icon}</span>
          <span className="font-black text-yellow-300 text-[clamp(0.75rem,2.4vh,1rem)] font-heading truncate max-w-[140px] sm:max-w-none">
            {shop.name}
          </span>
          <span
            className={`text-[clamp(0.6rem,1.8vh,0.75rem)] px-2 py-[clamp(0.05rem,0.3vh,0.2rem)] rounded-md font-black shrink-0 ${
              isHardVariant
                ? 'bg-orange-500 text-white border border-orange-300'
                : 'bg-emerald-500 text-white border border-emerald-300'
            }`}
          >
            {difficultyLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-amber-900 border border-yellow-400/50 px-2 sm:px-2.5 py-[clamp(0.1rem,0.4vh,0.25rem)] rounded-lg sm:rounded-xl text-[clamp(0.65rem,1.8vh,0.75rem)] text-yellow-200 font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="hidden xs:inline">สถิติ:</span>
          <span className="font-mono tabular-nums text-yellow-300 font-black">
            {highScore} ข้อ
          </span>
        </div>
      </div>

      {/* Main Arcade Arena: 2 Columns Full-Height Split */}
      <div className="grid grid-cols-12 gap-[clamp(0.3rem,1.2vw,0.75rem)] flex-1 my-[clamp(0.2rem,0.8vh,0.5rem)] min-h-0 items-stretch overflow-hidden">
        {/* Left Column: Timer Gauge + Scoreboard + Shopkeeper */}
        <div className="col-span-4 sm:col-span-3 lg:col-span-3 bg-white rounded-xl sm:rounded-2xl p-[clamp(0.25rem,1vh,0.75rem)] border-2 border-amber-300 shadow-md flex flex-col justify-between items-center text-center relative overflow-hidden">
          <div
            className={`absolute top-0 inset-x-0 h-1.5 bg-linear-to-r ${shop.themeColor.gradient}`}
          ></div>

          {/* Fluid Arcade Timer */}
          <div className="w-full flex flex-col items-center">
            <div className="text-[clamp(0.55rem,1.6vh,0.7rem)] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>เวลาที่เหลือ</span>
            </div>

            <div
              className={`w-[clamp(3.4rem,13.5vh,6rem)] h-[clamp(3.4rem,13.5vh,6rem)] rounded-xl sm:rounded-2xl border-3 sm:border-4 flex flex-col items-center justify-center transition-all ${
                isUrgent
                  ? 'border-red-600 bg-red-100 text-red-600 scale-105 animate-pulse shadow-md'
                  : 'border-amber-400 bg-amber-50 text-amber-950 shadow-inner'
              }`}
            >
              <span className="text-[clamp(1.4rem,6vh,2.5rem)] font-black font-mono tabular-nums leading-none">
                {timeLeft}
              </span>
              <span className="text-[clamp(0.55rem,1.6vh,0.75rem)] font-black mt-0.5 text-slate-600 leading-none">
                วิ
              </span>
            </div>

            {/* Time Bar */}
            <div className="w-full bg-slate-200 rounded-full h-[clamp(0.25rem,0.9vh,0.5rem)] mt-[clamp(0.2rem,0.6vh,0.4rem)] overflow-hidden border border-slate-300">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isUrgent ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Scoreboard: Solved Count */}
          <div className="w-full py-[clamp(0.15rem,0.7vh,0.4rem)] px-2 rounded-xl bg-amber-950 border border-yellow-400 text-white flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 shrink-0" />
              <span className="text-[clamp(0.6rem,1.8vh,0.75rem)] font-black text-yellow-200 leading-none">
                ทำได้
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[clamp(1rem,4.2vh,1.6rem)] font-black text-yellow-300 font-mono tabular-nums leading-none">
                {solvedCount}
              </span>
              <span className="text-[clamp(0.55rem,1.6vh,0.7rem)] font-bold text-yellow-200">ข้อ</span>
            </div>
          </div>

          {/* Shopkeeper Mascot Speech Bubble */}
          <div className="w-full flex items-center gap-1.5 bg-amber-50 border border-amber-200 p-[clamp(0.2rem,0.6vh,0.4rem)] rounded-xl text-left">
            <div className="text-[clamp(1.1rem,4vh,1.8rem)] shrink-0 p-0.5 bg-white rounded-md border border-amber-200">
              {shop.shopkeeperAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[clamp(0.55rem,1.5vh,0.65rem)] font-bold text-amber-800 block leading-none truncate">
                {shop.shopkeeper}
              </span>
              <p className="text-[clamp(0.6rem,1.8vh,0.75rem)] font-bold text-slate-800 line-clamp-2 mt-0.5 leading-tight">
                {cheerMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Question Stage + 4 Big Fluid Answer Buzzer Buttons */}
        <div className="col-span-8 sm:col-span-9 lg:col-span-9 bg-white rounded-xl sm:rounded-2xl p-[clamp(0.25rem,1vh,0.75rem)] border-2 border-amber-300 shadow-md flex flex-col justify-between overflow-hidden">
          {/* Question Stage Card - Fluid Flexible Height */}
          <div className="bg-amber-50/70 rounded-xl sm:rounded-2xl p-[clamp(0.25rem,1vh,0.75rem)] border border-amber-200 text-center flex-1 flex flex-col justify-center items-center overflow-hidden min-h-0">
            {/* Story Text */}
            <p className="text-[clamp(0.75rem,2.8vh,1.2rem)] font-black text-slate-900 font-heading leading-snug line-clamp-2">
              {currentQuestion.storyTitle}
            </p>

            {/* Visual Items (if present) */}
            {currentQuestion.visualItems && currentQuestion.visualItems.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 my-[clamp(0.1rem,0.4vh,0.35rem)] py-[clamp(0.1rem,0.3vh,0.25rem)] px-2 bg-white/90 rounded-lg border border-amber-200 shadow-2xs">
                {currentQuestion.visualItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-amber-100/70 px-1.5 py-0.5 rounded text-[clamp(0.6rem,1.8vh,0.75rem)] font-bold text-amber-950"
                  >
                    <span className="text-[clamp(0.8rem,2.2vh,1.1rem)]">{item.emoji}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Equation Badge */}
            {currentQuestion.equationText && (
              <div className="my-[clamp(0.15rem,0.5vh,0.4rem)] inline-block bg-white shadow-xs border-2 border-amber-300 px-[clamp(0.5rem,1.8vw,1.25rem)] py-[clamp(0.1rem,0.4vh,0.3rem)] rounded-lg sm:rounded-xl">
                <span className="text-[clamp(0.95rem,3.8vh,1.6rem)] font-black font-mono text-amber-900 tracking-wider leading-none">
                  {currentQuestion.equationText}
                </span>
              </div>
            )}

            {/* Prompt */}
            <p className="text-[clamp(0.7rem,2.4vh,1.05rem)] font-black text-amber-700 mt-0.5 font-heading line-clamp-1 leading-tight">
              👉 {currentQuestion.questionPrompt}
            </p>
          </div>

          {/* 4 Big Arcade Answer Buzzer Buttons - Fluid Heights & Font Sizes */}
          <div className="grid grid-cols-2 gap-[clamp(0.25rem,1vw,0.6rem)] mt-[clamp(0.2rem,0.8vh,0.5rem)] shrink-0">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = feedback.selectedOption === option;
              const isCorrectAnswer = option === currentQuestion.correctAnswer;

              let buttonClass = 'btn-game-white';

              if (feedback.selectedOption !== null) {
                if (isCorrectAnswer) {
                  buttonClass = 'btn-game-green scale-102';
                } else if (isSelected && !feedback.isCorrect) {
                  buttonClass = 'btn-game-red animate-shake';
                } else {
                  buttonClass = 'opacity-40 border-slate-200';
                }
              }

              return (
                <button
                  key={`${currentQuestion.id}-${idx}-${option}`}
                  disabled={feedback.selectedOption !== null || timeLeft <= 0}
                  onClick={() => handleSelectOption(option)}
                  className={`h-[clamp(2.4rem,10.2vh,4.2rem)] px-2 sm:px-3 rounded-xl sm:rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-100 ${buttonClass}`}
                >
                  {/* Keyboard key badge */}
                  <span className="w-[clamp(1.1rem,3.2vh,1.5rem)] h-[clamp(1.1rem,3.2vh,1.5rem)] rounded-md bg-black/10 flex items-center justify-center text-[clamp(0.6rem,1.8vh,0.75rem)] font-mono font-black shrink-0">
                    {idx + 1}
                  </span>

                  <div className="flex-1 text-center min-w-0">
                    <span className="text-[clamp(1.1rem,4.4vh,2rem)] font-black font-mono tabular-nums leading-none">
                      {option}
                    </span>
                    <span className="text-[clamp(0.6rem,1.8vh,0.85rem)] font-bold ml-1 opacity-80">
                      {currentQuestion.unit}
                    </span>
                  </div>

                  <div className="w-[clamp(1.1rem,3.2vh,1.5rem)]"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Keyboard Hint Bar */}
      <div className="text-center text-[clamp(0.55rem,1.6vh,0.7rem)] text-amber-900 font-bold shrink-0 leading-none">
        แตะตัวเลือกบนหน้าจอ หรือกดคีย์บอร์ดเลข [1] [2] [3] [4] เพื่อตอบ
      </div>
    </div>
  );
};
