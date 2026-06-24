import React, { useState, useEffect } from 'react';

export default function DialogueBox({
  speaker,
  speakerRole,
  dialogue,
  onOptionSelect,
  choices,
  question,
  wrongChoiceIndex,
  onChoiceSelect,
  verified,
  audioEnabled,
  toggleAudio,
  onNext,
  character,
  isNarrationPlaying
}) {
  const [displayedText, setDisplayedText] = useState('');

  // Reset text and do a typewriter effect when the dialogue changes
  useEffect(() => {
    if (!dialogue) {
      setDisplayedText('');
      return;
    }
    const cleanText = dialogue.normalize('NFC');
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < cleanText.length) {
        setDisplayedText(cleanText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [dialogue]);

  const isDialogueOnly = !choices && !question;
  const hasOptions = choices || (question && !verified);
  const activeSpeaker = hasOptions ? "BẠN" : speaker;

  return (
    <div
      onClick={isDialogueOnly ? onNext : undefined}
      className={`relative w-full max-w-4xl bg-[#1a0f0d]/92 border border-[#D4AF37]/45 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-8 pb-7 sm:pb-9 shadow-[0_10px_30px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-300 z-10 mx-1 sm:mx-0 ${isDialogueOnly ? 'cursor-pointer active:border-[#D4AF37]/80' : ''
        }`}
    >
      {/* Speaker Name Badge */}
      {activeSpeaker && (
        <div className="absolute -top-3 sm:-top-3.5 right-3 sm:right-6 md:right-10 bg-[#D4AF37] text-[#1a0f0d] px-3 sm:px-5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-widest shadow-lg border border-white/20 select-none">
          {activeSpeaker}
        </div>
      )}

      {/* Main Content */}
      <div className="mt-1 sm:mt-2 flex flex-col gap-2">
        {/* Role subtitle */}
        {speakerRole && (
          <span className="text-[10px] sm:text-xs font-ui tracking-widest text-[#FFB74D] uppercase font-semibold select-none opacity-90">
            {speakerRole}
          </span>
        )}

        {/* Dialogue text */}
        {displayedText && (
          <div className="min-h-[32px] sm:min-h-[40px]">
            <p className="text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed font-dialogue text-justify drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] tracking-wide">
              {displayedText}
            </p>
          </div>
        )}

        {/* Quiz Questions */}
        {question && !verified && (
          <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-2.5 animate-fade-in">
            <p className="text-xs sm:text-sm text-[#FFB74D] font-dialogue italic mb-1.5 sm:mb-3 opacity-95 leading-relaxed">
              {question.text}
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              {question.choices.map((choice, idx) => {
                const isWrong = wrongChoiceIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChoiceSelect(choice, idx);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base font-dialogue transition-all duration-300 cursor-pointer active:scale-[0.98] ${isWrong
                      ? 'bg-red-950/50 border-red-500 text-red-200 animate-pulse'
                      : 'bg-black/35 border-[#D4AF37]/25 text-slate-200 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/10'
                      }`}
                  >
                    <span className="font-serif text-[#D4AF37] mr-1.5 sm:mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {choice.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Branching Dialog Choices */}
        {choices && (
          <div className="mt-2 sm:mt-4 space-y-1.5 sm:space-y-2.5 animate-fade-in">
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect(choice);
                  }}
                  className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border bg-black/35 border-[#D4AF37]/25 text-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-sm sm:text-base font-dialogue transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  <span className="font-serif text-[#D4AF37] mr-1.5 sm:mr-2">{idx + 1}.</span>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue indicator */}
      {isDialogueOnly && (
        <div className="absolute bottom-2 sm:bottom-3.5 right-3 sm:right-6 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-ui font-bold text-[#D4AF37] tracking-[0.1em] sm:tracking-[0.15em] uppercase select-none pointer-events-none">
          {isNarrationPlaying && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></div>
              <span className="text-[8px] sm:text-[9px] opacity-80">ĐANG PHÁT</span>
            </div>
          )}
          <span className="animate-pulse opacity-90">Bấm để tiếp &raquo;</span>
        </div>
      )}
    </div>
  );
}
